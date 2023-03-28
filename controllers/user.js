const User = require('../models/user');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const ERROR_CODE = 500;


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя'})
      return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
  .then(user => res.send({ data: user }))
  .catch(err => {
    if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' })
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
  });
};

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({ data: users }))
  .catch(() => {
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
  });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' })
      return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Пользователь не найден' })
      return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};