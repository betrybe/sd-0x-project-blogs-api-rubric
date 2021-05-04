const { Router } = require('express');
const { categoriesServices } = require('../services');

const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await categoriesServices.getAllCategories();

  return res.status(200).json(categories);
});

categoriesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [category] = await categoriesServices.getCategory(id);

  return res.status(200).json(category);
});

categoriesRouter.post('/', async (req, res, next) => {
  try {
    // const { authorization } = req.headers;
    const { name } = req.body;

    const newCategory = await categoriesServices.createCategory(name);
    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

module.exports = categoriesRouter;
