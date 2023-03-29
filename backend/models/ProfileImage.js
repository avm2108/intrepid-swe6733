const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ProfileImageSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    caption: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = { mongoose.model("ProfileImage", ProfileImageSchema) as ProfileImageModel, ProfileImageSchema };
