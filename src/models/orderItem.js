// backend/src/models/order_item.js
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      // NEW: gaya kuah/kering
      style_key:  { type: DataTypes.STRING(32),  allowNull: true },
      style_name: { type: DataTypes.STRING(100), allowNull: true },

      // Existing sesuai skema tabelmu
      menu_name:    { type: DataTypes.STRING,  allowNull: false },
      variant_name: { type: DataTypes.STRING,  allowNull: true },
      unit_price:   { type: DataTypes.INTEGER, allowNull: false },
      qty:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      line_total:   { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "order_items",
      underscored: true,
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order,    { foreignKey: "order_id" });
    OrderItem.belongsTo(models.MenuItem, { foreignKey: "menu_item_id" });
    OrderItem.belongsTo(models.Variant,  { foreignKey: "variant_id" });
    OrderItem.belongsToMany(models.Addon, {
      through: models.OrderItemAddon,
      foreignKey: "order_item_id",
      otherKey: "addon_id",
    });
  };

  return OrderItem;
};
