module.exports = (sequelize, DataTypes) => {
  const Variant = sequelize.define('Variant',{
    name: { type: DataTypes.STRING, allowNull:false },
    extra_price: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0 }
  }, { tableName:'variants', underscored:true });

  Variant.associate = (models)=>{
    Variant.belongsTo(models.MenuItem, { foreignKey:'menu_item_id' });
  };
  return Variant;
};
