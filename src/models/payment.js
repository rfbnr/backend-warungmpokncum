module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment',{
    method: { type: DataTypes.ENUM('CASH','QRIS','TRANSFER'), allowNull:false },
    amount: { type: DataTypes.INTEGER, allowNull:false },
    paid_at: { type: DataTypes.DATE, allowNull:false }
  }, { tableName:'payments', underscored:true });

  Payment.associate = (models)=>{
    Payment.belongsTo(models.Order, { foreignKey:'order_id' });
  };
  return Payment;
};
