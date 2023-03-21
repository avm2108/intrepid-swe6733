const mongoose = require('mongoose');

// Connect to the database
const dbConnect = async () => {
    await mongoose.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            family: 4,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: process.env.MONGODB_TIMEOUT,
        })
        .then(() => console.log("MongoDB successfully connected"))
        .catch(err => {
            console.log("Mongoose Error \n" + err);
            process.exit(1);
        });

    // Log any errors that occur after the initial connection
    mongoose.connection.on('error', err => {
        console.log("MongoDB encountered an error: " + err);
    });
};

// Export the function
module.exports = dbConnect; 
