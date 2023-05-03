// Allow our app access to environment variables defined in .env
console.log("Running in " + process.env.NODE_ENV + " mode.");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./.env" });
} else {
    require("dotenv").config({ path: "./.env.production" });
}
const bcrypt = require('bcryptjs');
const dbConnect = require('./services/dbConnect');
const User = require('./models/User');

const seedUsers = async () => {
    await dbConnect();
    const NUM_USERS_TO_SEED = 10;

    // Define an array of possible interests for our dummy users
    const interests = [
        "Archery", "Backpacking", "Biking", "Boating", "Camping", "Climbing", "Fishing", "Golfing", "Hiking", "Hunting", "Kayaking", "Mountain Biking", "Paddling",
        "Paragliding", "Photography", "Rafting", "Rock Climbing", "Snowshoeing", "Surfing", "Sailing", "Scuba Diving", "Skiing", "Snowboarding", "Snowmobiling",
        "Swimming", "Tennis", "Trail Running", "Traveling", "Wakeboarding", "Water Skiing", "Whitewater Rafting", "Windsurfing", "Volleyball", "Yoga", "Ziplining",
    ];

    const sampleNames = ["Emma Johnson", "Noah Smith", "Olivia Davis", "Liam Rodriguez", "Ava Garcia", "William Hernandez", "Sophia Martinez", "Mason Brown", "Isabella Gonzalez", "James Perez", "Mia Taylor", "Benjamin Anderson", "Charlotte Thomas", "Jacob Jackson", "Amelia White", "Michael Harris", "Harper Martin", "Ethan Thompson", "Evelyn Moore", "Daniel Clark"];

    // Create an array of dummy users
    const dummyUsers = [];
    for (let i = 0; i < NUM_USERS_TO_SEED; i++) {
        const pw = `${sampleNames[i].split(' ')[0].toLowerCase()}Passw0rd!`;
        const user = new User({
            // Get their first name
            email: `${sampleNames[i].split(' ')[0].toLowerCase()}@example.com`,
            password: await bcrypt.hash(pw, await bcrypt.genSalt(10)),
            name: sampleNames[i],
            // Random date of birth between 1/1/1990 and 1/1/2000
            dateOfBirth: new Date(1990 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            profile: {
                gender: ["Male", "Female", "Non-binary"][Math.floor(Math.random() * 3)],
                location: {
                    city: "New York",
                    state: "NY",
                    country: "USA"
                },
                profilePicture: {
                    href: `https://source.unsplash.com/random/600x800/?office+${["male", "female"][Math.floor(Math.random() * 2)]}`,
                    caption: "This is my profile picture"
                },
                bio: "I'm a dummy user",
                interests: [interests[Math.floor(Math.random() * interests.length)]],
                preferences: {
                    gender: ["Male", "Female", "Non-binary"],
                    ageRange: {
                        min: 18,
                        max: 99
                    },
                    distance: 500
                },
            },
            profileComplete: true,
        });
        dummyUsers.push(user);
    }

    // Insert the dummy users into the database
    try {
        // Find and update the dummy users
        for (let i = 0; i < NUM_USERS_TO_SEED; i++) {
            const user = dummyUsers[i];
            const a = User.findOneAndUpdate({ email: user.email }, user, { upsert: true });
            await a.exec();
        }
        // const b = User.insertMany(dummyUsers);
        console.log('Dummy users seeded successfully');
    } catch (err) {
        console.error(err);
    }
    // exit
    process.exit(0);
};

seedUsers();
