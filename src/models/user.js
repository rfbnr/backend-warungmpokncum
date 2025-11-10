module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',{
    email: { type: DataTypes.STRING, allowNull:false, unique:true },
    name: { type: DataTypes.STRING, allowNull:false },
    password: { type: DataTypes.STRING, allowNull:false }
  }, { tableName:'users', underscored:true });
  return User;
};
