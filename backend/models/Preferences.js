const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* const InterestSchema = require('./Interest');
const objectId = mongoose.Schema.Types.ObjectId; */

const AgeRangeSchema = new Schema({
    min: {
        type: Number,
        min: [18, "Minimum age must be at least 18"],
        max: [99, "Minimum age must be less than 99"],
        required: [true, "Please provide your minimum age preference"]
    },
    max: {
        type: Number,
        min: [18, "Maximum age must be at least 18"],
        max: [99, "Maximum age must be less than 99"],
        required: [true, "Please provide your maximum age preference"],
    },
});

const PreferencesSchema = new Schema({
    gender: {
        type: [String],
        enum: {
            values: ["Male", "Female", "Non-binary", "Other"],
            message: "Please choose gender options from the list"
        },
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0 && v.every(el => typeof el === 'string');
                // return array && array.length > 0 && array.every(val => this.enum.indexOf(val) !== -1);
            },
            message: "Please provide your gender preference(s)."
        },
    },
    ageRange: {
        type: AgeRangeSchema,
        required: [true, "Please provide your age range preferences"],
        _id: false
    },
    distance: {
        type: Number,
        min: [0, "Distance must be at least 0"],
        required: [true, "Please provide your maximum distance preference"],
    },
    // Allow the user to specify what interests they're looking for in a partner?
    // Since we're using a central repository of interests, we can just store the interest IDs in the user's preferences
    /* interests: {
        type: [objectId],
        ref: 'interests',
        required: false,
    } */
});

module.exports = PreferencesSchema;
