const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
//------------ROUTES----------------
const userRouter = require("./routes/userRouter");
const serviceRouter = require("./routes/serviceRouter");
const appointmentRouter = require("./routes/appointmentRouter");
//------------------------------
const server = http.createServer(app);
const io = socketIo(server);
const users = {};

io.on("connection", (socket) => {
  // When a user connects, store their user ID and socket ID
  socket.on("userConnected", (userId) => {
    users[userId] = socket.id;
  });

  // When you want to send a message to a specific user
  socket.on("sendMessage", (userId, message) => {
    const socketId = users[userId];
    if (socketId) {
      io.to(socketId).emit("message", message);
    }
  });
});

app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1) MIDDLEWARES
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP , please try again in an hour !",
});
app.use("/api", limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = server;

/*const io = require('socket.io')(server);
const users = {};

io.on('connection', (socket) => {
  // When a user connects, store their user ID and socket ID
  socket.on('userConnected', (userId) => {
    users[userId] = socket.id;
  });

  // When you want to send a message to a specific user
  socket.on('sendMessage', (userId, message) => {
    const socketId = users[userId];
    if (socketId) {
      io.to(socketId).emit('message', message);
    }
  });
});*/
