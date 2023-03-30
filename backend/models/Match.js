const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserSchema } = require("./User");

const MatchSchema = new mongoose.Schema({
    user1: {
        type: UserSchema,
        required: true,
        trim: true
    },
    user2: {
        type: UserSchema,
        required: false,
        trim: true
    },
    mutualAcceptedDate: {
        type: String,
        required: false,
        trim: true
    },
    matchBlocked: {
        type: Boolean,
        required: false,
        trim: true
    }
});

module.exports = { mongoose.model("Match", MatchSchema) as MatchModel, MatchSchema };
