const Joi = require('@hapi/joi');
const { Categories } = require('../models');

const INVALID_DATA = (message) => ({
  name: 'InvalidDataError',
  message,
  status: 400,
});

const POST_CREATE_SCHEMA = Joi.object({
  categoryIds: Joi.array().required(),
});

const checkCategories = async (req, res, next) => {
  try {
    const { categoryIds } = req.body;
    const { error } = POST_CREATE_SCHEMA.validate({ categoryIds });

    if (error) throw INVALID_DATA(error.message);

    const categoriesPromise = categoryIds.map((item) => Categories.findAll({
      where: { id: item },
    }));

    const resolvePromise = await Promise.all(categoriesPromise);

    const isValid = resolvePromise.some((item) => item.length <= 0);

    if (isValid) {
      return res.status(400).json({ message: '"categoryIds" not found' });
    }

    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = checkCategories;
