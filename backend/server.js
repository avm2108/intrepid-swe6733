// Allow our app access to environment variables defined in .env
console.log("Running in " + process.env.NODE_ENV + " mode.");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./.env" });
} else {
    require("dotenv").config({ path: "./.env.production" });
}

// Import dependencies
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import our database connection function
const dbConnect = require("./services/dbConnect");

// Create an Express to manifest our server
const app = express();

// Define any middleware, each request will go through these/have their functionality or processing applied
// Enable cookies to be parsed, and use the secret defined in our environment variables to sign/decrypt them
app.use(cookieParser(process.env.COOKIE_SECRET));

// Enable request bodies in either json or urlencoded format to be parsed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS bypass for the frontend, and allow credentials (cookies, etc.) to be passed
app.use(cors({
    origin: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
    credentials: true
    // TODO: On production, we should specify SameSite and Secure options
}));

// Disable the X-Powered-By header to prevent information leakage about the server
app.disable("x-powered-by");

// Import our API endpoint definitions
const authRouter = require("./routes/authRoutes");
const accountRouter = require("./routes/accountRoutes");
const profileRouter = require("./routes/profileRoutes");
const messageRouter = require("./routes/messageRoutes");
const publicRouter = require("./routes/publicRoutes");

// For debugging, we can output any incoming requests as well as their bodies
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log("Request received: " + req.method + " " + req.url);
        console.log("Request body: " + JSON.stringify(req.body));
        console.log("Request cookies: " + JSON.stringify(req.cookies) + " " + JSON.stringify(req.signedCookies));

        next();
    });
}

// Activate our API endpoints
// TODO: Might want to reorganize these to be more RESTful
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/profile", profileRouter);
app.use("/api/messages", messageRouter);
app.use("/api", publicRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set the static folder, we'll have to 'npm run build' in the React folder and copy the build folder into the backend folder
    app.use(express.static("build"));

    // Serve the index.html file for all requests that don't match an API endpoint
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "build", "index.html"));
    });
}

// Start the server
dbConnect().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.log("Error connecting to MongoDB \n" + err);
});
