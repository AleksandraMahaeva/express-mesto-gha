const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/card');
const router = require('express').Router();

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;