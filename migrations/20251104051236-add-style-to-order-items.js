"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek kolom existing dulu (aman kalau dijalankan ulang)
    const [cols] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'order_items'
    `);
    const has = (name) => cols.some((c) => c.COLUMN_NAME === name);

    if (!has("style_key")) {
      await queryInterface.addColumn("order_items", "style_key", {
        type: Sequelize.STRING(32),
        allowNull: true,
        after: "menu_item_id",
      });
    }
    if (!has("style_name")) {
      await queryInterface.addColumn("order_items", "style_name", {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: "style_key",
      });
    }
  },

  async down(queryInterface) {
    // Hapus kalau ada (biar idempotent saat rollback)
    try { await queryInterface.removeColumn("order_items", "style_key"); } catch (_) {}
    try { await queryInterface.removeColumn("order_items", "style_name"); } catch (_) {}
  },
};
