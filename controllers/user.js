const User = require('../models/user');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const ERROR_CODE = 500;

module.exports.doError = (err, req, res, next) => {
  const { status, message } = err;
    if (err) res.status(status).send({ message })
    else res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при создании пользователя' })
      else next();
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) next({ status: ERROR_CODE_NOTFOUND, message: 'Пользователь не найден' })
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Передан некорректный id пользователя' })
      else next();
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// new: true, // обработчик then получит на вход обновлённую запись
// runValidators: true, // данные будут валидированы перед изменением
// upsert: true // если пользователь не найден, он будет создан

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next({ status: ERROR_CODE_NOTFOUND, message: 'Пользователь не найден' })
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при обновлении профиля' })
      else next();
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next({ status: ERROR_CODE_NOTFOUND, message: 'Пользователь не найден' })
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при обновлении аватара' })
      else next();
    });
};
