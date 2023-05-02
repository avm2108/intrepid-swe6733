const authRouter = require('express').Router();
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const validateWithRules = require('../services/validation');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');
const SocialAccount = require('../models/SocialAccount');

authRouter.get('/instagram', passport.authenticate('instagram', { scope: ['basic', 'user_media', 'public_content', 'user_profile'] }), (req, res) => {
    console.log("redirecting to instagram");
});

// If the user authorizes the app, Instagram redirects them back to this endpoint
authRouter.get('/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/login' }),
    async (req, res) => {
        console.log("adding cookie", req.user);
        res.cookie('instagram', req.user,
            {
                maxAge: 900000,
                httpOnly: true,
                secure: (process.env.NODE_ENV === "production"),
                // signed: true,
            });
        // Need to redirect back to the frontend
        return res.redirect(process.env.CLIENT_ORIGIN + '/instagram/');
        // NOTE: now make a POST to /instagram/associate endpoint which will read the cookie
    });

authRouter.get("/instagram/test", verifyCsrf, passport.authenticate(["jwt-strategy", "instagram"], { session: false }), async (req, res, next) => {
    console.log(req.user);
    try {
        // TODO: Get their images from the Instagram API media endpoint
        const images = [];
        console.log(images);
        return res.status(200).json({ images });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: { general: "Unable to retrieve Instagram images" } });
    }
});

authRouter.post("/instagram/associate", verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    // console.log(req.user);
    // console.log(req.cookies);
    if (!req.user) {
        return res.status(401).json({
            errors: {
                general: "You must login to Intrepid before associating your Instagram account."
            }
        });
    }

    console.log("my cookie is", req.cookies?.instagram?.profile?.id);
    try {
        const account = await SocialAccount.findOneAndUpdate({ service: 'instagram', accountId: req.cookies?.instagram?.profile?.id }, { userId: req.user?.id });
        if (account) {
            console.log("Associating social account");
            return res.status(201).json({ message: 'Instagram associated successfully' });
        } else {
            console.log("Can't associate IG Acct because the account doesn't exist: " + JSON.stringify(req.cookies?.instagram?.profile?.id));
            return res.status(404).json({ errors: { general: "You must link your account first in your profile page." } });
        }
    } catch (err) {
        console.log("Can't associate IG Acct: " + JSON.stringify(err));
        return res.status(500).json({ errors: { general: "Unable to associate Instagram account" } });
    }
});

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object} - The user's data and a csrf token, with a signed HttpOnly JWT cookie, or an error message if the user's email or password is incorrect
 */
authRouter.post('/login', validateWithRules, generateCsrf, async (req, res, next) => {
    // We can assume these fields are valid, since they were validated by the validateWithRules middleware
    const { email, password } = req.body;

    console.log("Attempting to log in with email: " + email);

    // Attempt to locate the user in MongoDB by their email
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("No user found with email: " + email);
            // If the user wasn't found, return an error message
            return res.status(404).json({ errors: { email: 'No account with that email address found' } });
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

            // Return a useful response with the user's data as well as the csrf token
            // TODO: We could return the profile info or keep that to the specific endpoint
            return res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    profile: user?.profile,
                    profileComplete: user?.profileComplete,
                },
                csrfToken: req.csrfToken
            });
        } else {
            // If the passwords don't match, return an error message
            return res.status(401).json({ errors: { email: "The credentials you entered are incorrect or don't match an existing account." } });
        }
    } catch (err) {
        console.log("Error in /login: " + err);

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
                return res.status(400).json({ errors: errorMessages });
            }
        } else if (err.code === 11000) {
            // If the error code is 11000, it's a duplicate key error
            return res.status(400).json({ errors: { email: 'That email is already in use' } });
        }

        // If it's not a validation error, return the error
        return res.status(500).json({
            errors: {
                message: err
            }
        });
    }
});

// Registration via email and password, we'll validate the user's input before executing this function via the validateRegister middleware
/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {string} confirmPassword - The user's password confirmation
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
        confirmPassword: req.body.confirmPassword,
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
                return res.status(400).json({ errors: errorMessages });
            }
        } else if (err.code === 11000) {
            // If the Mongoose error was that a unique field already exists, return a message
            // In our case the only unique field is the email address
            return res.status(400).json({ errors: { email: 'A user with that email already exists' } });
        }
        // There was an error not related to validation, return it
        return res.status(500).json({
            errors: {
                general: 'There was an error registering your account, please try again later'
            }
        });
    }
});

/**
 * @route GET /auth/checkLoggedIn
 * @desc Checks if the user is logged in via looking for the CSRF and JWT cookies
 * @access Private
 * @returns {object} - The user's data if they're logged in or an error message if they're not
 */
authRouter.get("/checkLoggedIn", generateCsrf, passport.authenticate("jwt-strategy", { session: false }), (req, res, next) => {
    if (req.user) {
        return res.status(200).json({
            loggedIn: true,
            csrfToken: req.csrfToken,
            // Send back the user info without the password
             // TODO move _doc extraction to the passport strategy?
            ...Object.entries(req.user._doc).reduce((acc, [key, value]) => {
                if (key !== "password") {
                    acc[key] = value;
                }
                return acc;
            }, {})
        });
    } else {
        return res.status(401).json({
            loggedIn: false,
            errors: {
                message: "You must be logged in to view this page"
            }
        });
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

    // Expire the CSRF token
    res.clearCookie('csrfToken', {
        httpOnly: false,
        secure: (process.env.NODE_ENV === "production"),
        signed: false
    });

    // Clear connect.sid from express-session
    res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: (process.env.NODE_ENV === "production"),
        signed: true
    });
    
    // Clean any 'loggedIn' cookies
    res.clearCookie('loggedIn', {
        httpOnly: false,
        secure: (process.env.NODE_ENV === "production"),
        signed: false
    });

    // Send a success message
    res.status(200).json({ message: 'User logged out successfully' });
});

// Export the router to be used in our server.js file
module.exports = authRouter;
