'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    "Posts",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: { model: 'Users', key: 'id' },
        type: Sequelize.INTEGER,
      },
      published: {
        isDate: true,
        type: Sequelize.DATE,
      },
      updated: {
        isDate: true,
        type: Sequelize.DATE,
      },
    }
  ),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable("Posts"),
};
