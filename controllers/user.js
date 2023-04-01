const User = require('../models/user');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const notFoundUserMessage = 'Пользователь не найден'

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next({ statusCode: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при создании пользователя' })
      else next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundUserMessage})
      else res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: 'Передан некорректный id пользователя' })
      else next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundUserMessage })
      else res.send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при обновлении профиля' })
      else next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundUserMessage })
      else res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при обновлении аватара' })
      else next(err);
    });
};
