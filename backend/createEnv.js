// This script creates a .env file with a template for the environment variables
// This'll be run automatically in the dependencies installation process
// If you want to run it manually, run the following command in the terminal
// node createEnv.js

const fs = require('fs');

const template =
`NODE_ENV=development
# Specify the port on which the Express server will listen
# If you modify this you'll need to update your frontend .env file as well
# to point to the correct backend API URL
PORT=5000
# Create a random string as a secret key for the JSON Web Token
# Change this to something randomly generated and do not upload it once you've changed it
JWT_SECRET=RandomLongSecretString
# Create a random string as a secret key to sign cookies
# Change this to something randomly generated and do not upload it once you've changed it
COOKIE_SECRET=SuperSecretCookieString
# Specify the URL of the MongoDB database, the local Community DB defaults to the following
# Note that this assumes you've created a database titled 'intrepid'
MONGODB_URI=mongodb://localhost:27017/intrepid
# Specify the timeout for the MongoDB connection in MS
# How long it'll wait to connect to the DB before giving up
MONGODB_TIMEOUT=1500
# Specify the origin of the client; this is used for CORS
# For create-react-app this is usually http://localhost:3000
CLIENT_ORIGIN=http://localhost:3000
`;

if (fs.existsSync('.env')) {
    console.log('Environment variables config file already exists');
    return;
}

fs.writeFile('.env', template, (err) => {
    if (err) throw err;
    console.log('Environment variables config file created successfully');
});
