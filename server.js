const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Initialize Socket.IO
const socketIo = require("socket.io");
const io = socketIo(server);
const users = {};

// START SOCKET IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user connects, store their user ID and socket ID
  socket.on("userConnected", (userId) => {
    users[userId] = socket.id;
  });

  // When you want to send a message to a specific user
  socket.on("sendMessage", async (userId, message) => {
    const senderId = socket.handshake.query.userId; // Assuming you pass the userId as a query parameter when connecting
    const socketId = users[userId];

    if (socketId) {
      io.to(socketId).emit("message", message);

      // Save message to the database using the controller function
      await conversationController.storeMessage(senderId, userId, message);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});
// END SOCKET IO
