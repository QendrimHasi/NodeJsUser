const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersInRadius,
} = require('../controllers/users');

const { getOrdersbyUser } = require('../controllers/orders');
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getUsersInRadius);

router.route('/').get(getUsers);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/:id/orders').get(getOrdersbyUser);

module.exports = router;
