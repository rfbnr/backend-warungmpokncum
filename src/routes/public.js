const router = require("express").Router();

const {
  sequelize,
  MenuCategory,
  MenuItem,
  Variant,
  Addon,
  Order,
  OrderItem,
  OrderItemAddon,
} = require("../models");

router.get("/menu", async (req, res) => {
  try {
    const categories = await MenuCategory.findAll({
      include: [{ model: MenuItem, include: [Variant] }],
      order: [
        ["id", "ASC"],
        [MenuItem, "id", "ASC"],
        [MenuItem, Variant, "id", "ASC"],
      ],
    });
    const addons = await Addon.findAll({ order: [["id", "ASC"]] });
    return res.json({ categories, addons });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Cannot load menu" });
  }
});

// helper: nomor order harian
function pad4(n){ return String(n).padStart(4,'0'); }
function ymd(d=new Date()){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}${m}${dd}`;
}

router.post("/orders", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { customer_name = "", items = [] } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items");
    }

    const order = await Order.create(
      {
        customer_name,
        status: "UNPAID",
        total_amount: 0,
        payment_method: "NONE",
      },
      { transaction: t }
    );

    let grandTotal = 0;

    for (const it of items) {
      const menu = await MenuItem.findByPk(it.menu_item_id, { transaction: t });
      if (!menu) throw new Error("MenuItem not found");

      let unit = Number(menu.base_price || 0);

      let variant = null;
      if (it.variant_id) {
        variant = await Variant.findByPk(it.variant_id, { transaction: t });
        if (variant) unit += Number(variant.extra_price || 0);
      }

      const addIds = Array.isArray(it.addon_ids) ? it.addon_ids : [];
      const foundAddons = addIds.length
        ? await Addon.findAll({ where: { id: addIds }, transaction: t })
        : [];
      unit += foundAddons.reduce((a, b) => a + Number(b.price || 0), 0);

      const qty = Number(it.qty || 1);
      if (qty <= 0) throw new Error("Invalid qty");

      const line_total = unit * qty;
      grandTotal += line_total;

      const oi = await OrderItem.create(
        {
          order_id: order.id,
          menu_item_id: menu.id,

          // style (kuah/kering)
          style_key: it.style_key || null,
          style_name: it.style_name || null,

          // kolom yang ada di tabel
          menu_name: menu.name,
          variant_id: variant ? variant.id : null,
          variant_name: variant ? variant.name : null,

          unit_price: unit,
          qty,
          line_total,
        },
        { transaction: t }
      );

      if (foundAddons.length) {
        await OrderItemAddon.bulkCreate(
          foundAddons.map((ad) => ({
            order_item_id: oi.id,
            addon_id: ad.id,
            addon_name: ad.name,
            addon_price: ad.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          { transaction: t }
        );
      }
    }

    // total
    order.total_amount = grandTotal;

    // generate order_no harian
    const countToday = await Order.count({
      where: sequelize.where(
        sequelize.fn('DATE', sequelize.col('created_at')),
        '=',
        sequelize.literal('CURDATE()')
      ),
      transaction: t,
    });
    const no = `WMN-${ymd()}-${pad4(countToday)}`; // countToday termasuk order ini karena created_at sudah terisi
    order.order_no = no;

    await order.save({ transaction: t });
    await t.commit();

    return res.json({
      order_id: order.id,
      order_no: order.order_no,
      total_amount: order.total_amount,
      status: order.status,
    });
  } catch (e) {
    await t.rollback();
    console.error(e);
    return res.status(400).json({ error: e.message || "Cannot create order" });
  }
});

module.exports = router;
