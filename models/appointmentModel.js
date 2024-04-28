const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { start } = require("repl");
const User = require("./userModel");
const appointmentSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: [true, "Veuillez fournir la date de début !"],
  },
  serviceName: String,
  endDate: {
    type: Date,
    required: [true, "Veuillez fournir la date de fin !"],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Veuillez fournir le patient !"],
  },
  personnelSante: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Veuillez fournir la sage femme !"],
  },
  status: {
    type: String,
    enum: ["En attente", "Accepté", "Refusé", "Annulé"],
    default: "En attente",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

appointmentSchema.pre(/^find/, function (next) {
  this.populate(
    "patient",
    "-password -passwordResetCode -passwordResetExpires -accountStatus -activeAccountToken -activeAccountTokenExpires",
  ).populate(
    "personnelSante",
    "-password -passwordResetCode -passwordResetExpires -accountStatus -activeAccountToken -activeAccountTokenExpires",
  );
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
