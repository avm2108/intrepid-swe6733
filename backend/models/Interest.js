const mongoose = require("mongoose");

const InterestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // List of outdoor activities pre-specifed so we don't have to worry about trying to match up inconsistent user input
        enum: [
            "Archery",
            "Backpacking",
            "Biking",
            "Boating",
            "Camping",
            "Climbing",
            "Fishing",
            "Golfing",
            "Hiking",
            "Hunting",
            "Kayaking",
            "Mountain Biking",
            "Paddling",
            "Paragliding",
            "Photography",
            "Rafting",
            "Rock Climbing",
            "Snowshoeing",
            "Surfing",
            "Sailing",
            "Scuba Diving",
            "Skiing",
            "Snowboarding",
            "Snowmobiling",
            "Swimming",
            "Tennis",
            "Trail Running",
            "Traveling",
            "Wakeboarding",
            "Water Skiing",
            "Whitewater Rafting",
            "Windsurfing",
            "Volleyball",
            "Yoga",
            "Ziplining",
        ]
    },
    // This could be a little icon that appears next to the activity name
/*     image: {
        type: String,
        required: false,
        trim: true
    }, */
});

// Needed?
// Allow a user to specify their skill level and other details about their interests
/* const UserInterestSchema = new mongoose.Schema({
    interest: {
        type: InterestSchema,
        required: true,
    },
    skillLevel: {
        type: Number,
        min: 1,
        max: 5,
        required: false,
    },
    yearsExperience: {
        type: Number,
        min: 0,
        required: false,
    },
    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 500,
        required: false
    },
});
 */
module.exports = {
    Interest: mongoose.model("interests", InterestSchema),
    InterestSchema: InterestSchema,
    // UserInterestSchema: UserInterestSchema
}
