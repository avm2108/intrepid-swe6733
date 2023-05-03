const accountRouter = require('express').Router();
const passport = require('passport');
const { verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');

/**
 * @route   PUT /api/account/password
 * @desc    Update the current user's password
 * @access  Private
 * @param   {string} oldPassword - The user's current password
 * @param   {string} newPassword - The user's new password
 * @param   {string} confirmPassword - The user's new password, repeated to confirm it
 * @returns {object} message - A message indicating whether the password was updated successfully
 */
accountRouter.put("/password", verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to update your password"
            }
        });
    }

    // Determine if the new password is the same as the old password, and if so, return an error
    if (await req.user.isValidPassword(req.body.oldPassword) || req.body.oldPassword === req.body.newPassword) {
        return res.status(400).json({
            errors: {
                newPassword: "The new password must be different from the old password"
            }
        });
    } else if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({
            errors: {
                confirmPassword: "The new password and confirmation password must match"
            }
        });
    }

    // Update the password
    try {
        req.user.password = req.body.newPassword;
        // The password will be hashed behind the scenes before saving to the database
        await req.user.save();
        
        return res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (err) {
        console.log("Error updating password: ", err);
        return res.status(500).json({
            errors: {
                message: "There was an error updating your password, please try again later"
            }
        });
    }
});

/**
 * @route   POST /api/account/delete
 * @desc    Delete the current user's account
 * @access  Private
 * @param   {string} password - The user's password
 * @returns {object} message - A message indicating whether the account was deleted successfully
 */
accountRouter.post('/delete', verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must log in to access this resource."
            }
        });
    }

    // The user will probably have to enter their password to confirm the deletion, so we should compare the password to the one in the database
    try {
        const user = await User.findById(req.user._id);
        if (await user.isValidPassword(req.body.password)) {
            // The password is correct, so we can delete the user's account
            // But first, we need to remove any matches containing the user's ID
            // And we also need to clear any social accounts that are linked to the user's account
            await Match.deleteMany({ $or: [{ user1: req.user._id }, { user2: req.user._id }] }).exec();
            await SocialAccount.deleteMany({ userId: req.user._id }).exec();

            // The password is correct, so we can delete the user's account
            const val = await User.findByIdAndDelete(req.user._id).exec();
            if (!val) {
                return res.status(404).json({
                    errors: {
                        message: "No user with that ID found"
                    }
                });
            }

            // Delete the user's account
            return res.status(200).json({
                message: "Your account has been deleted"
            });
        } else {
            // The password is incorrect, so we can't delete the user's account
            return res.status(401).json({
                errors: {
                    password: "You entered an incorrect password"
                }
            });
        }
    } catch (err) {
        console.log("Error deleting account: ", err);
        return res.status(500).json({
            errors: {
                message: "There was an error deleting your account, please try again later"
            }
        });
    }
});

/**
 * @route   GET /api/account/:id
 * @desc    Get a given user's account details based on their ID
 * @access  Private
 * @param   {string} id - The user's ID
 * @returns {object} user - The user's account details
 */
accountRouter.get('/:id', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    // If the user isn't logged in, return an error message
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to view account details"
            }
        });
    }

    // Attempt to find the user by their ID
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                errors: {
                    message: "No user with that ID found"
                }
            });
        }
        // Exclude the password field from the response
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
            }
        });
    } catch (err) {
        console.log("Error getting user by ID: ", err);
        return res.status(500).json({
            errors: {
                message: "There was an error getting the user's account details, please try again later"
            }
        });
    }
});

/**
 * @route   GET /api/account
 * @desc    Get the current user's account details
 * @access  Private
 * @returns {object} user - The user's account details
 */
accountRouter.get('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    // Exclude the password field from the response
    if (req.user) {
        res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                dateOfBirth: req.user.dateOfBirth,
                // Not sure if we want to send "profile" type info in this endpoint or 
                // keep it to GET /api/profile 
                // profile: (req.user.profile ? req.user.profile : undefined),
                // verifiedAccount: req.user.verifiedAccount,
            }
        });
    } else {
        res.status(401).json({
            errors: {
                message: "You must be logged in to view your account"
            }
        });
    }
});

/**
 * @route   PUT /api/account
 * @desc    Update the current user's account details
 * @access  Private
 * @param   {string} name - The user's name
 * @param   {string} email - The user's email address
 * @param   {string} dateOfBirth - The user's date of birth
 * @returns {object} user - The user's updated account details
 */
accountRouter.put('/', verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to update your account"
            }
        });
    }

    // Save the new account data to the User document
    // TODO: Need to selectively validate the incoming data, i.e. not a field if it hasn't changed or isn't provided
    // This'd require modifications to validateWithRules 
    try {
        // We only want to update fields that are included in the request body, if they're different from the current values
        if (req.body.name && req.body.name !== req.user.name) {
            req.user.name = req.body.name;
        }

        if (req.body.email && req.body.email !== req.user.email) {
            // Need to check if this email belongs to another account
            if (await User.findOne({ email: req.body.email })) {
                return res.status(400).json({
                    errors: {
                        email: "There is already an account with that email address"
                    }
                });
            }
            req.user.email = req.body.email;
        }
        
        if (req.body.dateOfBirth && req.body.dateOfBirth !== req.user.dateOfBirth) {
            req.user.dateOfBirth = req.body.dateOfBirth;
        }

        // TODO: Need to account for third-party auth providers

        // We need to validate the new account data before saving it to the database
        await req.user.validate();

        // Save the updated account data to the database
        await req.user.save();

        // Send the updated account data to the client
        // Exclude the password field from the response\

        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                dateOfBirth: req.user.dateOfBirth,
                // verifiedAccount: req.user.verifiedAccount, // TODO: Is this necessary?
            }
        });
    } catch (err) {
        console.log("Error updating account: ", err);
        if (err.errors) {
            const errorMessages = {};
            // Loop through the errors object
            for (const key in err.errors) {
                errorMessages[key] = err.errors[key].message;
            }
            // Return the err messages
            if (Object.keys(errorMessages).length > 0) {
                console.log("Error messages: " + JSON.stringify(errorMessages));
                return res.status(400).json({ errors: errorMessages });
            }
        }
        return res.status(500).json({
            errors: {
                message: "There was an error updating your account, please try again later"
            }
        });
    }
});

module.exports = accountRouter;
