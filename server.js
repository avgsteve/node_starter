// for handling uncaughtException error
process.on('uncaughtException', err => {
  console.log("\n  == UNCAUGHT REJECTION! 🤔 time: " + (new Date).toUTCString() + " == ");
  console.log("\nName of error: " + err.name);
  console.log("\nMessage of error: " + err.message);
  console.log("\nError stack:\n", err.stack);
  console.log('\nShutting down now ...');
  console.log('\n  == End of uncaughtException error log == \n');
  process.exit(1);
});

require('dotenv').config()

const app = require("./server/app"); // getting all config from app.js , so use nodemon server.js to start server

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  // Server starting log
  console.log(
    `  Server is listening to port:${ port }` +
    "\x1b[0m",
    " Mode:", process.env.NODE_ENV, '\n');

  // Database conntection starting log
  () => setTimeout(() => {
    console.log("Establishing connection to database ...");

    const connectMongoDB = require("./database/mongodb");
    rver
    connectMongoDB();
  }, 300)

});



// ==== GLOBAL ERROR HANDLING ====

process.on('unhandledRejection', err => {
  // https://nodejs.org/api/process.html#process_event_unhandledrejection

  console.log("\n  == UNHANDLED REJECTION! 🤔 time: " + (new Date).toUTCString() + " == ");
  console.log("\nName of error: " + err.name);
  console.log("\nMessage of error: " + err.message);
  console.log('\nShutting down now ...');

  server.close(() => {
    //ref: https://nodejs.org/api/net.html#net_server_close_callback
    process.exit(1);
  });

  console.log('\n  == End of unhandledRejection error log == \n');
});

// for handling uncaughtException error
process.on('uncaughtException', err => {

  console.log("\n  == UNCAUGHT REJECTION! 🤔 time: " + (new Date).toUTCString() + " == ");

  console.log("\nName of error: " + err.name);
  console.log("\nMessage of error: " + err.message);
  console.log('\nShutting down now ...');

  // console.log(err); //see below for full error log

  server.close(() => {
    process.exit(1);
  });

  console.log('\n  == End of uncaughtException error log == \n');

});


// Log the message when Heroku sending a SIGTERM for shutting down after inactivity every 24 hours
process.on('SIGTERM', () => {

  console.log(`\nSIGTERM RECEIVED! Shutting down now ... 👋 \n`);

  //Log a message for terminating all process when closing server
  server.close(() => {
    console.log(`All processes terminated! 🔚`);
  });
});