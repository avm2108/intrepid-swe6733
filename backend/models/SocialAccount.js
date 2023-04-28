const mongoose = require("mongoose");

const SocialAccountSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: false,
        trim: true
    },
    refreshToken: {
        type: String,
        required: false,
        trim: true,
    },
    lastRefreshDate: {
        type: String,
        required: false,
        trim: true
    },
    allowedScopes: {
        type: String,
        required: false,
        trim: true
    },
    service: {
        type: String,
        required: true,
        trim: true
    },
    accountId: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

module.exports = SocialAccount = mongoose.model("socialaccounts", SocialAccountSchema);
