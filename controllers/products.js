const Products = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');

exports.getProducts = asyncHandler(async (req, res, next) => {
  // const id = req.headers.authorization.id;
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;
  let query = await Products.find().skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    data: query,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findByIdAndUpdate(req.params.id, {
    $inc: { view: 1 },
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.updateProducts = asyncHandler(async (req, res, next) => {
  req.body.updatedAt = Date.now();
  const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteProducts = asyncHandler(async (req, res, next) => {
  const products = await Products.findByIdAndDelete(req.params.id);
  if (!products) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
