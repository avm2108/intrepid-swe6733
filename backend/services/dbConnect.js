const mongoose = require('mongoose');

// Connect to the database
const dbConnect = async () => {
    const clientPromise = await mongoose.connect(
        process.env.MONGODB_URI,{
        useNewUrlParser: true,
        family: 4, // Using IPv6 has caused issues with Mongoose in the past
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: process.env.MONGODB_TIMEOUT,
    }).then(() => {
        console.log("MongoDB successfully connected");
        mongoose.connection.useDb('intrepid');
        // Are we connected?
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB connection is open");
        }
        
        return mongoose.connection.getClient();
    }).catch(err => {
        console.log("Mongoose Error \n" + err);
        process.exit(1);
    });

    // Log any errors that occur after the initial connection
    mongoose.connection.on('error', err => {
        console.log("MongoDB encountered an error: " + err);
    });

    return clientPromise;
};

// Export the function
module.exports = dbConnect; 
