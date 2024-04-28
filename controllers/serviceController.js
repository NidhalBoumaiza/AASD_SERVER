const ServiceKine = require("../models/serviceKineModel");
const ServiceInfermiere = require("../models/serviceInfermiereModel");
const ServiceSageFemme = require("../models/serviceSageFemmeModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const ServiceAideSoignante = require("../models/serviceAideSoignantModel");
exports.getAllServicesKine = catchAsync(async (req, res, next) => {
  const services = await ServiceKine.find();
  res.status(200).json({
    status: "Success",
    services,
  });
});

exports.createServiceKine = catchAsync(async (req, res, next) => {
  const newService = await ServiceKine.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      newService,
    },
  });
});

exports.createServiceInfermiere = catchAsync(async (req, res, next) => {
  const newService = await ServiceInfermiere.create(req.body);
  res.status(201).json({
    status: "Success",

    newService,
  });
});

exports.getAllServicesInfermiere = catchAsync(async (req, res, next) => {
  const services = await ServiceInfermiere.find();
  res.status(200).json({
    status: "Success",
    services,
  });
});

exports.createServiceSageFemme = catchAsync(async (req, res, next) => {
  const newService = await ServiceSageFemme.create(req.body);
  res.status(201).json({
    status: "Success",
    newService,
  });
});

exports.getAllServicesSageFemme = catchAsync(async (req, res, next) => {
  const services = await ServiceSageFemme.find();
  res.status(200).json({
    status: "Success",
    services,
  });
});

exports.createServiceAideSoignante = catchAsync(async (req, res, next) => {
  const newService = await ServiceAideSoignante.create(req.body);
  res.status(201).json({
    status: "Success",
    newService,
  });
});

exports.getAllServicesAideSoignante = catchAsync(async (req, res, next) => {
  const services = await ServiceAideSoignante.find();
  res.status(200).json({
    status: "Success",
    services,
  });
});
