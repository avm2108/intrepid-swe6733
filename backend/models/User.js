const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ProfileSchema = require("./Profile");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        pattern: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
        minlength: [5, "Email must be at least 5 characters"],
        maxlength: [50, "Email must be less than 50 characters"],
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "An account with this email already exists"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [8, "Password must be at least 8 characters"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name must be less than 50 characters"],
    },
    dateOfBirth: {
        type: String,
        required: [true, "Date of birth is required"],
    },
    profile: {
        type: ProfileSchema,
        _id: false,
    },
    // TODO: Is this necessary for the MVP?
    // verifiedAccount: {
    //     type: Boolean,
    //     default: false  
    // },
    // Don't return the __v field when querying the database
    __v: {
        type: Number,
        select: false
    },
/*     likedUsers: {
        type: [objectId],
        ref: "users",
        default: [],
        _id: false,
    }, */
});

UserSchema.methods.isValidPassword = async function (password) {
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

module.exports = User = mongoose.model("users", UserSchema);
