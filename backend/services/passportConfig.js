// Create configuration for Passport to use JWT, Google, etc.
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// Import the User model
const User = require("../models/User");

// TODO: Decide on an auth strategy, we could either use JWT or server-backed "local" (username/password) with sessions and cookies
const localLoginStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    // We need to get access to the error message if there is one passed in via the 'next' callback,
    // this'll likely be from the validateWithRules function, and why we're using the passReqToCallback option
    async (req, email, password, done) => {
        console.log("Trying to login...");
        try {
            // Find the user with the provided email
            const user = await User.findOne({ "email": email });
            if (!user) {
                console.log("No user found with that login");
                // Return an error if the user doesn't exist via the done callback
                return done(null, false, { error: "No user found with that login" });
            } else {
                // Check if the password is correct
                const isMatch = await user.isCorrectPassword(password);
                if (!isMatch) {
                    console.log("Incorrect password");
                    // Return an error if the password is incorrect via the done callback
                    return done(null, false, { error: "Incorrect password" });
                } else {
                    console.log("User found and password is correct ", user);
                    return done(null, user);
                }
            }
        } catch (error) {
            done(error);
        }
    }
);

const cookieExtractor = function (req) {
    let token = null;
    if (req && req.signedCookies && req.signedCookies.jwt) {
        token = req.signedCookies['jwt']['token'];
    }
    return token;
};

// Define the JWT strategy
const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
        // Find the user specified in token
        try {
            User.findById(payload.sub, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    // TODO: Pass an informative error here
                    done(null, false);
                }
            });
        } catch (error) {
            done(error, false);
        }
    }
);

// Tell Passport to use the strategies
// passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);
passport.use("jwt-strategy", jwtStrategy);

// Export the passport configuration
module.exports = passport;
