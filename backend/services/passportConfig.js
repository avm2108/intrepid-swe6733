// Create configuration for Passport to use JWT, Google, etc.
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const InstagramStrategy = require('passport-instagram').Strategy;

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

passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID, // TODO: set me in env
    clientSecret: INSTAGRAM_CLIENT_SECRET, // TODO: set me in env
    callbackURL: "https://intrepid.herokuapp.com/api/auth/instagram/callback" // TODO: set me in env
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("made it here");
      console.log(profile);
    // TODO: if we want to associate to an existing user- perhaps we can check for logged in user or cookies here for the JWT and if so just associate
    // otherwise, create a user associated to the profile, but then you will want to data collect for registration
    User.find({ instagramId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// Export the passport configuration
module.exports = passport;
