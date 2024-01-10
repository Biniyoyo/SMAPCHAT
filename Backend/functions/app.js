const cors = require("cors");
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://smapchat-bc4cd.web.app",
    "http://10.1.181.129:3000",
    "http://127.0.0.1:3000",
  ],
};
const express = require("express");
const cookieParser = require("cookie-parser");
const startDB = require("./database/database.js");
const stopDB = require("./database/database.js");

const indexRouter = require("./routes/index.js");
const userRoutes = require("./routes/userRoutes.js");
const mapRoutes = require("./routes/mapRoutes.js");
const ratingRoutes = require("./routes/ratingRoutes.js");
const logMiddleware = require("./middleware/logger.js");
const commentRoutes = require("./routes/commentRoutes");

const dotenv = require("dotenv");
const admin = require("firebase-admin");
const credentials = require("./smapchat-back-firebase-adminsdk-mqj8a-926a2ec96b.json");
const { default: mongoose } = require("mongoose");

// read .env file to generate environment variables,
// this will need to be disabled for production deployment
// where env vars are set to appropriate values elsewhere
dotenv.config();

startDB();

var app = express();

// app.use(cors(corsOptions));
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "https://smapchat-bc4cd.web.app"],
    credentials: true,
  })
);

admin.initializeApp({ credential: admin.credential.cert(credentials) });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", mapRoutes);
app.use("/", indexRouter);
app.use("/", userRoutes);
app.use("/", ratingRoutes);
app.use("/", commentRoutes);

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  next();
});

process.on("SIGTERM", () => {
  mongoose.disconnect();
});

process.on("SIGINT", () => {
  mongoose.disconnect();
});

module.exports = app;
