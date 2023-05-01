const messageRouter = require('express').Router();
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const validateWithRules = require('../services/validation');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');
const { ChatMessage, ChatMessageSchema } = require('../models/ChatMessage');
const mongoose = require("mongoose");
const multer = require('multer');
const crypto = require('crypto');

// Configure image upload storage to store locally
// TODO: Error handling for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/chatImages');
    },
    // Modify the filename of the stored file to be unique
    filename: function (req, file, cb) {
        const extension = path.extname(file?.originalname).toLowerCase();
        // Ensure extension is an image
        if (extension !== '.png' && extension !== '.jpg' && extension !== '.jpeg') {
            return cb(new Error('Only JPEG and PNG images are allowed'));
        }
        // Create a unique filename
        const random = crypto.randomBytes(8).toString('hex');
        cb(null, file.fieldname + '-' + (random) + extension);
    }
});

// Configure image upload middleware
const upload = multer({
    extended: true, // Allow for nested data in the request body (e.g. req.body.user.name)
    storage: storage,
    limits: {
        // Limit file size to 5MB (?)
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            console.log("File allowed")
            cb(null, true);
        } else {
            console.log("File rejected")
            // TODO: Add error handling
            cb(null, false);
        }
    }
});


// get list of messages for logged in user for a single parter (conversation)
messageRouter.get('/:recipient_id', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to view your messages"
            }
        });
    }

    try {
        let messages = await ChatMessage.find().or(
            [
                { sender: req.user.id, recipient: new mongoose.Types.ObjectId(req.params.recipient_id) },
                { sender: new mongoose.Types.ObjectId(req.params.recipient_id), recipient: req.user.id }
            ]).sort({ createdAt: 1 });

        return res.status(200).json({
            messages: messages
        });
    } catch (err) {
        console.log("Error getting user messages: ", err);
        return res.status(500).json({
            errors: {
                message: "There was an error retrieving your messages, please try again later"
            }
        });
    }
});

// create new message for logged in user and specific partner
messageRouter.post('/:recipient_id', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), upload.single("chatImage"), async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to send your messages"
            }
        });
    }

    let message = new ChatMessage({
        sender: req.user.id,
        recipient: new mongoose.Types.ObjectId(req.params.recipient_id),
        content: req.body.content,
        image: (req.file?.path) ? req.file?.path?.replace?.(/\\/g, "/") : "",
        readDate: req.body.readDate
    });
    try {
        await message.save();
        return res.status(201).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Sorry, unable to send message" });
    }
});

module.exports = messageRouter;
