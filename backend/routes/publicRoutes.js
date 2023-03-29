const publicRouter = require('express').Router();
const validateWithRules = require('../services/validation');
const User = require('../models/User');

publicRouter.post("/forgot-password", (req, res) => {
 // generate one time key
 // store key in database with expiration
 // send email with one time key for reset (might need to use hosting provider mail server or mailgun etc)
});

publicRouter.post("/reset-password/:key", (req, res) => {
   // verify key matches in the database and that provided email matches
   // apply new password from request body to associated user
   // remove one time key from database
});

// Export the router to be used in our server.js file
module.exports = publicRouter;
