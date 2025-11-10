'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('orders', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      customer_name: { type: S.STRING },
      status: { type: S.ENUM('UNPAID','PAID','CANCELLED'), allowNull:false, defaultValue:'UNPAID' },
      total_amount: { type: S.INTEGER, allowNull:false, defaultValue:0 },
      payment_method: { type: S.ENUM('CASH','QRIS','TRANSFER','NONE'), allowNull:false, defaultValue:'NONE' },
      paid_at: { type: S.DATE },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){
    await q.dropTable('orders');
    await q.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";').catch(()=>{});
    await q.sequelize.query('DROP TYPE IF EXISTS "enum_orders_payment_method";').catch(()=>{});
  }
}
