const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const serviceKineSchema = mongoose.Schema({
  serviceName: String,
});

const serviceKine = mongoose.model("serviceKine", serviceKineSchema);

module.exports = serviceKine;
