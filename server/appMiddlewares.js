const express = require('express');
const morgan = require('morgan');
const appLimiter = require('./appLimiter');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const compression = require('compression');
const cors = require('cors');
const favicon = require('serve-favicon')



require('dotenv').config()

module.exports = [
  appLimiter,
  compression(),
  cookieParser(),
  cors(),
  express.urlencoded({
    extended: true,
    limit: '10kb'
  }),
  express.json({
    limit: '10kb',
  }),
  express.static(path.join(__dirname, './../client/public')),
  favicon(path.join(__dirname, './../client/public/img', 'favicon.ico')),
  morgan('dev'),
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    name: 'name',
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
      //ref: https://www.npmjs.com/package/memorystore
    }),
    cookie: {
      maxAge: 86400000
    },
    resave: false,
    saveUninitialized: true,
  }),

]