const publicRouter = require('express').Router();
const validateWithRules = require('../services/validation');
const PasswordReset = require('../models/PasswordReset');
const Crypto = require('crypto');

publicRouter.get("/test", (req, res) => {
   res.send("API is running...");
});

publicRouter.post("/forgot-password", async (req, res) => {
 // generate one time key
 let key = Crypto.randomBytes(20).toString('hex');
 
 // store key in database with expiration (or update existing based on email)
 let reset = new PasswordReset({
      email: req.body.email,
      key: key,
      expires: new Date(Date.now() + (3600 * 1000 * 24)),
  });
 try {
   await reset.save();
   return res.status(201).json({ message: "http://localhost:3000/reset-password/" + key }); // TODO: Don't leave me here
 } catch (err) {
   return res.status(500).json({ message: "Sorry, it done broke" });
 }
 
 // send email with one time key for reset (might need to use hosting provider mail server or mailgun etc)
 // TODO: for now is in the response
});

publicRouter.post("/reset-password/:key", async (req, res) => {
   // verify key matches in the database and that provided email matches
   try {
   let reset = await PasswordReset.findOneAndDelete({ email: req.body.email, key: req.params.key });
    if (reset && reset.expires >= Date.now()) {
       // TODO apply new password from request body to associated user
       return res.status(200).json({ message: "Reset successful" });
    } else {
       return res.status(400).json({ message: "Not found" });
    }
   } catch (err) {
      return res.status(400).json({ message: "Not found" });
   }
});

// Export the router to be used in our server.js file
module.exports = publicRouter;
