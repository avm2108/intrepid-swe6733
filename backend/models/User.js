const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the Location schema
const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        // required: true,
        trim: true
    },
    state: {
        type: String,
        // required: true,
        trim: true
    },
    country: {
        type: String,
        // required: true,
        trim: true
    }
}, { _id: false }); // Don't create an _id for this subdocument

// Define the Interest schema
// We should probably extract this (into a separate model) and define a central set of allowed activities
// And then the user can have references to the activity in that set combined with their skill level
// That way we don't have to have a bunch of duplicate data with names like "hiking" and "Hiking" and "HIKING"
const InterestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
        // enum: ["hiking", "biking", "swimming", "running", "yoga", "pilates", "weightlifting", "rock climbing", "bouldering", "ice climbing", "mountaineering", "backpacking", "camping", "skiing", "snowboarding", "snowshoeing", "snowmo
    },
    // I'm thinking this could be a little icon that appears next to the activity name, definitely optional
    image: {
        type: String,
        required: true,
        trim: true
    },
    skillLevel: {
        type: Number,
        required: true,
        trim: true
    }
}, { _id: false });

// Define the User schema
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
    gender: {
        type: String,
        trim: true,
    },
    location: {
        type: LocationSchema,
    },
    profilePicture: {
        type: String,
        trim: true,
        default: ""
    },
    bio: {
        type: String,
        trim: true,
        default: "",
        maxlength: 200
    },
    interests: {
        type: [InterestSchema],
        trim: true,
        default: []
    },
});

UserSchema.methods.isCorrectPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

UserSchema.pre('save', async function (next) {
    try {
        // If password is not modified, move on
        if (!this.isModified('password')) next();
        // Otherwise, first generate salt
        const salt = await bcrypt.genSalt(10);
        // Then hash the password using it
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Replace plain text password with hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("User", UserSchema);
