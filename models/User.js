const geocoder = require('../utils/geocoder');
const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    maxlength: [50, 'Username can not be more then 50 characters'],
  },
  firstname: {
    type: String,
    required: [true, 'Please add a your FirstName'],
    maxlength: [50, 'FirstName can not be more then 50 characters'],
  },
  lastname: {
    type: String,
    required: [true, 'Please add a your LastName'],
    maxlength: [50, 'LastName can not be more then 50 characters'],
  },
  fullname: {
    type: String,
    maxlength: [100, 'FullName can not be more then 100 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Please add a your Email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password can not be less then 6 characters'],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer then 20 characters'],
  },
  about: {
    type: String,
    required: [true, 'Please add a about'],
    maxlength: [500, 'Password can not be more then 500 characters'],
  },
  address: {
    type: String,
    required: [true, 'Please add a address'],
  },
  location: {
    //geoJson point
    type: {
      type: String,
      enum: ['Point'],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // require: true,
      indexe: '2dsphere',
    },
    country: String,
    city: String,
    region: String,
    zip: String,
  },

  skills: {
    type: [String],
    required: true,
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
//ad slug or fullname
UserSchema.pre('save', function (next) {
  this.fullname = slugify(this.firstname + this.lastname, { lower: true });
  next();
});

//geocode create location

UserSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    country: loc[0].countryCode,
    city: loc[0].city,
    region: loc[0].countryCode,
    zip: loc[0].zipcode,
  };

  this.address = undefined;
  next();
});

// encryp passwort using bcrypt
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//create jwt

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', UserSchema);
