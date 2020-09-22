const mongoose = require('mongoose');

const OrderShema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please add a product'],
        ref: 'Products',
      },
      qty: {
        type: Number,
        required: [true, 'Please add a qty'],
        min: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderShema);
