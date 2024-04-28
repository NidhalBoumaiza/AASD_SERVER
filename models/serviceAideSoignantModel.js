const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const serviceAideSoignantSchema = mongoose.Schema({
  serviceName: String,
});

const serviceAideSoignant = mongoose.model(
  "serviceAideSoignant",
  serviceAideSoignantSchema,
);

module.exports = serviceAideSoignant;
