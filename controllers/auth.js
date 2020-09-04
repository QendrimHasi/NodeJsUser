const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middelware/async');
const passport = require('passport');

//@desc    create singel user
//@rout  Post /users
//@access  Public

exports.register = asyncHandler(async (req, res, next) => {
  let user = await User.create(req.body);

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    data: user,
    token: token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    // if (info) {
    //   res.status(400).json({ success: false, msg: `${info}` });
    // }
    if (err) {
      res.status(400).json({ success: false, msg: 'Somthing went wrong' });
    }
    if (!user) {
      res.status(400).json({ success: false, msg: 'User not found' });
    } else {
      req.login(user, { session: false }, function (err) {
        if (err) {
          res.status(400).json({ success: false, msg: 'Somthing went wrong' });
        }
        res
          .status(200)
          .json({
            success: true,
            token: `Bearer ` + user.getSignedJwtToken(),
            data: user,
          });
      });
    }
  })(req, res, next);
});
