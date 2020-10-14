// Error Handling
const AppError = require('./utils/appError')

function errorhandler(req, res, next) {

  const err = new AppError(`\nCan't find ${req.originalUrl} on this server!!\n`, 404);

  err.status = 'fail';
  err.statusCode = 404;

  next(err);
}



module.exports = errorhandler;