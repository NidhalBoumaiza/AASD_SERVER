const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { start } = require("repl");
const User = require("./userModel");

const conversationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  personnelSante: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
        required: [true, "Veuillez fournir le message !"],
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  lastUpdate: {
    type: Date,
    default: Date.now(),
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
