const User = require('../models/User');
const { Match } = require('../models/Match');
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const matchesRouter = require('express').Router();

/**
 * @route GET /api/prospects
 * @desc Get prospects for a logged in user based on comparison of user's preferences and other users' attributes
 * @access Private
 * @returns {Array} Array of user objects
 * @returns {String} Error message
 */
matchesRouter.get('/prospects', passport.authenticate('jwt-strategy', { session: false }), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                general: 'You must be logged in to access your propsects'
            }
        });
    }

    // First we need to find the users that our user has already matched with or blocked, and exclude them from the prospects
    try {
        // Query the database for all matches for the logged in user, where the match is accepted
        // We need to exclude the other user in these matches from the being returned as prospects
        const matches = await Match.find({
            // Find matches where the logged in user is either user1 or user2
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ],
            // Get those that have the other user set
            $and: [
                { user1: { $ne: null } },
                { user2: { $ne: null } }
            ],
            // Make sure the match is accepted (mutualAcceptedDate is not null) (?)
            mutualAcceptedDate: { $ne: null }
            // Fill the user1 and user2 fields with the actual user objects
        }).populate('user2').populate('user1').exec();

        // Create an array of user ids that the logged in user has already matched with or blocked
        const blockedOrMatchedUserIds = matches.map(match => {
            if (match.user1._id.equals(req.user._id)) {
                return match.user2._id;
            } else {
                return match.user1._id;
            }
        });

        // Now we can query the database for all users that are not the logged in user,
        // and are not in the blockedOrMatchedUserIds array
        const prospects = await User.find({
            _id: { $ne: req.user._id },
            _id: { $nin: blockedOrMatchedUserIds },
            // TODO: Add logic to filter prospects based on user preferences and other users' attributes
            // For now we'll apply the algorithm clientside
            // Make sure the target user has completed their profile
            profileComplete: true,
            // Strip the password field from the returned user objects
        }).select('-password -_v');

        console.log("Returning prospects: " + JSON.stringify(prospects));

        if (prospects.length === 0) {
            return res.status(404).json({
                errors: {
                    general: 'No prospects for this user found'
                }
            });
        }

        // Return the prospects
        return res.status(200).json(prospects);
    } catch (err) {
        console.log("Prospect retrieval error: " + err);
        return res.status(500).json({
            errors: {
                general: 'An error occurred while retrieving your prospects'
            }
        });
    }
});

/**
 * @route GET /api/matches
 * @desc Get accepted matches for a logged in user
 * @access Private
 * @returns {Array} Array of user objects
 * @returns {String} Error message
*/
matchesRouter.get('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                general: 'You must be logged in to access your matches'
            }
        });
    }

    try {
        // Query the database for all matches for the logged in user
        const matches = await Match.find({
            // Find matches where the logged in user is either user1 or user2
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ],
            // Get those that have the other user set
            $and: [
                { user1: { $ne: null } },
                { user2: { $ne: null } }
            ],
            // Make sure the match isn't blocked (false or null) 
            matchBlocked: { $ne: true },
            // Make sure the match is accepted (mutualAcceptedDate is not null)
            mutualAcceptedDate: { $ne: null }
            // Remove passwords from the returned user objects // Fill the user1 and user2 fields with the actual user objects
        }).populate('user2').populate('user1').select('-password -_v').exec();

        if (matches.length === 0) {
            return res.status(404).json({
                errors: {
                    general: 'No matches for this user found'
                }
            });
        }

        // Transform the matches array to only include the other user and the match date
        const transformedMatches = matches.map(match => {
            // Get the user object for the other user in the match
            const otherUser = match?.user1._id?.toString() === req.user?._id?.toString() ? match.user2 : match.user1;
            console.log("My id is " + req.user._id.toString() + " and the other user is " + otherUser?._id.toString());
            // Return the user object with the match date
            return {
                name: otherUser?.name,
                id: otherUser?._id,
            };
/*             return {
                targetUser: otherUser,
                matchDate: match.mutualAcceptedDate
            }; */
        });
        // Remove duplicates from the transformedMatches array
        // Based on targetUser ID
        const uniqueMatches = transformedMatches.filter((match, index, self) =>
            index === self.findIndex((m) => (
                m.id === match.id
            ))
        );


        console.log("Returning matches: " + JSON.stringify(uniqueMatches));
        
        // Return the matches
        return res.status(200).json(uniqueMatches);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errors: {
                general: 'An error occurred while retrieving your matches'
            }
        });
    }
});

