const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authKasir');
const { sequelize, Order, Payment, OrderItem, OrderItemAddon, Addon, QrisSession } = require('../models');

// =======================
// Receipt via ?token=xxx
// =======================
router.get('/orders/:id/receipt', async (req, res) => {
  try {
    const qtoken = req.query.token || '';
    if (!qtoken) return res.status(401).send('{"message":"Unauthorized"}');
    jwt.verify(qtoken, process.env.JWT_SECRET);

    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: OrderItemAddon }],
          order: [['created_at','ASC']]
        },
        { model: Payment }
      ]
    });
    if(!order) return res.status(404).send('<h1>Order not found</h1>');

    const fmt = (n)=> Number(n||0).toLocaleString('id-ID');
    const rows = (order.OrderItems||[]).map(it=>{
      const addons = (it.OrderItemAddons||[]).map(a=>`<div class="addon">+ ${a.addon_name} (Rp${fmt(a.addon_price)})</div>`).join('');
      const style = it.style_name ? ` • ${it.style_name}` : '';
      const varnm = it.variant_name ? ` • ${it.variant_name}` : '';
      return `
        <tr>
          <td>
            <div class="name"><b>${it.menu_name}${style}${varnm}</b></div>
            <div class="meta">x${it.qty} • Rp${fmt(it.unit_price)} / item</div>
            ${addons}
          </td>
          <td class="right">Rp${fmt(it.line_total)}</td>
        </tr>`;
    }).join('');

    const paid = order.status === 'PAID';
    const paidAt = order.paid_at ? new Date(order.paid_at).toLocaleString('id-ID') : '-';
    const createdAt = order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-';

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Receipt ${order.order_no || ('#'+order.id)}</title>
<style>
  body{font-family:system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; color:#0f172a; padding:24px;}
  .paper{max-width:680px;margin:0 auto;border:1px solid #e5e7eb;border-radius:16px; padding:20px;}
  .head{display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;}
  .brand{font-weight:800; font-size:18px; color:#0F2A5F;}
  .muted{color:#6b7280; font-size:12px;}
  table{width:100%; border-collapse:collapse; margin-top:12px;}
  td{padding:8px 0; vertical-align:top; border-bottom:1px dashed #e5e7eb;}
  td.right{text-align:right;}
  .total{font-size:16px; font-weight:700;}
  .addon{color:#6b7280; font-size:12px;}
  .meta{color:#6b7280; font-size:12px;}
  .badge{display:inline-block; font-size:11px; padding:2px 8px; border-radius:999px;}
  .badge-paid{background:#dcfce7; color:#166534;}
  .badge-unpaid{background:#fef3c7; color:#92400e;}
  .actions{margin-top:16px; display:flex; gap:8px;}
  .btn{padding:8px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff;}
  .btn-primary{background:#0F2A5F; color:#fff; border-color:#0F2A5F;}
  @media print {.actions{display:none}}
</style>
</head>
<body>
  <div class="paper">
    <div class="head">
      <div>
        <div class="brand">Warung Mpok Ncum</div>
        <div class="muted">${order.order_no || ('#'+order.id)}</div>
      </div>
      <div>
        <span class="badge ${paid ? 'badge-paid' : 'badge-unpaid'}">${order.status}</span>
      </div>
    </div>
    <div class="muted">Dibuat: ${createdAt}</div>
    <div class="muted">Dibayar: ${paidAt}</div>

    <table>
      <tbody>
        ${rows}
        <tr>
          <td class="total">Total</td>
          <td class="right total">Rp${fmt(order.total_amount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="actions">
      <button class="btn" onclick="window.close()">Tutup</button>
      <button class="btn btn-primary" onclick="window.print()">Print</button>
    </div>
  </div>
</body>
</html>`;
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    return res.status(401).send('{"message":"Unauthorized"}');
  }
});

// Semua route berikut butuh Authorization header
router.use(auth);

// =======================
// ORDERS basic
// =======================
router.get('/orders', async (req,res)=>{
  const orders = await Order.findAll({ order: [['created_at','DESC']], limit: 100 });
  res.json(orders);
});

router.get('/orders/:id', async (req,res)=>{
  const { id } = req.params;
  const order = await Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        include: [{ model: OrderItemAddon, include: [Addon] }],
        order: [['created_at','ASC']]
      },
      { model: Payment }
    ]
  });
  if(!order) return res.status(404).json({message:'Order not found'});
  res.json(order);
});

router.post('/orders/:id/pay', async (req,res)=>{
  const { id } = req.params;
  const { method='CASH' } = req.body;
  const order = await Order.findByPk(id);
  if(!order) return res.status(404).json({message:'Order not found'});
  if(order.status === 'PAID') return res.json(order);

  const paidAt = new Date();
  await order.update({ status:'PAID', payment_method: method, paid_at: paidAt });
  await Payment.create({ order_id: order.id, method, amount: order.total_amount, paid_at: paidAt });
  res.json(order);
});

// =======================
// QRIS Flow
// =======================

// Helper: generate dummy payload & ref
function genRef(orderId) {
  const ts = Date.now().toString(36).toUpperCase();
  return `WMNQR-${orderId}-${ts}`;
}
function genPayload(order, ref) {
  // payload dummy yang konsisten; real case: pakai payload EMVCo dari gateway
  return `WMN|QRIS|REF=${ref}|ORDER=${order.id}|AMOUNT=${order.total_amount}`;
}

// Start / reuse session jika masih PENDING & belum expired
router.post('/orders/:id/qris/start', async (req,res)=>{
  const { id } = req.params;
  const order = await Order.findByPk(id);
  if(!order) return res.status(404).json({message:'Order not found'});
  if(order.status === 'PAID') return res.status(400).json({message:'Order already paid'});

  // cari session aktif (belum expired & PENDING)
  const now = new Date();
  const existed = await QrisSession.findOne({
    where: {
      order_id: order.id,
      status: 'PENDING',
    },
    order: [['created_at','DESC']]
  });

  if (existed && new Date(existed.expires_at) > now) {
    return res.json({
      session_id: existed.id,
      ref: existed.ref,
      payload: existed.payload,
      expires_at: existed.expires_at,
      amount: order.total_amount,
      order_id: order.id
    });
  }

  // buat session baru
  const ref = genRef(order.id);
  const payload = genPayload(order, ref);
  const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 menit

  const qs = await QrisSession.create({
    order_id: order.id,
    ref,
    payload,
    status: 'PENDING',
    expires_at: expires
  });

  return res.json({
    session_id: qs.id,
    ref: qs.ref,
    payload: qs.payload,
    expires_at: qs.expires_at,
    amount: order.total_amount,
    order_id: order.id
  });
});

// Cek status
router.get('/qris/:sessionId/status', async (req,res)=>{
  const { sessionId } = req.params;
  const qs = await QrisSession.findByPk(sessionId);
  if(!qs) return res.status(404).json({message:'Session not found'});

  // auto-expire kalau lewat waktu
  if (qs.status === 'PENDING' && new Date(qs.expires_at) <= new Date()) {
    await qs.update({ status: 'EXPIRED' });
  }
  res.json({ status: qs.status });
});

// Simulator (DEV): tandai session sukses → order PAID + payment row
router.post('/qris/:sessionId/simulate-paid', async (req,res)=>{
  const { sessionId } = req.params;
  const qs = await QrisSession.findByPk(sessionId);
  if(!qs) return res.status(404).json({message:'Session not found'});
  if(qs.status !== 'PENDING') return res.status(400).json({message:`Session already ${qs.status}`});

  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(qs.order_id, { transaction:t });
    if(!order) throw new Error('Order not found');

    const paidAt = new Date();
    await order.update({ status:'PAID', payment_method:'QRIS', paid_at: paidAt }, { transaction:t });
    await Payment.create({ order_id: order.id, method:'QRIS', amount: order.total_amount, paid_at: paidAt }, { transaction:t });
    await qs.update({ status:'SUCCESS' }, { transaction:t });

    await t.commit();
    res.json({ ok:true });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ message: e.message || 'Failed' });
  }
});

module.exports = router;
