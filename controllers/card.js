const Card = require('../models/card');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_NOTFOUND = 404;
const ERROR_CODE = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки' })
      return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(cards => res.send({ data: cards }))
    .catch(err => {
      if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Карточка не найдена' })
      return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
      .then(card => res.send({ data: card }))
      .catch(err => {
        if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для постановки лайка' })
        if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Передан несуществующий _id карточки' })
        return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      })
  )
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
      .then(card => res.send({ data: card }))
      .catch(err => {
        if (err.name === 'ValidatorError') return res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для снятия лайка' })
        if (err.name === 'CastError') return res.status(ERROR_CODE_NOTFOUND).send({ message: 'Передан несуществующий _id карточки' })
        return res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      })
  )
}