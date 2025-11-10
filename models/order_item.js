"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
      OrderItem.belongsTo(models.MenuItem, { foreignKey: "menu_item_id" });
      OrderItem.belongsTo(models.Variant, { foreignKey: "variant_id" });
      OrderItem.hasMany(models.OrderItemAddon, { foreignKey: "order_item_id" });
    }
  }
  OrderItem.init(
    {
      order_id:      { type: DataTypes.INTEGER, allowNull: false },
      menu_item_id:  { type: DataTypes.INTEGER, allowNull: false },
      // NEW:
      style_key:     { type: DataTypes.STRING(32),  allowNull: true  },
      style_name:    { type: DataTypes.STRING(100), allowNull: true  },

      variant_id:    { type: DataTypes.INTEGER, allowNull: true  },
      qty:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      unit_price:    { type: DataTypes.INTEGER, allowNull: false }, // harga final per unit (base + variant + addon)
      subtotal:      { type: DataTypes.INTEGER, allowNull: false }, // unit_price * qty
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
    }
  );
  return OrderItem;
};
