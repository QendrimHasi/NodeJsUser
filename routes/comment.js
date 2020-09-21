const express = require('express');
const {
  getcomment,
  getcomments,
  createcomment,
  updatecomment,
  deletecomment,
} = require('../controllers/comments');

const router = express.Router();

router.route('/').get(getcomments).post(createcomment);

router.route('/:id').get(getcomment).put(updatecomment).delete(deletecomment);

module.exports = router;
