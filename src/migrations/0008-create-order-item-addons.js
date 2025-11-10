'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('order_item_addons', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      order_item_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'order_items', key:'id' },
        onUpdate:'CASCADE', onDelete:'CASCADE'
      },
      addon_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'addons', key:'id' },
        onUpdate:'CASCADE', onDelete:'RESTRICT'
      },
      addon_name: { type: S.STRING, allowNull:false },
      addon_price: { type: S.INTEGER, allowNull:false },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){ await q.dropTable('order_item_addons'); }
}
