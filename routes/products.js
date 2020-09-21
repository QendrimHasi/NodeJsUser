const express = require('express');
const {
  getProducts,
  getProduct,
  updateProducts,
  deleteProducts,
  createProduct,
} = require('../controllers/products');

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);

router.route('/:id').get(getProduct).put(updateProducts).delete(deleteProducts);

module.exports = router;
