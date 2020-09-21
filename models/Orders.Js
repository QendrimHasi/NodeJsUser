const mongoose = require('mongoose');

const OrderShema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Products',
      },
      qty: Number,
    },
  ],
});

module.exports = mongoose.model('Order', OrderShema);
