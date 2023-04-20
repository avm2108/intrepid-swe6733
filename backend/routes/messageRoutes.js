const messageRouter = require('express').Router();
const passport = require('../services/passportConfig');
const jwt = require('jsonwebtoken');
const validateWithRules = require('../services/validation');
const { generateCsrf, verifyCsrf } = require('../services/csrfProtection');
const User = require('../models/User');
const { ChatMessage, ChatMessageSchema } = require('../models/ChatMessage');


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
        let messages = await ChatMessage.find({ sender: req.user.id, recipient: req.params.recipient_id });
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
messageRouter.post('/:recipient_id', verifyCsrf, passport.authenticate('jwt-strategy', { session: false }), async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            errors: {
                message: "You must be logged in to send your messages"
            }
        });
    }

    let message = new ChatMessage({
        sender: req.user.id,
        recipient: req.params.recipient_id,
        content: req.body.content,
        image: req.body.image,
        readDate: req.body.readDate
    });
    try {
          await message.save();
          return res.status(201).json({ message: "Success" });
        } catch (err) {
          return res.status(500).json({ message: "Sorry, unable to send message" });
        }
});

module.exports = messageRouter;
