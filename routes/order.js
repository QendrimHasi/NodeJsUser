const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrders,
  deleteOrder,
} = require('../controllers/orders');
const router = express.Router();

router.route('/').get(getOrders).post(createOrder);

router.route('/:id').get(getOrder).put(updateOrders).delete(deleteOrder);

module.exports = router;
