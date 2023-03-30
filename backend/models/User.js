const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ProfileSchema } = require("./Profile");
const { SocialAccountSchema } = require("/SocialAccount");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "An account with this email already exists"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: 8
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    dateOfBirth: {
        type: String,
        required: [true, "Date of birth is required"],
    },
    profile: {
        type: ProfileSchema,
    },
    socialAccounts: {
        type: [SocialAccountSchema],
    },
    verifiedAccount: {
        type: Boolean,
        default: false  
    },
});

UserSchema.methods.isCorrectPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Before saving a new instance of the User model, hash/encrypt the password
UserSchema.pre('save', async function(next) {
    try {
        // If password is not modified, move on
        if (!this.isModified('password')) next();
        // Otherwise, first generate salt
        const salt = await bcrypt.genSalt(10);
        // Then hash the password using the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace plain text password with hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("User", UserSchema);
