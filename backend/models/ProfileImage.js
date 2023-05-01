const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ProfileImageSchema = new mongoose.Schema({
    file: {
        type: String,
        default: "",
        required: false,
        // required: [true, "Please provide an image file to use as your profile picture."],
        trim: true
    },
    href: { // For external links
        type: String,
        default: "",
        // required: [true, "Please provide a link to your profile picture."],
        required: false,
        trim: true
    },
    position: {
        type: Number,
        default: 0,
        // required: [true, "Please specify the position of this profile picture."],
        trim: true,
    },
    caption: {
        type: String,
        // required: [true, "A caption for your profile picture is required."],
        trim: true
    }
});

module.exports = ProfileImageSchema;
