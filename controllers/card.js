const Card = require('../models/card');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const validationCardIdMessage = 'Переданы некорректный id карточки';
const notFoundCardMessage = 'Карточка не найдена';

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next({ statusCode: ERROR_CODE_VALIDATION, message: 'Переданы некорректные данные при создании карточки' })
      else next(err)
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundCardMessage})
      else res.send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: validationCardIdMessage});
      else next(err)
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
      if (!card) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundCardMessage })
      else res.send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: validationCardIdMessage });
      else next(err)
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) next({ statusCode: ERROR_CODE_NOTFOUND, message: notFoundCardMessage })
      else res.send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') next({ statusCode: ERROR_CODE_VALIDATION, message: validationCardIdMessage })
      else next(err)
    });
};
