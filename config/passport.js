const localStrtegy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middelware/async');
const passport = require('passport');

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    asyncHandler(async (jwtPayload, cb) => {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return cb(null, user);
      } else {
        return cb(err);
      }
    })
  )
);

module.exports = function (passport) {
  passport.use(
    new localStrtegy(
      { usernameField: 'email', passwordField: 'password' },
      asyncHandler(async (email, password, done) => {
        let user = await User.findOne({ email: `${email}` });
        let nullUser;
        if (!user) {
          return done(null, nullUser, {
            message: 'that email is not registered',
          });
        }

        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) return done(null, false, { message: 'password incorect' });
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'password incorect' });
          }
        });
      })
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
