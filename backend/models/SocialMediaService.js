const mongoose = require("mongoose");

const SocialMediaServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    authUrl: {
        type: String,
        required: false,
        trim: true
    },
    requiredScopes: {
        type: String,
        required: false,
        trim: true
    },
    tokenExpiryInt: {
        type: Number,
        required: false,
        trim: true
    }
});

module.exports = { SocialMediaService: mongoose.model("socialMediaServices", SocialMediaServiceSchema), SocialMediaServiceSchema: SocialMediaServiceSchema };
