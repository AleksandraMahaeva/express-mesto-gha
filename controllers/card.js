const Card = require('../models/card');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const ERROR_CODE = 500;

module.exports.doError = (err, req, res, next) => {
  const { status, message } = err;
    if (err) res.status(status).send({ message })
    else res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при создании карточки' })
      else next()
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) next({ status: ERROR_CODE_NOTFOUND, message: 'Карточка не найдена' })
      res.send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректный id' });
      else next()
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) next({ status: ERROR_CODE_NOTFOUND, message: 'Карточка не найдена' })
      res.send(card)
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные для постановки лайка' });
      else next()
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) next({ status: ERROR_CODE_NOTFOUND, message: 'Карточка не найдена' })
      res.send(card)
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next({ status: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные для снятия лайка' })
      else next()
    });
};
