// Import dependencies
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import our database connection function
const dbConnect = require("./services/dbConnect");

// Allow our app access to environment variables defined in .env
require('dotenv').config();

// Create an Express to manifest our server
const app = express();

// Define any middleware, each request will go through these/have their functionality or processing applied
// Enable request bodies in either json or urlencoded format to be parsed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable cookies to be parsed, and use the secret defined in our environment variables to sign/decrypt them
app.use(cookieParser(process.env.COOKIE_SECRET));

// Enable CORS, and allow credentials (cookies, tokens, etc.) to be passed; ideally limit it to only the client's origin
app.use(cors({ credentials: true }));

// Disable the X-Powered-By header to prevent information leakage about the server
app.disable("x-powered-by");

// Import our API endpoint definitions
const authRouter = require("./routes/authRoutes");

// Activate our API endpoints
app.use("/api/auth", authRouter);


app.get("/test", (req, res) => {
    res.send("Hello World");
});

// Serve static assets if in production
/* if (process.env.NODE_ENV === "production") {
    // Set the static folder, we'll have to 'npm run build' in the React folder and copy the build folder into the backend folder
    app.use(express.static("public"));

    // Serve the index.html file for all requests that don't match an API endpoint
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
} */

// Start the server
dbConnect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.log("Error connecting to MongoDB \n" + err);
});
