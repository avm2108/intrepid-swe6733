const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// TODO: we should have geo coordinates in order to do distance calculations
const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = { mongoose.model("Location", LocationSchema) as LocationModel, LocationSchema };
