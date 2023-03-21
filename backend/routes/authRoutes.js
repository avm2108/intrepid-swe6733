const authRouter = require('express').Router();
const passport = require('../services/passportConfig');
const validateWithRules = require('../services/validation');
const User = require('../models/User');

authRouter.get("/test", (req, res) => {
    res.json({ message: "Auth router works" });
});

// TODO: Decide on an auth strategy for login and protected endpoints
// We have to consider that we'll also need to handle 3rd party auth, so we'll need to be able to handle multiple auth strategies
// authRouter.post('/login', validateWithRules, );

// Registration via email and password, we'll validate the user's input before executing this function via the validateRegister middleware
authRouter.post('/register', validateWithRules, async (req, res, next) => {
    // Populating a new instance of our User model with the user's input
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
    });
    // Attempt to save the user to the database
    try {
        await user.save();
        // If the user was saved successfully, return a success message
        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        // If there was an error, it's likely related to failed validation, so we'll return the error messages
        console.log("Error saving user to database: " + JSON.stringify(err));
        // If there's an 'errors' object, it'll be from Mongoose validation;
        // So determine the paths that caused the errors
        // We want to format it so that we have an array of objects, each with a key of the path that caused the error
        if (err.errors) {
            // Create an array to hold the err messages
            const errorMessages = [];
            // Loop through the errors object
            for (const key in err.errors) {
                errorMessages.push({ [key]: err.errors[key].message });
            }
            // Return the err messages
            if (errorMessages.length > 0) {
                console.log("Error messages: " + JSON.stringify(errorMessages));
                return res.status(500).json({ error: errorMessages });
            }
        } else if (err.code === 11000) {
            // If the Mongoose error was that a unique field already exists, return a message
            // In our case the only unique field is the email address
            return res.status(400).json({ error: { email: 'A user with that email already exists' } });
        }
        // There was an error not related to validation, return it
        console.log("Other error in registration: " + err)
        return res.status(500).json({ error: err });
    }
});

// TODO: Logout the user, this'll depend on the strategy we use for login
authRouter.post('/logout', (req, res, next) => {
    // Potentially we could have a token blacklist and add the token to it here, until it expires
    // But for now, the simplest way is to just clear the cookie
    // Clear the cookie
    res.clearCookie('jwt');
    // Send a success message
    res.status(200).json({ message: 'User logged out successfully' });
});

// Export the router to be used in our server.js file
module.exports = authRouter;
