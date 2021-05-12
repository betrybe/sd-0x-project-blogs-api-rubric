const express = require('express');
const controllers = require('./controllers');
require('dotenv').config();

const app = express();

// const PORT = process.env.PORT || 3000;
const PORT = 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.send();
});

app.use('/', express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/login', controllers.loginController);
app.use('/post', controllers.postController);
app.use('/user', controllers.userController);
app.use('/categories', controllers.categoriesController);

const errorMiddleware = (err, _req, res, _next) => {
  console.error('ERROR: ', err.message, err.status); // not suit for production
  if (err.status) return res.status(err.status).json({ message: err.message });
  res.status(500).json({ message: 'Something went wrong :(' });
};

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Online on ${PORT}!!!`));