/**
 * @route POST /api/matches
 * @desc Create a new match
 * @access Private
 * @param {String} req.body.user2 - The ID of the user to match with
 * @returns {Object} Match object
 * @returns {String} Error message
*/
matchesRouter.post('/', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                general: 'You must be logged in to create a match'
            }
        });
    }

    // Ensure we have a valid user2 in the request body
    if (!req.body.user2) {
        return res.status(400).json({
            errors: {
                general: '"user2" (Target user ID) must be present in the request body'
            }
        });
    } else if (req.body.user2 === req.user._id) {
        return res.status(400).json({
            errors: {
                general: '"user2" (Target user ID) must be different than the logged in user'
            }
        });
    }

    try {
        // Make sure the user2 exists
        const user2 = await User.findById(req.body.user2);

        if (!user2) {
            return res.status(400).json({
                errors: {
                    general: 'The user you are trying to match with does not exist'
                }
            });
        }

        // Determine if a match with our user and the other user already exists
        const existingMatch = await Match.findOne({
            $or: [
                { user1: req.user._id, user2: req.body.user2 },
                { user1: req.body.user2, user2: req.user._id }
            ]
        });

        // Determine if the mutualAcceptedDate is set, which means we both already
        // accepted the match
        if (existingMatch && existingMatch.mutualAcceptedDate && existingMatch.matchBlocked === false) {
            return res.status(409).json({
                errors: {
                    general: 'A match already exists between these users'
                }
            });
        }

        // If a match already exists, but the mutualAcceptedDate is not set, then
        // we are the second user to accept the match, so we need to update the
        // existing match. This will create the connection between the users allowing
        // them to chat
        if (existingMatch) {
            // Update the existing match
            existingMatch.mutualAcceptedDate = new Date().toISOString();

            // Save the updated match to the database
            const match = await existingMatch.save();

            // Return the match object
            return res.status(201).json(match);
        }

        // If we get here, then a match does not already exist,
        // so we need to create a new match

        console.log("*** checkpoint")

        const newMatch = new Match({
            user1: req.user._id,
            user2: req.body.user2
        });

        // Save the new match to the database
        await newMatch.save();

        // Return the match object
        return res.status(200).json(newMatch);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errors: {
                general: 'Something went wrong while creating a new match'
            }
        });
    }
});

/**
 * @route POST /api/matches/block/:id
 * @desc Blocks the other user in a match
 * @access Private
 * @param {String} req.body.targetUserID - Target user ID
 * @returns {Object} Match object
 * @returns {String} Error message
 */
matchesRouter.post('/block', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                general: 'You must be logged in to delete a match'
            }
        });
    }

    // Ensure we have a valid targetUserID in the request body
    if (!req.body.targetUserID) {
        return res.status(400).json({
            errors: {
                general: '"targetUserID" (User ID) must be present in the request body'
            }
        });
    }

    // Ensure the targetUserID is a valid user
    try {
        const targetUser = await User.findById(req.body.targetUserID);
        if (!targetUser) {
            return res.status(400).json({
                errors: {
                    general: 'The user you are trying to block does not exist'
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errors: {
                general: 'Something went wrong while blocking the user'
            }
        });
    }

    // Ensure the match exists
    try {
        // Find the match with both users present
        const match = await Match.findOne({
            $or: [
                { user1: req.user._id, user2: req.body.targetUserID },
                { user1: req.body.targetUserID, user2: req.user._id }
            ]
        });

        // Ensure the match exists
        if (!match) {
            return res.status(400).json({
                errors: {
                    general: 'The match you are trying to block does not exist'
                }
            });
        }

        // Ensure the match is not already blocked
        if (match.matchBlocked) {
            return res.status(400).json({
                errors: {
                    general: 'The match is already blocked'
                }
            });
        }

        // Otherwise update the match to be blocked
        match.matchBlocked = true;

        // Save the updated match to the database
        const updatedMatch = await match.save();

        // Return the updated match object
        return res.status(200).json(updatedMatch);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errors: {
                general: 'Something went wrong while blocking the user/match'
            }
        });
    }
});

module.exports = matchesRouter;
