'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users',{
      id: { type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      email: { type: Sequelize.STRING, allowNull:false, unique:true },
      name: { type: Sequelize.STRING, allowNull:false },
      password: { type: Sequelize.STRING, allowNull:false },
      created_at: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
}
