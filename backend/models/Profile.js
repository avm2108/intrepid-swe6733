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
        // If we're only storing the interest names and not the user's skill level or
        // other user-specific details, we can just store the interest names in an array
        // within the profile, without creating a separate UserInterestSchema
        type: [String],
        enum: [
            "Archery",
            "Backpacking",
            "Biking",
            "Boating",
            "Camping",
            "Climbing",
            "Fishing",
            "Golfing",
            "Hiking",
            "Hunting",
            "Kayaking",
            "Mountain Biking",
            "Paddling",
            "Paragliding",
            "Photography",
            "Rafting",
            "Rock Climbing",
            "Snowshoeing",
            "Surfing",
            "Sailing",
            "Scuba Diving",
            "Skiing",
            "Snowboarding",
            "Snowmobiling",
            "Swimming",
            "Tennis",
            "Trail Running",
            "Traveling",
            "Wakeboarding",
            "Water Skiing",
            "Whitewater Rafting",
            "Windsurfing",
            "Volleyball",
            "Yoga",
            "Ziplining",
        ],
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
