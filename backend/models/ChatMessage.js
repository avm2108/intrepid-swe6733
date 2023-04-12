const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserSchema } = require("./User");
const { MatchSchema } = require("./Match");

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: UserSchema,
        required: true,
        trim: true
    },
    recipient: {
        type: UserSchema,
        required: true,
        trim: true
    },
    readDate: {
        type: String,
        required: false,
        trim: true
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = {
    ChatMessage: mongoose.model("chatMessages", ChatMessageSchema),
    ChatMessageSchema: ChatMessageSchema
};
