const mongoose = require("mongoose");
const { chatMessageSchema } = require("./ChatMessage");

// TODO: How are we planning to keep track of a match that one person has accepted while waiting on the other person to accept?
const MatchSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    },
    // In a way the chats for a particular match could be a subdocument of the match
/*     chats: {
        type: [chatMessageSchema],
        required: false,
        trim: true
    } */
});

module.exports = { Match: mongoose.model("matches", MatchSchema), MatchSchema: MatchSchema };
