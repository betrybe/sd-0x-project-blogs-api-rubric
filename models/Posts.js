module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Posts',
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      published: DataTypes.DATE,
      updated: DataTypes.DATE,
    }, { timestamps: false });

  Post.associate = (model) => {
    Post.belongsTo(model.User, { foreignKey: 'userId', as: 'user' });
  };

  return Post;
};
