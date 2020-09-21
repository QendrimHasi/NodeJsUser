const ErrorResponse = require('../utils/errorResponse');

const erroHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log(err);

  error.message = err.message;

  //mongose bad objekt id
  if (err.name === 'CastError') {
    const message = ` Resorce not found  ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //mongose duplicat key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  //mongose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = erroHandler;
