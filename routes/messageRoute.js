// Note: messageRoute.js
const express = require("express");
const router = new express.Router();

const messageController = require("../controllers/messageController");
const messageValidation = require("../utilities/message-validation");
const utilities = require("../utilities");

router.use(["/view/:messageId", "/compose", "/compose/:messageId", "/send", "/archive", "/view/:messageId/delete", "/delete", "/view/:messageId/toggle-read", "/view/:messageId/toggle-archived"], utilities.checkLogin);

router.get("/", utilities.checkLogin, utilities.handleErrors(messageController.buildInbox));

// Route to build message view
router.get("/view/:messageId", utilities.handleErrors(messageController.buildMessageView));

// Routes to build compose message view and send message
router.get("/compose", utilities.handleErrors(messageController.buildCompose));
router.get("/compose/:messageId", utilities.handleErrors(messageController.buildCompose));
router.post("/send", messageValidation.sendMessageRules(), messageValidation.checkMessageData, utilities.handleErrors(messageController.sendMessage))

// Route to build archived messages view
router.get("/archive", utilities.handleErrors(messageController.buildArchive));

// Routes to delete messages
router.get("/view/:messageId/delete", utilities.handleErrors(messageController.buildDelete));
router.post("/delete", utilities.handleErrors(messageController.deleteMessage));


//API Routes to toggle read and archived status
router.get("/view/:messageId/toggle-read", utilities.handleErrors(messageController.toggleRead));
router.get("/view/:messageId/toggle-archived", utilities.handleErrors(messageController.toggleArchived));

module.exports = router;