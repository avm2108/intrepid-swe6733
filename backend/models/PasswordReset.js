const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
    },
    key: {
        type: String,
        required: [true, "Key is required"],
        trim: true,
        unique: [true, "A reset with this key already exists"],
    },
    expires: {
        type: Date,
        required: [true, "Expiration is required"]
    }
});

module.exports = PasswordReset = mongoose.model("passwordresets", PasswordResetSchema);
