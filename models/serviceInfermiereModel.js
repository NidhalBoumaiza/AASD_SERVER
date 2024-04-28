const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const serviceInfirmiereSchema = mongoose.Schema({
  serviceName: String,
});

const serviceInfirmiere = mongoose.model(
  "serviceInfirmiere",
  serviceInfirmiereSchema,
);

module.exports = serviceInfirmiere;
