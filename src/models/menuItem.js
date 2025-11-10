module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem',{
    name: { type: DataTypes.STRING, allowNull:false },
    base_price: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0 },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING }
  }, { tableName:'menu_items', underscored:true });

  MenuItem.associate = (models)=>{
    MenuItem.belongsTo(models.MenuCategory, { foreignKey:'menu_category_id' });
    MenuItem.hasMany(models.Variant, { foreignKey:'menu_item_id' });
  };
  return MenuItem;
};
