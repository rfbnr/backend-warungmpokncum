// NEW: backend/src/models/qris_session.js
module.exports = (sequelize, DataTypes) => {
  const QrisSession = sequelize.define('QrisSession', {
    ref:        { type: DataTypes.STRING(64), allowNull:false, unique:true },
    payload:    { type: DataTypes.TEXT,       allowNull:false },
    status:     { type: DataTypes.ENUM('PENDING','SUCCESS','FAILED','EXPIRED'), allowNull:false, defaultValue:'PENDING' },
    expires_at: { type: DataTypes.DATE,       allowNull:false },
  }, {
    tableName: 'qris_sessions',
    underscored: true,
  });

  QrisSession.associate = (models) => {
    QrisSession.belongsTo(models.Order, { foreignKey:'order_id' });
  };

  return QrisSession;
};
