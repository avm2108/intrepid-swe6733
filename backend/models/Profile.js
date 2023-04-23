const mongoose = require("mongoose");
const LocationSchema = require("./Location");
const ProfileImageSchema = require("./ProfileImage");
const { InterestSchema } = require("./Interest");
const PreferencesSchema = require("./Preferences");
// const { UserInterestSchema } = require("./Interest");

const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ["Male", "Female", "Non-binary", "Other/Prefer not to say"],
        trim: true,
        maxlength: 50,
        required: [true, "Please provide your gender"]
    },
    location: {
        type: LocationSchema,
        required: [true, "Please provide your location"],
        _id: false // This prevents Mongoose from creating an _id field in the location object
    },
/*     profilePictures: {
        type: [ProfileImageSchema],
        required: false, // If the user doesn't upload any photos, we can use a default profile image
        _id: false
    }, */
    profilePicture: {
        type: ProfileImageSchema,
        required: false, // If the user doesn't upload any photos, we can use a default profile image
        _id: false
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot be more than 500 characters"],
        required: false
    },
    interests: {
        // If we're only storing the interest names and not the user's skill level or
        // other user-specific details, we can just store the interest names in an array
        // within the profile, without creating a separate UserInterestSchema
        type: [String],
        enum: {
            values: [
                "Archery", "Backpacking", "Biking", "Boating", "Camping", "Climbing", "Fishing", "Golfing", "Hiking", "Hunting", "Kayaking", "Mountain Biking", "Paddling",
                "Paragliding", "Photography", "Rafting", "Rock Climbing", "Snowshoeing", "Surfing", "Sailing", "Scuba Diving", "Skiing", "Snowboarding", "Snowmobiling",
                "Swimming", "Tennis", "Trail Running", "Traveling", "Wakeboarding", "Water Skiing", "Whitewater Rafting", "Windsurfing", "Volleyball", "Yoga", "Ziplining",
            ],
            message: "This interest is invalid"
        },
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0 && v.every(el => typeof el === "string");
                // return array && array.length > 0 && array.every(val => this.enum.indexOf(val) !== -1);
            },
            message: "Please provide at least one interest"
        }
    },
    preferences: {
        type: PreferencesSchema,
        required: [true, "Please provide your preferences for prospective matches"],
        _id: false
    }
});

module.exports = ProfileSchema;
