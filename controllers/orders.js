const Orders = require('../models/Orders');
const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');
const jwt = require('jsonwebtoken');

exports.getOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;
  let orders = await Orders.find()
    .populate([
      {
        path: 'user',
        select: 'username firstname lastname email',
      },
      {
        path: 'products.product',
        select: 'title price shortdescription description',
      },
    ])
    .skip(skip)
    .limit(limit);

  if (!orders) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
});

exports.getOrdersbyUser = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;
  const find = { user: req.params.id };
  let orders = await Orders.find(find)
    .populate([
      {
        path: 'products.product',
        select: 'title price shortdescription description',
      },
    ])
    .skip(skip)
    .limit(limit);

  if (!orders) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: orders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Orders.findById(req.params.id).populate([
    {
      path: 'user',
      select: 'username firstname lastname email',
    },
    {
      path: 'products.product',
      select: 'title price shortdescription description',
    },
  ]);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  let product = req.body.products;
  for (let index = 0; index < product.length; index++) {
    let prod = await Product.findById(product[index].product);
    if (!prod) {
      return next(
        new ErrorResponse(
          `Product not found with id ${product[index].product}`,
          404
        )
      );
    }
    if (prod.stock == 0) {
      return next(
        new ErrorResponse(
          `We dont have stoc for Product with id ${product[index].product}`,
          404
        )
      );
    }
    if (product[index].qty > prod.stock) {
      return next(
        new ErrorResponse(
          `We dont have stoc for Product with id ${product[index].product}`,
          404
        )
      );
    }
    prod = await Product.findByIdAndUpdate(product[index].product, {
      $inc: { sold: product[index].qty, stock: -product[index].qty },
    });
  }
  for (let index = 0; index < product.length; index++) {
    let produ = await Product.findById(product[index].product);
    produ = await Product.findByIdAndUpdate(product[index].product, {
      $inc: { sold: product[index].qty, stock: -product[index].qty },
    });
  }
  req.body.user = id;

  const order = await Orders.create(req.body);

  res.status(201).json({
    success: true,
    data: order,
  });
});

exports.updateOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'update order',
  });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.verify(token, process.env.JWT_SECRET).id;

  const user = User.findById(id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  let order = await Orders.findById(req.params.id);
  if (!order.user.equals(id)) {
    return next(new ErrorResponse(`this is not your order`, 400));
  }

  order = await Orders.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
