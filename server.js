const express = require('express');
const dotenv = require('dotenv');
//const logger = require('./middelware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middelware/error');
const passport = require('passport');

require('./models/User');

//load env vars

dotenv.config({ path: './config/config.env' });

connectDB();

//Routes file

const users = require('./routes/users');
const auth = require('./routes/auth');
const products = require('./routes/products');
const comments = require('./routes/comment');
const orders = require('./routes/order');

const app = express();

require('./config/passport')(passport);

//Body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//app.use(logger);

app.use(passport.initialize());
app.use(passport.session());

//Mount router
app.use('/users', passport.authenticate('jwt', { session: false }), users);
app.use(
  '/products',
  passport.authenticate('jwt', { session: false }),
  products
);
app.use(
  '/comments',
  passport.authenticate('jwt', { session: false }),
  comments
);
app.use('/orders', passport.authenticate('jwt', { session: false }), orders);
app.use('/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server runnig in ` + process.env.NODE_ENV + ` MODE PORT ` + PORT
  );
});

//handel unhandel promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server $ exit process
  server.close(() => process.exit(1));
});
