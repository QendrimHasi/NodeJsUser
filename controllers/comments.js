const Comments = require('../models/Comment');
const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');
const jwt = require('jsonwebtoken');

exports.getcomment = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findById(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.getcomments = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'get comments',
  });
});

exports.createcomment = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  const product = await Product.findById(req.body.product);
  if (!product) {
    return next(new ErrorResponse(`Product not found `, 404));
  }

  req.body.user = id;

  const comment = await Comments.create(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.updatecomment = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'update comment',
  });
});

exports.deletecomment = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'delete comment',
  });
});
