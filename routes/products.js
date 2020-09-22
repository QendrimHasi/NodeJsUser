const express = require('express');
const {
  getProducts,
  getProduct,
  updateProducts,
  deleteProducts,
  createProduct,
} = require('../controllers/products');

const { getcomments } = require('../controllers/comments');

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);

router.route('/:id').get(getProduct).put(updateProducts).delete(deleteProducts);

router.route('/:id/comments').get(getcomments);

module.exports = router;
