const { Router } = require('express');
const { loginServices } = require('../services');

const login = Router();

login.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const token = await loginServices.login(
      email,
      password,
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = login;
