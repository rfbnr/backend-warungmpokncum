'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('variants', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      menu_item_id: {
        type: S.INTEGER,
        allowNull:false,
        references: { model:'menu_items', key:'id' },
        onUpdate:'CASCADE', onDelete:'CASCADE'
      },
      name: { type: S.STRING, allowNull:false },
      extra_price: { type: S.INTEGER, allowNull:false, defaultValue:0 },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){ await q.dropTable('variants'); }
}
