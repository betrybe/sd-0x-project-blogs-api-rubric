const Joi = require('@hapi/joi');
const { createToken } = require('../auth/jwt.auth');
const { User } = require('../models');

const REGISTER_SCHEMA = Joi.object({
  displayName: Joi.string().min(8),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
  image: Joi.string().required(),
});

const INVALID_DATA = (message) => ({
  name: 'InvalidDataError',
  message,
  status: 400,
});

const USER_CONFLICT = {
  name: 'UserConflictError',
  message: 'User already registered',
  status: 409,
};

const USER_NOT_FOUND = {
  name: 'UserNotFoundError',
  message: 'User does not exist',
  status: 404,
};

const registerUser = async (displayName, email, password, image) => {
  const { error } = REGISTER_SCHEMA.validate({
    displayName,
    email,
    password,
    image,
  });

  if (error) throw INVALID_DATA(error.message);

  const userFound = await User.findOne({ where: { email } });

  if (userFound) throw USER_CONFLICT;

  const newUser = await User.create({
    displayName,
    email,
    password,
    image,
  });

  const { password: _password, ...treatedData } = newUser.dataValues;
  return createToken(treatedData);
};

const getAllUsers = async () => {
  const usersFound = await User.findAll({ attributes: { exclude: 'password' } });
  return usersFound;
};

const getUserById = async (id) => {
  const userFound = await User.findOne({
    where: { id },
    attributes: { exclude: 'password' },
  });

  if (!userFound) throw USER_NOT_FOUND;

  return userFound;
};

const deleteUser = async (id) => {
  await User.destroy({ where: { id } });
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
