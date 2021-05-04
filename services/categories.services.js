const Joi = require('@hapi/joi');
const { Categories } = require('../models');

const CATEGORY_SCHEMA = Joi.object({
  name: Joi.string().min(2).required(),
});

const INVALID_DATA = (message) => ({
  name: 'InvalidDataError',
  message,
  status: 400,
});

const getAllCategories = async () => {
  const categories = await Categories.findAll();

  return categories;
};

const getCategory = async (id) => {
  const category = await Categories.findAll({ where: { id } });

  return category;
};

const createCategory = async (category) => {
  const { error } = CATEGORY_SCHEMA.validate({ name: category });

  if (error) throw INVALID_DATA(error.message);

  const newCategory = await Categories.create({ name: category });

  return newCategory;
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
};
