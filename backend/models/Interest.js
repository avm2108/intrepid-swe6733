const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const InterestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
        // enum: ["hiking", "biking", "swimming", "running", "yoga", "pilates", "weightlifting", "rock climbing", "bouldering", "ice climbing", "mountaineering", "backpacking", "camping", "skiing", "snowboarding", "snowshoeing", "snowmo
    },
    // I'm thinking this could be a little icon that appears next to the activity name, definitely optional
    image: {
        type: String,
        required: true,
        trim: true
    },
    skillLevel: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = { mongoose.model("Interest", InterestSchema) as InterestModel, InterestSchema };
