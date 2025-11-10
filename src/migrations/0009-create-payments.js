'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('payments', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      order_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'orders', key:'id' },
        onUpdate:'CASCADE', onDelete:'CASCADE'
      },
      method: { type: S.ENUM('CASH','QRIS','TRANSFER'), allowNull:false },
      amount: { type: S.INTEGER, allowNull:false },
      paid_at: { type: S.DATE, allowNull:false },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){
    await q.dropTable('payments');
    await q.sequelize.query('DROP TYPE IF EXISTS "enum_payments_method";').catch(()=>{});
  }
}
