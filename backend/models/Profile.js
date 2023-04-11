const mongoose = require("mongoose");
const LocationSchema = require("./Location");
const ProfileImageSchema = require("./ProfileImage");
const { InterestSchema } = require("./Interest");
const PreferencesSchema = require("./Preferences");
// const { UserInterestSchema } = require("./Interest");

const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
        trim: true,
        default: "",
        maxlength: 50,
        required: true
    },
    location: {
        type: LocationSchema,
        required: true,
        _id: false // This prevents Mongoose from creating an _id field in the location object
    },
    profilePictures: {
        type: [ProfileImageSchema],
        trim: true,
        default: [],
        required: false, // If the user doesn't upload any photos, we can use a default profile image
        _id: false
    },
    bio: {
        type: String,
        trim: true,
        default: "",
        maxlength: 200,
        required: false
    },
    interests: {
        type: [InterestSchema],
        trim: true,
        default: [],
        required: true,
        _id: false
    },
    preferences: {
        type: [PreferencesSchema],
        trim: true,
        default: [],
        required: true,
        _id: false
    }
});

module.exports = ProfileSchema;
