'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',[
      {
        name:"jingen",
        password:"asdoajhdpoo2103u20h4nnsodfnosdf"
      },
      {
        name:"Adam",
        password:"a123nfsd9u92niknsd9f9sdnf9n092w"
      },
      {
        name:"Ian",
        password:"2137u0980dgdfngnfdingkjdfngdfgdk"
      }


    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
