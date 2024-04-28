const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Appointment = require("../models/appointmentModel");
const mongoose = require("mongoose");

//----------------- PATIENT --------------------------

exports.getAvailablePersonnelSanteInMyzone = catchAsync(
  async (req, res, next) => {
    const userLocation = [
      req.user.location.coordinates[0],
      req.user.location.coordinates[1],
    ];
    const maxDistance = req.body.distance || 5000;
    if (!req.body.startDate || isNaN(Date.parse(req.body.startDate))) {
      return next(new AppError("Invalid startDate format", 400));
    }
    const startDate = new Date(req.body.startDate);
    if (!req.body.endDate || isNaN(Date.parse(req.body.endDate))) {
      return next(new AppError("Invalid endDate format", 400));
    }
    const endDate = new Date(req.body.endDate);

    if (startDate < Date.now() || endDate < Date.now()) {
      return next(new AppError("Veuillez fournir une date valide", 400));
    }

    // Find all appointments that overlap with the requested time range
    const overlappingAppointments = await Appointment.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    console.log(overlappingAppointments);

    // Get the IDs of these appointments
    const overlappingAppointmentIds = overlappingAppointments.map(
      (appointment) => appointment._id,
    );

    let query = {
      role: req.body.role,
      accountStatus: true,
      appointments: {
        $not: { $elemMatch: { $in: overlappingAppointmentIds } },
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userLocation,
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (req.body.gender) {
      query.gender = req.body.gender;
    }

    const personnelSante = await User.find(query);

    if (personnelSante.length === 0) {
      return next(new AppError("Aucun personnel de santé trouvé", 400));
    }

    res.status(200).json({
      status: "success",
      results: personnelSante.length,
      personnelSante,
    });
  },
);

exports.createAppointment = catchAsync(async (req, res, next) => {
  const { startDate, endDate, serviceName, personnelSante } = req.body;

  // Create a new appointment
  const newAppointment = await Appointment.create({
    startDate,
    endDate,
    serviceName,
    personnelSante,
    patient: req.user.id, // Assuming the patient is the current user
  });

  // Send the new appointment in the response
  res.status(201).json({
    status: "success",
    message: "Rendez-vous créé avec succès",
    appointment: newAppointment,
  });
});

exports.getMyAppointmentsPatient = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ patient: req.user.id });
  if (appointments.length === 0) {
    return next(new AppError("Aucun rendez-vous trouvé", 400));
  }
  res.status(200).json({
    status: "success",
    results: appointments.length,
    appointments,
  });
});

exports.cancelMyAppointmentPatient = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id, {
    status: "En attente",
  });

  if (!appointment) {
    return next(new AppError("Aucun rendez-vous trouvé avec cet ID", 404));
  }
  appointment.status = "Annulé";
  await appointment.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
    message: "Le rendez-vous a été annulée avec succés",
    appointment,
  });
});

exports.ratePersonnelSante = catchAsync(async (req, res, next) => {
  const personnelSante = await User.findById(req.body.personnelSante);
  if (!personnelSante) {
    return next(new AppError("Personnel de santé non trouvé", 404));
  }
  const appointment = await Appointment.findOne({
    status: "Accepté",
    _id: req.body.appointmentId,
    personnelSante: personnelSante._id,
  });
  if (!appointment) {
    return next(new AppError("Rendez-vous non trouvé", 404));
  }
  if (Date.now() < new Date(appointment.endDate)) {
    return next(
      new AppError("Vous ne pouvez pas évaluer un rendez-vous en cours", 400),
    );
  }
  personnelSante.rating.push(req.body.rating);
  await personnelSante.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Merci pour votre évaluation",
  });
});

//------------------ Personnel Sante ------------------------------------
exports.getMyAppointmentsPersonnelSante = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ personnelSante: req.user.id });
  if (appointments.length === 0) {
    return next(new AppError("Aucun rendez-vous trouvé", 400));
  }
  res.status(200).json({
    status: "success",
    results: appointments.length,

    appointments,
  });
});

exports.getMyAppointmentsPersonnelSanteOfSpecifiedDay = catchAsync(
  async (req, res, next) => {
    const appointments = await Appointment.find({
      personnelSante: req.user.id,
      date: req.body.date,
    });
    if (appointments.length === 0) {
      return next(new AppError("Aucun rendez-vous trouvé", 400));
    }
    res.status(200).json({
      status: "success",
      results: appointments.length,
      appointments,
    });
  },
);

exports.acceptAppointmentPersonnelSante = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id, {
    status: "En attente",
  });

  if (!appointment) {
    return next(new AppError("Aucun rendez-vous trouvé avec cet ID", 404));
  }
  appointment.status = "Accepté";
  await appointment.save({ validateBeforeSave: false });

  req.user.appointments.push(appointment._id);
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Le rendez-vous a été accepté avec succès !",
    appointment,
  });
});

exports.refuseAppointmentPersonnelSante = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id, {
    status: "En attente",
  });

  if (!appointment) {
    return next(new AppError("Aucun rendez-vous trouvé avec cet ID", 404));
  }
  appointment.status = "Refusé";
  await appointment.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Le rendez-vous a été réfusé avec succès !",
    appointment,
  });
});
