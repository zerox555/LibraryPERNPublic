'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'roles', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true, // Adjust as needed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'roles');
  }
};
