const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersInRadius,
} = require('../controllers/users');
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getUsersInRadius);

router.route('/').get(getUsers);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
