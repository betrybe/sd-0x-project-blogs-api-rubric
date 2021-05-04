const Joi = require('@hapi/joi');
const { createToken } = require('../auth/jwt.auth');
const { User } = require('../models');

const LOGIN_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

const INVALID_DATA = (message) => ({
  name: 'InvalidDataError',
  message,
  status: 400,
});

const USER_NOT_FOUND = {
  name: 'UserNotFoundError',
  message: 'Invalid fields',
  status: 400,
};

const login = async (email, password) => {
  const { error } = LOGIN_SCHEMA.validate({
    email,
    password,
  });

  if (error) throw INVALID_DATA(error.message);

  const userFound = await User.findOne({ where: { email } });

  if (!userFound || userFound.dataValues.password !== password) throw USER_NOT_FOUND;

  const { password: _password, ...treatedData } = userFound.dataValues;
  return createToken(treatedData);
};

module.exports = {
  login,
};
