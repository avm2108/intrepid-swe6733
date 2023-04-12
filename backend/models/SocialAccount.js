const mongoose = require("mongoose");
const { SocialMediaServiceSchema } = require("./SocialMediaService");

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
        type: SocialMediaServiceSchema,
        required: true,
        trim: true
    }
});

module.exports = SocialAccountSchema;
