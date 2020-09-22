const mongoose = require('mongoose');

const CommentShema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: [true, 'Please add a user'],
  },
  star: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating'],
  },

  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [250, 'Description can not be more then 250 characters'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentShema);
