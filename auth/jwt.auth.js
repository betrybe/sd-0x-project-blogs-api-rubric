const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'bla';

const config = {
  expiresIn: '5d',
  algorithm: 'HS256',
};

const createToken = (payload) => jwt.sign({ payload }, SECRET, config);
const checkToken = (token) => jwt.verify(token, SECRET);
const decodePayload = (token) => jwt.decode(token);

module.exports = {
  createToken,
  checkToken,
  decodePayload,
};
