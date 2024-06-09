const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

//------------ROUTES----------------
const userRouter = require("./routes/userRouter");
const appointmentRouter = require("./routes/appointmentRouter");
const conversationRouter = require("./routes/conversationRouter");
//------------------------------

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
app.use("/images", express.static(path.join(__dirname, "./images")));

app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
