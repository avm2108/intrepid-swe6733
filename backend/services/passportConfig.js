// Create configuration for Passport to use JWT, Google, etc.
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// Import the User model
const User = require("../models/User");

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
        // Find the user specified in token
        // Find the user in the database, but we have to do it Promise style
        User.findById(payload.id)  // Find the user by the ID in the JWT payload
            .then((user) => {
                if (user) {
                    // If the user was found, return it for access via req.user in further middleware
                    done(null, user);
                } else {
                    // If the user wasn't found, return false
                    done(null, false);
                }
            }
            ).catch((err) => {
                // If there was an error, return the error
                done(err, false);
            }); 
    } catch (err) {
        // If there was an error, return the error
        done(err, false);
    }
});

passport.use("jwt-strategy", jwtStrategy);

// Export the passport configuration
module.exports = passport;
