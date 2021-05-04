'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable(
    "Users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      displayName: {
        allowNull: false,
        min: 8,
        type: Sequelize.STRING,
      },
      email:{
        allowNull: false,
        isEmail: true,
        type: Sequelize.STRING,
        unique: true,
      },
      password:{
        allowNull: false,
        min:6,
        type: Sequelize.STRING,
      },
      image:{
        type: Sequelize.STRING,
      },
    }
  ),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable("Users"),
};
