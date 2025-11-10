'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('menu_items', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      menu_category_id: {
        type: S.INTEGER,
        allowNull:false,
        references: { model:'menu_categories', key:'id' },
        onUpdate:'CASCADE', onDelete:'RESTRICT'
      },
      name: { type: S.STRING, allowNull:false },
      base_price: { type: S.INTEGER, allowNull:false, defaultValue:0 },
      description: { type: S.TEXT },
      image_url: { type: S.STRING },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){ await q.dropTable('menu_items'); }
}
