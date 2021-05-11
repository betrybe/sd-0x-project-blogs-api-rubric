const { Router } = require('express');
const { checkToken, decodePayload } = require('../auth/jwt.auth');
const { postServices } = require('../services');
const checkCategories = require('../middlewares/checkCategories');

const postRouter = Router();

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

postRouter.post('/', checkCategories, async (req, res, next) => {
  try {
    const { title, content, categoryIds } = req.body;
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const { payload: { id: userId } } = decodePayload(token);

    const newPost = await postServices.createPost(userId, title, content, categoryIds);

    res.status(201).json(newPost);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

postRouter.get('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const posts = await postServices.getAllPosts();

    res.status(200).json(posts);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

postRouter.get('/search', async (req, res, next) => {
  try {
    const { q: query } = req.query;
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const post = await postServices.getPostByQuery(query);

    return res.status(200).json(post);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
  }
});

postRouter.get('/:id', async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const post = await postServices.getPostById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

postRouter.put('/:id', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const { payload: { id: userId } } = decodePayload(token);

    if (req.body.categoryIds) return res.status(400).json({ message: 'Categories cannot be edited' });

    const updatedPost = await postServices.editPost(req.params.id, userId, title, content);

    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

postRouter.delete('/:id', async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return next(TOKEN_NOT_FOUND);
    checkToken(token);

    const { payload: { id: userId } } = decodePayload(token);
    await postServices.deletePost(req.params.id, userId);

    res.sendStatus(204);
  } catch (error) {
    if (error.message === 'jwt malformed') return next(INVALID_TOKEN);
    next(error);
  }
});

module.exports = postRouter;
