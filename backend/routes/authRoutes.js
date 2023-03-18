const authRouter = require('express').Router();
const passport = require('../services/passportConfig');
const validateWithRules = require('../services/validation');
const User = require('../models/User');

authRouter.get("/test", (req, res) => {
    res.json({ message: "Auth router works" });
});


authRouter.post('/login', validateWithRules, (req, res, next) => {
    // If there were errors they would have been returned by the validateLogin middleware,
    // so we can continue here assuming that the user's input is valid if they've reached this point

    // Authenticate the user with the local strategy
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
        // If there is an err, return it
        if (err) {
            return res.status(500).json({ error: err });
        }

        // If there is no user, return a message
        if (!user) {
            return res.status(400).json({ error: info.message });
        }

        // If authentication was successful, log the user in
        // In our case, this will generate a JWT for the user
        // and return it to the client via a signed cookie
        req.login(user, { session: false }, (err) => {
            console.log("Logging in test user: " + user);
            // If there is an err, return it
            if (err) {
                return res.status(500).json({ err: err });
            }

            // If there is no err, generate a JWT for the user
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Return the JWT to the user
            res.cookie('jwt', { token }, { httpOnly: true, signed: true, sameSite: 'strict' });
            res.status(200).json({ data: { user: user, token: token } });
        });
    });
});


// Registration via email and password, we'll validate the user's input before executing this function via the validateRegister middleware
authRouter.post('/register', validateWithRules, async (req, res, next) => {
    // If there were errors they would have been returned by the validateRegister middleware, so we can continue
    // here assuming that the user's input is valid if they've reached this point

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
        // If there's an 'errors' object, determine the paths that caused the errors
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
                return res.status(500).json({ error: errorMessages });
            }
        }
        // There was an error not related to validation, return it
        return res.status(500).json({ error: err });
    }
});


// Logout the user
authRouter.post('/logout', (req, res, next) => {
    // Potentially we could have a token blacklist and add the token to it here, until it expires
    // But for now, the simplest way is to just clear the cookie
    // Clear the cookie
    res.clearCookie('jwt');
    // Send a success message
    res.status(200).json({ message: 'User logged out successfully' });
});

// Export the router
module.exports = authRouter;
