const mongoose = require("mongoose");

// TODO: we should have geo coordinates in order to do distance calculations
// TODO: Should certain fields be required? (e.g. city, state, country) or should we allow
// a user to specify only what they want to share? (e.g. state, or country, but not city)
// At the same time should we allow the user to hide their location from their profile?
const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, "Your current city is required."],
        maxLength: [50, "Your city cannot be more than 50 characters."],
        trim: true
    },
    state: {
        // TODO: Should this be more generalized like 'region' for countries which don't have 'states'            type: String,
        type: String,
        required: [true, "Your current state is required."],
        maxLength: [50, "Your state cannot be more than 50 characters."],
        trim: true
    },
    country: {
        type: String,
        required: [true, "Your current country is required."],
        maxLength: [50, "Your country cannot be more than 50 characters."],
        trim: true
    },
    // TODO: We'll need to determine coords from the given location, and is an effective way to store them?
    coordinates: {
        type: String,
        required: false,
        trim: true
    },
    showOnProfile: {
        type: Boolean,
        required: false,
        default: true
    },
});

module.exports = LocationSchema;
