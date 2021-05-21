const { Router } = require('express');
const { categoriesServices } = require('../services');
const { checkToken, decodePayload } = require('../auth/jwt.auth');

const categoriesRouter = Router();

const TOKEN_NOT_FOUND = {
  name: 'TokenNotFoundError',
  message: 'Token not found',
  status: 401,
};

const INVALID_TOKEN = {
  name: 'InvalidTokenError',
  message: 'Expired or invalid token',
  status: 401,
};

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    decodePayload(token);
    const categories = await categoriesServices.getAllCategories();

    return res.status(200).json(categories);
  } catch (err) {
    if (err.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(err);
  }
});

categoriesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [category] = await categoriesServices.getCategory(id);

  return res.status(200).json(category);
});

categoriesRouter.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    decodePayload(token);
    const newCategory = await categoriesServices.createCategory(name);
    return res.status(201).json(newCategory);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

module.exports = categoriesRouter;
