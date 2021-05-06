module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('postsCategories',
      [
        {
          postId: 1,
          categoryIds: 1,
        },
        {
          postId: 2,
          categoryIds: 2,
        },

      ], { timestamps: false });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
