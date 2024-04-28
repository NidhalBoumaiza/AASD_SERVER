const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const serviceSageFemmeSchema = mongoose.Schema({
  serviceName: String,
});

const serviceSageFemme = mongoose.model(
  "serviceSageFemme",
  serviceSageFemmeSchema,
);

module.exports = serviceSageFemme;
