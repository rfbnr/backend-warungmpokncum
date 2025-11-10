'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('order_items', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      order_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'orders', key:'id' },
        onUpdate:'CASCADE', onDelete:'CASCADE'
      },
      menu_item_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'menu_items', key:'id' },
        onUpdate:'CASCADE', onDelete:'RESTRICT'
      },
      variant_id: {
        type: S.INTEGER, allowNull:true,
        references: { model:'variants', key:'id' },
        onUpdate:'CASCADE', onDelete:'SET NULL'
      },
      menu_name: { type: S.STRING, allowNull:false },
      variant_name: { type: S.STRING },
      unit_price: { type: S.INTEGER, allowNull:false },
      qty: { type: S.INTEGER, allowNull:false, defaultValue:1 },
      line_total: { type: S.INTEGER, allowNull:false },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){ await q.dropTable('order_items'); }
}
