'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('menu_categories', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      name: { type: S.STRING, allowNull:false },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') }
    });
  },
  async down(q){ await q.dropTable('menu_categories'); }
}
