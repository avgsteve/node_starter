const timeStamp = require('../utils/timeStamp');
const timestamp = timeStamp.getTimeStamp(); // use console.log(`\nCurrent time : ${timestamp} (UCT+8)`);
const AppError = require('../utils/appError');

//transform the mongoose err obj to easy-to-ready AppError obj
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.}`;
  return new AppError(message, 400);
};

//
const handleDuplicateFieldsDB = err => {

  const errors = Object.values(err.errors).map();

  //err.msg is from err obj's property from mongoose
  //use RegExp to find match text between quotes (ex: "....")
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};


const handelValidationErrorDB = err => {

  const errors = Object.values(err.errors).map(el => el.message);

  console.log('The modified error:\n');
  console.log(errors);

  const message = `Invalid input data: ${errors.join(". ")}.`;

  return new AppError(message, 400);

};


const handelJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handelJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again!", 401);
};


const sendError_in_dev = (err, req, res) => {

  if (req.originalUrl.startsWith('/api')) {

    console.error('\nERROR (related to API/data ) 💥\n', err);

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // if error is NOT coming from routes related to API, then send response with rendered page
  console.error('\nERROR (related to routes/slug)💥\n', err);
  console.error('\nEnd of ERROR Log\n');
  // render error.pug for displaying error message in web page when it's error from entering the tour route (slug) doesn't exist
  return res.status(err.statusCode).render('./error_pages/error', {
    title: 'Something went wrong!',
    msg: err.message
  });

};

// Error message in production mode
const sendError_in_production = (err, req, res) => {

  // Condition 1) 
  if (req.originalUrl.startsWith('/api')) {

    // console.error('\nERROR (related to API/data) 💥\n', err);

    // Only operational and trusted error can be sent to client
    if (err.isOperational) {

      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // programming or other unknown error can't be leaked to client
    console.error('ERROR 💥', err);

    // Then sending generic error code
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }


  // Condition 2) URL not starts with /api. (such as /tour-slug)
  // Then RENDERING error in web page
  // A) if it's an operational and trusted error, then it can be sent to client
  if (err.isOperational) {
    // 1) Log error
    // console.log(err.message);
    console.error('\nERROR (related to tour routes/slug)💥\n');
    console.log(err);

    return res.status(err.statusCode).render('./error_pages/error', {
      title: 'Something went wrong!',
      msg: err.message
    });

  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('./error_pages/error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });

  // end of const sendError_in_production = (err, req, res) => {
};


// Being used in app.js as "globalErrorHandler" middleware to show the trace of error log and which app or function throws the error.
module.exports = (err, req, res, next) => {

  console.log(
    "\x1b[31m", `\n === Error log from errorController.js ===  `, "\x1b[0m");
  console.log(err.stack);
  console.log(`\n↑↑↑ The error is logged at: ${timestamp} (UCT+8) ↑↑↑`);
  console.log("\x1b[31m", `=== End of Error log from errorController.js ===`, "\x1b[0m\n");


  //to process income error code by express.js
  err.statusCode = err.statusCode || 500; // 500 is external server error
  err.status = err.status || 'error'; //err.status is 'fail' from the passed-in Error obj

  //use environment variable to send dev or production error
  if (process.env.NODE_ENV.toString().trim() === 'development') {

    //send Error info for dev mode
    sendError_in_dev(err, req, res);

  } else if (process.env.NODE_ENV.toString().trim() === 'production') {

    let error = {
      ...err
    };

    error.name = err.name;

    /* structure of err (from Mongoose)
    "error": {
            "message": "Cast to ObjectId failed for value \"asdasda\" at path \"_id\" for model \"Tour\"",
            "name": "CastError",
            "stringValue": "\"asdasda\"",
            "kind": "ObjectId",
            "value": "asdasda",
            "path": "_id",
            "reason": {},
            "statusCode": 500,
            "status": "error"
        },
    */

    error.message = err.message;

    console.log("\nerror.name", error.name)
    //
    // 'CastError' is from res.status(err.statusCode).json({  error: err, when the data id doesn't match (wrong id)
    if (err.name === 'CastError') {
      //transform the mongoose err obj to easy-to-ready AppError obj
      error = handleCastErrorDB(error);
    }

    //When have the same (duplicated) data name
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); //transform the mongoose err obj to customized error message

    /* error obj before being modified:

    Error! {
      driver: true,
      name: 'MongoError',
      index: 0,
      code: 11000,
      keyPattern: { name: 1 },
      keyValue: { name: 'Test tour data duplicate' },
      errmsg: 'E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: "Test tour data duplicate" }',
      statusCode: 500,
      status: 'error',
      [Symbol(mongoErrorContextSymbol)]: {}
    }


    error obj after being modified :
    {
        "status": "fail",
        "message": "Duplicate field value: \"Test tour data duplicate\". Please use another value!"
    }

    */

    if (error.name === "ValidationError") error = handelValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handelJWTError();
    /*{
        "status": "error",
        "error": {
            "name": "JsonWebTokenError",
            "message": "invalid signature",
            "statusCode": 500,
            "status": "error"
        },*/
    if (error.name === "TokenExpiredError") error = handelJWTExpiredError();

    /*{
        "status": "error",
        "error": {
            "name": "TokenExpiredError",
            "message": "jwt expired",
            "expiredAt": "2020-06-07T15:42:21.000Z",
            "statusCode": 500,
            "status": "error"
        },*/
    // console.log('\n\nerror:\n');
    // console.log(err);
    // console.log('\n\nerror message:\n');
    // console.log(err.message);

    sendError_in_production(err, req, res);
  }


};