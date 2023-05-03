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
/* const storage = multer.diskStorage({
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
}); */

// Configure image upload middleware
const upload = multer({
    extended: true, // Allow for nested data in the request body (e.g. req.body.user.name)
    storage: multer.memoryStorage(),
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
        const messages = await ChatMessage.find().or(
            [
                { sender: req.user?.id, recipient: req.params?.recipient_id },
                { sender: req.params?.recipient_id, recipient: req.user?.id }
            ]).populate('sender').populate('recipient').sort({ createdAt: 1 });

        return res.status(200).json({
            messages: messages.map(message => {
                return { sender: message?.sender?.name, recipient: message?.recipient?.name, content: message?.content, image: message?.image, readDate: message?.readDate };
            })
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

    if (!req.body?.content && !req.file) {
        return res.status(400).json({
            errors: {
                message: "You must provide a message or image to send"
            }
        });
    }

    // Convert the profile data from JSON string passed from the frontend to an object
    const bodyData = JSON.parse(req.body?.chatContent);

    // If the file's good we need to convert it to basae64 for Heroku to store it in the database
    // Convert the image to base64; The image will be in the req.file.buffer
    let base64Image = req?.file?.buffer;
    if (base64Image) {
        // If we have a file, convert it to base64
        base64Image = base64Image.toString("base64");
        // Add the image type to the base64 string
        base64Image = `data:${req.file?.mimetype};base64,${base64Image}`;
    }

    const message = new ChatMessage({
        sender: req.user?.id,
        recipient: req.params?.recipient_id,
        content: bodyData?.content,
        image: (base64Image) ? base64Image : "",
        // image: (req.file?.path) ? req.file?.path?.replace?.(/\\/g, "/") : "",
        readDate: bodyData?.readDate
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
