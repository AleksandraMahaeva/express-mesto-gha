const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
  doError,
} = require('../controllers/card');

router.post('/cards', createCard);
router.use('/cards', doError);

router.get('/cards', getCards);
router.use('/cards', doError);

router.delete('/cards/:cardId', deleteCard);
router.use('/cards/:cardId', doError);

router.put('/cards/:cardId/likes', likeCard);
router.use('/cards/:cardId/likes', doError);

router.delete('/cards/:cardId/likes', dislikeCard);
router.use('/cards/:cardId/likes', doError);

module.exports = router;
