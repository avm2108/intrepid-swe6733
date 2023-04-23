const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { MatchSchema } = require("./Match");

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
}, { timestamps: true });

module.exports = {
    ChatMessage: mongoose.model("chatMessages", ChatMessageSchema),
    ChatMessageSchema: ChatMessageSchema
};
