const Joi = require('@hapi/joi');
const { Op } = require('sequelize');

const { Posts, User, Categories, postsCategories } = require('../models');

const POST_CREATE_SCHEMA = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
});

const POST_EDIT_SCHEMA = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const INVALID_DATA = (message) => ({
  name: 'InvalidDataError',
  message,
  status: 400,
});

const POST_NOT_FOUND = {
  name: 'PostNotFoundError',
  message: 'Post does not exist',
  status: 404,
};

const UNAUTHORIZED_USER = {
  name: 'InvalidUserError',
  message: 'Unauthorized user',
  status: 401,
};

const createPost = async (userId, title, content, categoryIds) => {
  const { error } = POST_CREATE_SCHEMA.validate({ title, content, categoryIds });

  if (error) throw INVALID_DATA(error.message);
  const newPost = await Posts.create({ userId, title, content });

  if (!error) {
    categoryIds.forEach((id) => {
      postsCategories.create({ postId: newPost.id, categoryIds: id });
    });
  }
  return newPost;
};

const getAllPosts = async () => {
  const postsFound = await Posts.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: 'password' },
      },
      {
        model: Categories,
        as: 'categories',
        through: { attributes: [] },
      },
    ],
  });

  return postsFound;
};

const getPostById = async (id) => {
  const postFound = await Posts.findOne({
    where: { id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: 'password' },
      },
      {
        model: Categories,
        as: 'categories',
        through: { attributes: [] },
      },

    ],
  });

  if (!postFound) throw POST_NOT_FOUND;

  return postFound;
};

const getPostByQuery = async (query) => {
  const post = Posts.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${query}%`,
        },
        content: {
          [Op.like]: `%${query}%`,
        },
      },
    },
    include: [{
      model: User,
      as: 'user',
      attributes: { exclude: 'password' },
    },
    {
      model: Categories, as: 'categories', through: { attributes: [] },
    },
    ],
  });

  return post;
};

const editPost = async (id, userId, title, content) => {
  const { error } = POST_EDIT_SCHEMA.validate({ title, content });

  if (error) throw INVALID_DATA(error.message);

  const edit = await Posts.update(
    { title, content },
    { where: { id, userId } },
  );

  if (edit[0] === 0) throw UNAUTHORIZED_USER;

  const editedPost = await Posts.findOne({
    where: { id, userId },
    attributes: ['title', 'content', 'userId'],
    include: { model: Categories, as: 'categories', through: { attributes: [] } },
  });

  return editedPost;
};

const deletePost = async (id, userId) => {
  const postFound = await Posts.findOne({ where: { id } });

  if (!postFound) throw POST_NOT_FOUND;
  if (postFound.dataValues.userId !== userId) throw UNAUTHORIZED_USER;

  await Posts.destroy({ where: { id, userId } });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  getPostByQuery,
};
