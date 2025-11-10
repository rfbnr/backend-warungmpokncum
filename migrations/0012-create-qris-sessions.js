'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('qris_sessions', {
      id: { type: S.INTEGER, primaryKey:true, autoIncrement:true },
      order_id: {
        type: S.INTEGER, allowNull:false,
        references: { model:'orders', key:'id' },
        onUpdate:'CASCADE', onDelete:'CASCADE'
      },
      // ref unik biar enak track (bisa jadi acquirerRef / externalId)
      ref: { type: S.STRING(64), allowNull:false, unique:true },
      payload: { type: S.TEXT, allowNull:false }, // string yang di-QR-kan
      status: { 
        type: S.ENUM('PENDING','SUCCESS','FAILED','EXPIRED'),
        allowNull:false, defaultValue: 'PENDING'
      },
      expires_at: { type: S.DATE, allowNull:false },
      created_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
      updated_at: { type: S.DATE, allowNull:false, defaultValue: S.fn('NOW') },
    });
  },
  async down(q) {
    await q.dropTable('qris_sessions');
    // ENUM cleanup untuk PG; MySQL diabaikan aman
    await q.sequelize.query('DROP TYPE IF EXISTS "enum_qris_sessions_status";').catch(()=>{});
  }
};
