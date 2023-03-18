// Create configuration for Passport to use JWT, Google, etc.
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// Import the User model
const User = require("../models/User");

const localLoginStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        // Perform validation on the request
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Email is invalid").isEmail();
        req.checkBody("password", "Password is required").notEmpty();
    
        // Check for validation errors
        const errors = req.validationErrors();
        if (errors) {
            return done(null, false, { message: errors[0].msg });
        }

        try {
            // Find the user with the provided email
            const user = await User.findOne({ "email": email });
            if (!user) {
                return done(null, false);
            } else {
                // Check if the password is correct
                const isMatch = await user.isCorrectPassword(password);
                if (!isMatch) {
                    return done(null, false);
                } else {
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
