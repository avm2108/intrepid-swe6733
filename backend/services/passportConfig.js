// Create configuration for Passport to use JWT, Google, etc.
const SocialAccount = require('../models/SocialAccount');
const User = require("../models/User");
const axios = require('axios');
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const InstagramStrategy = require('passport-instagram-basic-api').Strategy;

const signedCookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies["jwt"];
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        signedCookieExtractor
    ]),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (req, payload, done) => {
    try {
        // Find the user by the ID in the JWT payload
        User.findById(payload.id).then((user) => {
            if (user) {
                // If the user was found, return it for access via req.user in further middleware
                done(null, user);
            } else {
                // If the user wasn't found, return false
                done(null, false);
            }
        }).catch((err) => {
            console.log(err);
            // If there was an error, return the error
            done(err, false);
        });
    } catch (err) {
        console.log(err);
        // If there was an error, return the error
        done(err, false);
    }
});

passport.use("jwt-strategy", jwtStrategy);

passport.use("instagram", new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL
},
    async function (accessToken, _refreshToken, profile, done) {
        console.log("recieved profile", profile);
        console.log("recieved access token", accessToken);

        if (!profile || !profile.id || !accessToken) {
            console.log("Cannot authenticate with IG, something is missing");
            done(err, false);
        }

        try {
            const account = await SocialAccount.findOneAndUpdate({ service: 'instagram', accountId: profile.id }, { accessToken: accessToken }, { new: true, upsert: true });
            if (account) {
                console.log("creating social account");
                done(null, { profile: profile, accessToken: accessToken });
            } else {
                console.log("unable to create social account");
                done(err, false);
            }
        } catch (err) {
            console.log("unable to create social account");
            console.log(err);
        }
    }
));

passport.serializeUser(function (user, done) {
    console.log("serializing (ig) profile", user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log("deserializing (ig) profile", user)
    done(null, user);
});

// Export the passport configuration
module.exports = passport;
