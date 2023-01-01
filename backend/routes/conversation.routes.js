const express = require("express");
const router = express.Router();
const convCtrl = require("../controllers/conversation.controller");
const validatePostConv = require("../middlewares/validatePostConv");

// send a message on specific conversation
router.put("/", validatePostConv, convCtrl.sendMessage);

// get all user conversations
router.get("/userConversations/:userId", convCtrl.getUserConversations);

// get conversation messages
router.get("/userConversation", convCtrl.getConvMessages);

module.exports = router;
