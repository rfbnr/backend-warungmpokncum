module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      order_no:      { type: DataTypes.STRING(32), allowNull: true, unique: true },
      customer_name: { type: DataTypes.STRING,     allowNull: true },
      status:        { type: DataTypes.ENUM('UNPAID','PAID','CANCELLED'), allowNull: false, defaultValue: 'UNPAID' },
      total_amount:  { type: DataTypes.INTEGER,    allowNull: false, defaultValue: 0 },
      payment_method:{ type: DataTypes.ENUM('CASH','QRIS','TRANSFER','NONE'), allowNull: false, defaultValue: 'NONE' },
      paid_at:       { type: DataTypes.DATE,       allowNull: true },
    },
    { tableName: "orders", underscored: true }
  );

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, { foreignKey: "order_id" });
    Order.hasMany(models.Payment,   { foreignKey: "order_id" });
  };

  return Order;
};
