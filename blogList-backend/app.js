const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogListRoutes");
const middlware = require("./utils/middleware");
const { info, error } = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

info("Connecting too MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => info("connceted to MongoDB"))
  .catch((err) => error("Error while connecting to MongoDB", err.message));

app.use(cors());
app.use(express.json());
app.use(middlware.requestLogger);

app.use("/api/blogs", blogRouter);

app.use(middlware.unknownEndpoint);
app.use(middlware.errorHandler);

module.exports = app;
