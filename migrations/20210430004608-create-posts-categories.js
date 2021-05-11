'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('postsCategories', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
      },
      postId: {
        primary_key: true,
        references: { model: 'Posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        primary_key: true,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
      { timestamps: false }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('postsCategories');
  }
};