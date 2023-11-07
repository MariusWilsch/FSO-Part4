const config = require("./utils/config");
const express = require("express");
const app = express();
const { info, error } = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

info("Connecting too MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => info("connceted to MongoDB"))
  .catch((err) => error("Error while connecting to MongoDB", err.message));

module.exports = app;
