module.exports = (sequelize, DataTypes) => {
  const OrderItemAddon = sequelize.define('OrderItemAddon',{
    addon_name: { type: DataTypes.STRING, allowNull:false },
    addon_price: { type: DataTypes.INTEGER, allowNull:false }
  }, { tableName:'order_item_addons', underscored:true });

  OrderItemAddon.associate = (models)=>{
    OrderItemAddon.belongsTo(models.OrderItem, { foreignKey:'order_item_id' });
    OrderItemAddon.belongsTo(models.Addon, { foreignKey:'addon_id' });
  };
  return OrderItemAddon;
};
