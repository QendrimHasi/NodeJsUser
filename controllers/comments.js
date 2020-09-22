const Comments = require('../models/Comment');
const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');
const jwt = require('jsonwebtoken');

exports.getcomment = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findById(req.params.id).populate({
    path: 'user',
    select: 'username firstname lastname email',
  });
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.getcomments = asyncHandler(async (req, res, next) => {
  const find = { product: req.params.id };
  if (req.query.verified) {
    find.verified = req.query.verified;
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 2;
  const limit = parseInt(req.query.limit, 10) || 2;
  const skip = (page - 1) * limit;

  console.log('page' + page);
  console.log('limit' + limit);
  console.log('skip' + skip);

  let comments = await Comments.find(find).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    data: comments,
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
  req.body.updatedAt = Date.now();
  //get comment
  let comment = await Comments.findById(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  //get user from token
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  if (!comment.user._id.equals(user._id)) {
    return next(new ErrorResponse(`This is not your comment`, 404));
  }
  //update comment
  comment = await Comments.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.deletecomment = asyncHandler(async (req, res, next) => {
  let comment = await Comments.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  //get user from token
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  if (!comment.user._id.equals(user._id)) {
    return next(new ErrorResponse(`This is not your comment`, 404));
  }
  //delete comment
  comment = await Comments.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.verifycomment = asyncHandler(async (req, res, next) => {
  const comment = await Comments.findByIdAndUpdate(
    req.params.id,
    { verified: false, updatedAt: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});
