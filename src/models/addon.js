// module.exports = (sequelize, DataTypes) => {
//   const Addon = sequelize.define('Addon',{
//     name: { type: DataTypes.STRING, allowNull:false },
//     price: { type: DataTypes.INTEGER, allowNull:false, defaultValue:0 }
//   }, { tableName:'addons', underscored:true });
//   return Addon;
// };

module.exports = (sequelize, DataTypes) => {
  const Addon = sequelize.define(
    "Addon",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: "addons", underscored: true },
  );

  Addon.associate = (models) => {
    Addon.hasMany(models.OrderItemAddon, { foreignKey: "addon_id" });
  };

  return Addon;
};
