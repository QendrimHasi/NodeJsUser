const mongoose = require('mongoose');

const ProductShema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      maxlength: [100, 'Title can not be more then 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a Price'],
    },
    shortdescription: {
      type: String,
      required: [true, 'Please add a Short Description'],
      maxlength: [250, 'Short Description can not be more then 250 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a Description'],
    },
    view: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please add a Stock'],
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// delete coments when product delete
ProductShema.pre('remove', async function (next) {
  await this.model('Comment').deleteMany({ product: this._id });
  next();
});

//reverse populate virtualize
ProductShema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

module.exports = mongoose.model('Products', ProductShema);
