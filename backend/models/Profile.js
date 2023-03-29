const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { InterestSchema } = require("./Interest");
const { LocationSchema } = require("./Location");
const { ProfileImageSchema } = require("./ProfileImage");

const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
        trim: true,
    },
    location: {
        type: LocationSchema,
    },
    photos: {
        type: [ProfileImageSchema],
        trim: true,
        default: []
    },
    bio: {
        type: String,
        trim: true,
        default: "",
        maxlength: 200
    },
    interests: {
        type: [InterestSchema],
        trim: true,
        default: []
    },
});

module.exports = { mongoose.model("Profile", ProfileSchema) as ProfileModel, ProfileSchema };
