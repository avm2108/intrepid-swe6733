const mongoose = require("mongoose");

// TODO: we should have geo coordinates in order to do distance calculations
const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        // TODO: Should this be more generalized like 'region' for countries which don't have 'states'            type: String,
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    // TODO: We'll need to determine coords from the given location, and is an effective way to store them?
    coordinates: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = LocationSchema;
