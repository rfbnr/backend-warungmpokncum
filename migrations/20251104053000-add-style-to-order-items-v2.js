"use strict";

/**
 * Tambah kolom 'style_key' dan 'style_name' ke order_items.
 * Menggunakan describeTable agar membaca skema dari koneksi aktif.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable("order_items");

    if (!("style_key" in desc)) {
      await queryInterface.addColumn("order_items", "style_key", {
        type: Sequelize.STRING(32),
        allowNull: true,
        after: "menu_item_id",
      });
    }

    if (!("style_name" in desc)) {
      await queryInterface.addColumn("order_items", "style_name", {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: "style_key",
      });
    }
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable("order_items");
    if ("style_name" in desc) {
      await queryInterface.removeColumn("order_items", "style_name");
    }
    if ("style_key" in desc) {
      await queryInterface.removeColumn("order_items", "style_key");
    }
  },
};
