const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  doError,
} = require('../controllers/user');

router.post('/users', createUser);
router.use('/users', doError);

router.get('/users', getUsers);
router.use('/users', doError);

router.patch('/users/me', updateUser);
router.use('/users/me', doError);

router.patch('/users/me/avatar', updateUserAvatar);
router.use('/users/me/avatar', doError);

router.get('/users/:userId', getUser);
router.use('/users/:userId', doError);


module.exports = router;
