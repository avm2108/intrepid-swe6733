// Using NodeJS to craate .env file in this directory
// This'll be run automatically in the dependencies installation process
// If you want to run it manually, run the following command in the terminal
// node createEnv.js

const fs = require('fs');

const template =
    `
# Specify the port on which the Express server will listen
PORT=5000
# Create a random string as a secret key for the JSON Web Token
JWT_SECRET=
# Create a random string as a secret key to sign cookies
COOKIE_SECRET=
# Specify the URL of the MongoDB database, the Community DB defaults to the following
MONGODB_URI=mongodb://localhost:27017/intrepid
# Specify the timeout for the MongoDB connection
MONGODB_TIMEOUT=1500
`;

if (fs.existsSync('.env')) {
    console.log('Environment variables config file already exists');
    return;
}

fs.writeFile('.env', template, (err) => {
    if (err) throw err;
    console.log('Environment variables config file created successfully');
});
