const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const { findById, findByIdAndUpdate } = require("../models/userModel");

const filtredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//----------------------------disable my account ----------------------------------
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const filteredBody = filtredObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "numTel",
    "dob",
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.disableMyAccount = catchAsync(async (req, res, next) => {
  req.user.accountStatus = false;
  await req.user.save({ validateBeforeSave: false });
  console.log(req.user);
  res.status(201).json({
    status: "Success",
    message: "votre compte est maintenant désactiver",
  });
});

exports.updateMyLocation = catchAsync(async (req, res, next) => {
  req.user.location = {
    type: "Point",
    coordinates: req.body.location.coordinates,
  };
  await req.user.save({ validateBeforeSave: false });

  console.log(req.user);
  res.status(201).json({
    status: "Success",
  });
});

exports.updateMyWorkingTime = catchAsync(async (req, res, next) => {
  req.user.workingTime = req.body.workingTime;
  await req.user.save({ validateBeforeSave: false });
  console.log(req.user);
  res.status(201).json({
    status: "Success",
  });
});
