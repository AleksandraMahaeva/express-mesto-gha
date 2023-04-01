const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/user');

router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/:userId', getUser);

module.exports = router;
