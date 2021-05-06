module.exports = (sequelize, _DataTypes) => {
  const postsCategories = sequelize.define('postsCategories',
    {

    }, { timestamps: false });

  postsCategories.associate = (models) => {
    models.Posts.belongsToMany(models.Categories, {
      as: 'categories',
      foreignKey: 'postId',
      otherKey: 'categoryIds',
      through: postsCategories,
    });

    models.Categories.belongsToMany(models.Posts, {
      as: 'posts',
      foreignKey: 'categoryIds',
      otherKey: 'postId',
      through: postsCategories,
    });
  };

  return postsCategories;
};
