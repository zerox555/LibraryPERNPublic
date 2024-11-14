'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [
      {
        name: "The recokening",
        author: "Jsdf",
        year_published: 1923,
      },
      {
        name: "The Hobbit",
        author: "J.R.R TOlkein",
        year_published: 1965,
      },
      {
        name: "Maze runner",
        author: "Bunny Lim",
        year_published: 1998,
      },
      {
        name: "Holygrail",
        author: "you ds",
        year_published: 2002,
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books',null,{});
  }
};
