module.exports = (sequelize, DataTypes) => {
  const MenuCategory = sequelize.define('MenuCategory',{
    name: { type: DataTypes.STRING, allowNull:false }
  }, { tableName:'menu_categories', underscored:true });

  MenuCategory.associate = (models)=>{
    MenuCategory.hasMany(models.MenuItem, { foreignKey:'menu_category_id' });
  };
  return MenuCategory;
};
