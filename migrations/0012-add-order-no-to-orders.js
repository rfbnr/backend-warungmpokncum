'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'order_no', {
      type: Sequelize.STRING(32),
      allowNull: true,
      unique: true,
      after: 'id',
    });
    await queryInterface.addIndex('orders', ['order_no'], {
      unique: true,
      name: 'orders_order_no_uq',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('orders', 'orders_order_no_uq').catch(()=>{});
    await queryInterface.removeColumn('orders', 'order_no');
  }
};
