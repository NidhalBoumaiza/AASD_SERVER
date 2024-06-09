const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Conversation = require("../models/conversationModel");

exports.initiateConverstation = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user?.role === "Patient") {
    const foundConversation = await Conversation.findOne({
      patient: user?._id,
      personnelSante: req.body?._id,
    });

    if (foundConversation) return res.status(204).json({ status: "Success" });

    const newConversation = await Conversation.create({
      patient: user?._id,
      personnelSante: req?.body?._id,
    });

    return res.status(201).json({
      status: "Success",
      conversation: newConversation,
    });
  }

  const foundConversation = await Conversation.findOne({
    patient: req.body?._id,
    personnelSante: user?._id,
  });

  if (foundConversation) return res.status(204).json({ status: "Success" });

  const newConversation = await Conversation.create({
    patient: req.body?._id,
    personnelSante: user?._id,
  });

  return res.status(201).json({
    status: "Success",
    conversation: newConversation,
  });
});

//----------------- PATIENT --------------------------
exports.storeMessage = catchAsync(async (senderId, userId, message) => {
  const newMessage = {
    sender: senderId,
    message: message,
    createdAt: new Date(),
  };

  await Conversation.findOneAndUpdate(
    {
      $or: [
        { patient: senderId, personnelSante: userId },
        { patient: userId, personnelSante: senderId },
      ],
    },
    { $push: { messages: newMessage }, $set: { lastUpdate: new Date() } },
    { new: true, upsert: true },
  );
});

exports.getLastConversations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const conversations = await Conversation.find({
    $or: [{ patient: userId }, { personnelSante: userId }],
  })
    .sort({ lastUpdate: -1 })
    .populate("patient personnelSante")
    .populate({
      path: "messages",
      options: { sort: { createdAt: -1 }, limit: 1 },
    });

  res.status(200).json({
    status: "success",
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.getAllMessagesWithUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const conversation = await Conversation.findOne({
    $or: [
      { patient: userId, personnelSante: otherUserId },
      { patient: otherUserId, personnelSante: userId },
    ],
  }).populate("messages.sender");

  if (!conversation) {
    return next(new AppError("No conversation found with that user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      messages: conversation.messages,
    },
  });
});
