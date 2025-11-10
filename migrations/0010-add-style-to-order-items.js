"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("order_items", "style_key", {
      type: Sequelize.STRING(32),
      allowNull: true,
      after: "menu_item_id",
    });
    await queryInterface.addColumn("order_items", "style_name", {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: "style_key",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("order_items", "style_key");
    await queryInterface.removeColumn("order_items", "style_name");
  },
};
