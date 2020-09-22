const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');
const geocoder = require('../utils/geocoder');

//@desc    get all users
//@rout  Get /users
//@access  Publis

exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const remodeFields = ['select', 'sort', 'page', 'limit'];

  remodeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte"in)\b/g,
    (match) => `$${match}`
  );
  query = User.find(JSON.parse(queryStr));
  //select filds
  if (req.query.select) {
    console.log('select');
    const filds = req.query.select.split(',').join(' ');
    query = query.select(filds);
  }

  //sort

  if (req.query.sort) {
    console.log('sort');
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const users = await query;
  res.status(200).json({
    success: true,
    data: users,
  });
});

//@desc    get singel user
//@rout  Get /users/:id
//@access  Publis

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('comments');
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc    update singel user
//@rout  Put /users:id
//@access  Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  req.body.updatedAt = Date.now();
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc    delete singel user
//@rout  Delete /users:id
//@access  Private

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc    get user with radius
//@rout  get /users/radius/zipcode/distance
//@access  Private

exports.getUsersInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get lan an let
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //callc radius using radians
  const radius = distance / 3963;

  const users = await User.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    data: users,
  });
});
