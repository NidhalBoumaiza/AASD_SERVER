const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Appointment = require("../models/appointmentModel");
const mongoose = require("mongoose");
const Conversation = require("../models/conversationModel");
//----------------- PATIENT --------------------------
exports.storeMessage = catchAsync(async (senderId, userId, message) => {
    const newMessage = {
      sender: senderId,
      message: message,
      createdAt: new Date()
    };
  
    await Conversation.findOneAndUpdate(
      { $or: [{ patient: senderId, personnelSante: userId }, { patient: userId, personnelSante: senderId }] },
      { $push: { messages: newMessage }, $set: { lastUpdate: new Date() } },
      { new: true, upsert: true }
    );
});
  

exports.getLastConversations = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
  
    const conversations = await Conversation.find({
      $or: [{ patient: userId }, { personnelSante: userId }]
    })
      .sort({ lastUpdate: -1 })
      .populate('patient personnelSante')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 }
      });
  
    res.status(200).json({
      status: 'success',
      results: conversations.length,
      data: {
        conversations
      }
    });
});
  

exports.getAllMessagesWithUser = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const otherUserId = req.params.userId;
  
    const conversation = await Conversation.findOne({
      $or: [
        { patient: userId, personnelSante: otherUserId },
        { patient: otherUserId, personnelSante: userId }
      ]
    }).populate('messages.sender');
  
    if (!conversation) {
      return next(new AppError('No conversation found with that user', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        messages: conversation.messages
      }
    });
  });