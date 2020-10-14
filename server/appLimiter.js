const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  // max: 100,
  max: 500,
  // windowMs: 60 * 60 * 1000, // 1 hour
  // message: `Too many request from this IP, please try again in an hour.`,
  windowMs: 10 * 60 * 1000, // 10 minutes
  message: `Too many request from this IP, please try again in 10 minutes.`,
  //ref:  https://www.npmjs.com/package/express-rate-limit
});


module.exports = [
  limiter,
]