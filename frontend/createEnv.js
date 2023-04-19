// This script creates a .env file with a template for the environment variables
// This'll be run automatically in the dependencies installation process
// If you want to run it manually, run the following command in the terminal
// node createEnv.js

const fs = require('fs');

const template =
`# Ensure this matches your backend API URL
# For development, by default it's http://localhost:5000
# but make sure to change it if you're using a different port
# in your backend .env file
REACT_APP_API_URL=http://localhost:5000
`;
(() => {
    if (fs.existsSync('.env')) {
        console.log('Environment variables config file already exists');
        return;
    }
    
    fs.writeFile('.env', template, (err) => {
        if (err) throw err;
        console.log('Environment variables config file created successfully');
    });
})();
