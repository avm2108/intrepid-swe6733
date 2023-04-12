const profileRouter = require('express').Router();
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const validateWithRules = require('../services/validation');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');
const { ProfileSchema } = require('../models/Profile');

// TODO: Add validation for the profile create and update routes
// TODO: Handle image uploads

/** 
 * @route   GET /api/profile/:id
 * @desc    Get the profile of the user with the given ID
 * @access  Private
 * @param  {String} id - The ID of the user whose profile we want to get
 * @returns {Object} - JSON object containing user's profile info
 */
profileRouter.get('/:id', async (req, res, next) => {
    // Attempt to find the user with the given ID
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // If the user exists, return their profile
            return res.status(200).json({
                profile: user.profile
            });
        } else {
            // If the user doesn't exist, return an error
            return res.status(404).json({
                error: "User profile not found"
            });
        }
    } catch (err) {
        console.log("Error getting user profile: ", err);
        return res.status(500).json({
            error: "There was an error getting the user profile, please try again later"
        });
    }
});

/**
 * @route   GET ./api/profile
 * @desc    Get the current user's profile
 * @access  Private
 * @returns {Object} - JSON object containing user's profile info
 */
profileRouter.get('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (req.user.profile) {
        return res.status(200).json({
            profile: req.user.profile
        });
    } else {
        // Indicate the profile doesn't exist
        // TODO: We'll need to redirect to the profile create page clientside
        return res.status(404).json({
            error: "Profile not found",
        });
    }
});

/**
 * @route   POST /api/profile
 * @desc    Create a new profile for the current user
 * @access  Private
 * @returns {Object} - JSON object containing user's profile info
 * @body    {String} gender - The user's gender
 * @body    {String?} bio - The user's bio
 * @body    {Object} location - The user's location
 * @body    -- {String} location.city - The user's city
 * @body    -- {String} location.state - The user's state
 * @body    -- {String} location.country - The user's country
 * @body    -- {String} location.coordinates - The user's coordinates
 * @body    {Object?} profilePictures[] - The user's images
 * @body    -- {String} image[i].file - The image's URL/path
 * @body    -- {String} image[i].caption - The image's caption/desc.
 * @body    -- {Number} image[i].position - The index of the image in the array
 * @body    {String[]} interests - The user's interests
 * @body    {Object} preferences - The user's preferences
 * @body    -- {String[]} gender - The genders the user is interested in
 * @body    -- {Object} ageRange - The age range the user is interested in
 * @body    ---- {Number} ageRange.min - The minimum age the user is interested in
 * @body    ---- {Number} ageRange.max - The maximum age the user is interested in
 * @body    -- {Object} distance - The distance between users the user is interested in
 * @body    ---- {Number} distance.min - The minimum distance the user is interested in
 * @body    ---- {Number} distance.max - The maximum distance the user is interested in
 */
// TODO: Add validation for the profile data
profileRouter.post('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    // If the user is logged in, req.user will be populated with the user's data
    // If the user is not logged in, req.user will be undefined
    if (req.user.profile) {
        return res.status(400).json({
            error: "A profile already exists for this user"
        });
    } else {
        // Create a new profile for the user
        const profile = {
            gender: req.body.gender,
            bio: req.body.bio,
            location: req.body.location,
            profilePictures: req.body.profilePictures,
            interests: req.body.interests,
            preferences: req.body.preferences
        };

        // Save the profile to the database in the User document
        try {
            req.user.profile = profile;
            // Validate the user's data with Mongoose validation
            // TODO: Add our own rules to 'validateWithRules' to validate the profile data for full control over the validation
            await req.user.validate();
            await req.user.save();

            // If the profile was successfully created, return the profile data
            return res.status(200).json({
                profile: profile
            });
        } catch (err) {
            console.log("Error updating profile: ", err);
            if (err.errors) {
                const errorMessages = {};
                // Loop through the errors object
                for (const key in err.errors) {
                    errorMessages[key] = err.errors[key].message;
                }
                // Return the err messages
                if (Object.keys(errorMessages).length > 0) {
                    if (process.env.NODE_ENV === "development")
                        console.log("Error messages in /profile: " + JSON.stringify(errorMessages));
                    return res.status(500).json({ errors: errorMessages });
                }
            }
            return res.status(500).json({
                error: "There was an error creating your profile, please try again later"
            });
        }
    }
});

/**
 * @route   PUT /api/profile
 * @desc    Update the current user's profile
 * @access  Private
 * @returns {Object} - JSON object containing user's profile info
 
 * @body    {String} gender - The user's gender
 * @body    {String?} bio - The user's bio
 * @body    {Object} location - The user's location
 * @body    -- {String} location.city - The user's city
 * @body    -- {String} location.state - The user's state
 * @body    -- {String} location.country - The user's country
 * @body    -- {String} location.coordinates - The user's coordinates
 * @body    {Object?} profilePictures[] - The user's images
 * @body    -- {String} image[i].file - The image's URL/path
 * @body    -- {String} image[i].caption - The image's caption/desc.
 * @body    -- {Number} image[i].position - The index of the image in the array
 * @body    {String[]} interests - The user's interests
 * @body    {Object} preferences - The user's preferences
 * @body    -- {String[]} gender - The genders the user is interested in
 * @body    -- {Object} ageRange - The age range the user is interested in
 * @body    ---- {Number} ageRange.min - The minimum age the user is interested in
 * @body    ---- {Number} ageRange.max - The maximum age the user is interested in
 * @body    -- {Object} distance - The distance between users the user is interested in
 * @body    ---- {Number} distance.min - The minimum distance the user is interested in
 * @body    ---- {Number} distance.max - The maximum distance the user is interested in
 */
// TODO: Add validation for the profile data
profileRouter.put('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    // If the user does not have a profile, redirect to the profile creation page
    if (!req.user.profile) {
        return res.status(404).json({
            error: "No profile exists for this user yet"
        });
    }

    // Save the new profile to the User document
    try {
        // We only want to update fields that are included in the request body, if they're different from the current profile values
        for (let key of Object.keys(req.body)) {
            // TODO: This may not work for nested objects like interest and preferences, may need to deeply compare the objects
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== req.user.profile[key]) {
                req.user.profile[key] = req.body[key];
            }
        }

        // Save the updated profile to the database
        await req.user.save();

        // If the profile was successfully updated, return the profile data
        return res.status(200).json({
            profile: req.user.profile
        });
    } catch (err) {
        console.log("Error updating profile: ", err);
        if (err.errors) {
            const errorMessages = {};
            // Loop through the Mongoose errors object
            for (const key in err.errors) {
                // We need to format the error differently if the error is due to a nested object
                // Such as in the case of an invalid interest the error would look like "profile.interests.1.name"
                // But we want to return the error as "interests": "Invalid interest name"
                if (key.includes(".")) {
                    const nestedKey = key.split(".")[1];
                    errorMessages[nestedKey] = err.errors[key].message;
                } else {
                    errorMessages[key] = err.errors[key].message;
                }
            }
            // Return the err messages if there are any
            if (Object.keys(errorMessages).length > 0) {
                if (process.env.NODE_ENV === "development")
                    console.log("Error messages in PUT /profile: " + JSON.stringify(errorMessages));
                return res.status(500).json({ errors: errorMessages });
            }
        }
        return res.status(500).json({
            error: "There was an error updating your profile, please try again later"
        });
    }
});

module.exports = profileRouter;
