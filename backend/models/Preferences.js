const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* const InterestSchema = require('./Interest');
const objectId = mongoose.Schema.Types.ObjectId; */

const AgeRangeSchema = new Schema({
    min: {
        type: Number,
        min: 18,
        required: true,
    },
    max: {
        type: Number,
        max: 99,
        required: false,
    },
});

const PreferencesSchema = new Schema({
    gender: {
        type: [String],
        trim: true,
        default: [],
        maxlength: 50,
        required: false,
    },
    ageRange: {
        type: AgeRangeSchema,
        required: false,
        _id: false
    },
    distance: {
        type: Number,
        min: 0,
        required: false,
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
