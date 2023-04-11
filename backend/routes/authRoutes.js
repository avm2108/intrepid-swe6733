const authRouter = require('express').Router();
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const validateWithRules = require('../services/validation');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object} - The user's data and a csrf token, with a signed HttpOnly JWT cookie, or an error message if the user's email or password is incorrect
 */
authRouter.post('/login', generateCsrf, validateWithRules, async (req, res, next) => {
    // We can assume these fields are valid, since they were validated by the validateWithRules middleware
    const { email, password } = req.body;

    console.log("Attempting to log in with email: " + email);

    // Attempt to locate the user in MongoDB by their email
    await User.findOne({ email: email }).then(async (user) => {
        if (!user) {
            // If the user wasn't found, return an error message
            return res.status(400).json({ error: { email: 'No user found with that email' } });
        }

        if (process.env.NODE_ENV === "development")
            console.log("User with ID: " + user._id + " found");

        // If the user was found, compare the password they entered with the hashed password in the database
        if (await user.isValidPassword(password)) {
            // If the password's correct, generate a JWT token for the user
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Set the signed cookie with the token
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: (process.env.NODE_ENV === "production"),
                signed: true,
            });

            // Return a useful response with user's data
            // TODO: We could return the profile info or keep that to the specific endpoint
            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth 
                },
                csrfToken: req.csrfToken
            });
        } else {
            // If the passwords don't match, return an error message
            /*             // TODO: We could make this message more general to not give away that the email was correct
                        return res.status(401).json({ error: { password: 'Incorrect password' } }); */
            // TODO: We could make this message more general to not give away that the email was correct
            return res.status(401).json({ error: { email: "The credentials you entered are incorrect or don't match an existing account." } });
        }
    }).catch((err) => {
        // If there was an error, most likely it's related to the database
        // Check if it's a validation error
        if (err.errors) {
            const errorMessages = {};
            // Loop through the errors object, pushing errors like { email: 'Email is required' } to the array
            for (const key in err.errors) {
                errorMessages[key] = err.errors[key].message;
            }
            // Return the err messages
            if (Object.keys(errorMessages).length > 0) {
                if (process.env.NODE_ENV === "development")
                    console.log("Error messages in /login: " + JSON.stringify(errorMessages));
                return res.status(400).json({ errors: errorMessages });
            }
        } else if (err.code === 11000) {
            // If the error code is 11000, it's a duplicate key error
            return res.status(400).json({ errors: { email: 'That email is already in use' } });
        }

        console.log("Error in /login: " + err);
        // If it's not a validation error, return the error
        return res.status(500).json({ error: err });
    });
});

// Registration via email and password, we'll validate the user's input before executing this function via the validateRegister middleware
/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {string} name - The user's name
 * @param {string} dateOfBirth - The user's date of birth
 * @returns {object} - A success message if the user was created successfully or an error message if the email is already in use
 */
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
            const errorMessages = {};
            // Loop through the errors object
            for (const key in err.errors) {
                errorMessages[key] = err.errors[key].message;
            }
            // Return the err messages
            if (errorMessages.length > 0) {
                return res.status(500).json({ errors: errorMessages });
            }
        } else if (err.code === 11000) {
            // If the Mongoose error was that a unique field already exists, return a message
            // In our case the only unique field is the email address
            return res.status(400).json({ errors: { email: 'A user with that email already exists' } });
        }
        // There was an error not related to validation, return it
        return res.status(500).json({ error: err });
    }
});

/**
 * @route POST /auth/logout
 * @desc Logs the user out by clearing the cookie
 * @access Public
 * @returns {object} Success message
 */
authRouter.post('/logout', (req, res, next) => {
    // Potentially we could have a token blacklist and add the token to it here, until it expires
    // But for now, the simplest way is to just clear the cookie
    // Clear the cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: (process.env.NODE_ENV === "production"),
        signed: true
    });

    // TODO: Clear the CSRF token cookie
    /*res.clearCookie('csrfToken', {
        httpOnly: false,
        secure: (process.env.NODE_ENV === "production"),
        signed: false
    });*/

    // TODO: Blacklist the token?

    // Send a success message
    res.status(200).json({ message: 'User logged out successfully' });
});

// Export the router to be used in our server.js file
module.exports = authRouter;
