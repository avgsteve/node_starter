const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const app = express();

// Middlewares
app.use(
  require('./appMiddlewares') // all middlewares go here
);

// Settings
app.options('*', cors());
app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './../client/views_pug'));

// Routes
app.use('/api', require('./routers/apiRoutes'));
app.use('/', require('./routers/viewRoutes'));


// GLOBAL ERROR HANDLING
app.all('*', require('./appOperationErrorHandler')); // handles router error like status 4xx error
app.use(require('./routerControllers/errorRouteController')); // handles programming error like status 500 internal server error

module.exports = app;