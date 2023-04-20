const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ProfileImageSchema = new mongoose.Schema({
    file: {
        type: String,
        required: [true, "Please provide an image file to use as your profile picture."],
        trim: true
    },
    position: {
        type: Number,
        required: [true, "Please specify the position of this profile picture."],
        trim: true,
    },
    caption: {
        type: String,
        required: [true, "A caption for your profile picture is required."],
        trim: true
    }
});

module.exports = ProfileImageSchema;
