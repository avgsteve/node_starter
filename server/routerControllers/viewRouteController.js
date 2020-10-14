const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getPage_home = catchAsync(async (req, res, next) => {

  res.status(200).render('./root_pages/page_home', {});

});