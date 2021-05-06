'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('postsCategories', {
      postId: {
        primary_key: true,
        references: { model: 'Posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categoryIds: {
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