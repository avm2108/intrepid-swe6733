const accountRouter = require('express').Router();
const passport = require('passport');
const { verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');

// TODO: Documentation
// TODO: Social media provider acct binding

accountRouter.put("/password", verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "You must be logged in to update your password"
        });
    }

    // Determine if the new password is the same as the old password, and if so, return an error
    if (await req.user.isValidPassword(req.body.oldPassword) || req.body.oldPassword === req.body.newPassword) {
        return res.status(400).json({
            message: "The new password must be different from the old password"
        });
    } else if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({
            message: "The new password and confirmation password must match"
        });
    }

    // Update the password
    try {
        req.user.password = req.body.newPassword;
        // The password will be hashed behind the scenes before saving to the database
        await req.user.save();
        res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (err) {
        console.log("Error updating password: ", err);
        return res.status(500).json({
            message: "There was an error updating your password, please try again later"
        });
    }
});

// Get the current user's account-related data
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
                // verifiedAccount: req.user.verifiedAccount,
            }
        });
    } else {
        res.status(401).json({
            message: "You must be logged in to view your account"
        });
    }
});

// Update the current user's account-related data
accountRouter.put('/', verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (!req.user) {
        return res.status(401).json({
            message: "You must be logged in to update your account"
        });
    }

    // Save the new account data to the User document
    try {
        // We only want to update fields that are included in the request body, if they're different from the current values
        if (req.body.name && req.body.name !== req.user.name) {
            req.user.name = req.body.name;
        }
        if (req.body.email && req.body.email !== req.user.email) {
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
                return res.status(500).json({ errors: errorMessages });
            }
        }
        return res.status(500).json({
            message: "There was an error updating your account, please try again later"
        });
    }
});

// Delete the current user's account
accountRouter.delete('/', verifyCsrf, passport.authenticate("jwt-strategy", { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (!req.user) {
        return res.status(401).json({
            message: "You must log in to access this resource."
        });
    }

    // The user will probably have to enter their password to confirm the deletion, so we should compare the password to the one in the database
    try {
        const user = await User.findById(req.user._id);
        if (await user.isValidPassword(req.body.password)) {
            // The password is correct, so we can delete the user's account
            await user.remove();
            // Delete the user's account
            return res.status(200).json({
                message: "Your account has been deleted"
            });
        } else {
            // The password is incorrect, so we can't delete the user's account
            return res.status(401).json({
                message: "Incorrect password"
            });
        }
    } catch (err) {
        console.log("Error deleting account: ", err);
        return res.status(500).json({
            message: "There was an error deleting your account, please try again later"
        });
    }
});

module.exports = accountRouter;
