const express = require("express");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post(
  "/storeMessage",
  authController.protect,
  conversationController.storeMessage,
);

router.post(
  "/initiate",
  authController.protect,
  conversationController.initiateConverstation,
);

router.get(
  "/myConversations",
  authController.protect,
  conversationController.getLastConversations,
);
router.get(
  "/messages/:userId",
  authController.protect,
  conversationController.getAllMessagesWithUser,
);

module.exports = router;
