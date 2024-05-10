const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authController = require("../controllers/authController");
router
  .route("/getAvailablePersonnelSanteInMyzone")
  .post(
    authController.protect,
    appointmentController.getAvailablePersonnelSanteInMyzone,
  );
router
  .route("/createAppointment")
  .post(authController.protect, appointmentController.createAppointment);

router
  .route("/getMyAppointments")
  .get(authController.protect, appointmentController.getMyAppointmentsPatient);

router
  .route("/cancelMyAppointmentPatient/:id")
  .patch(
    authController.protect,
    appointmentController.cancelMyAppointmentPatient,
  );

router
  .route("/ratePersonnelSante")
  .patch(authController.protect, appointmentController.ratePersonnelSante);

//---------------- PERSONNEL SANTE --------------------------
router
  .route("/getMyAppointmentsPersonnelSante")
  .get(
    authController.protect,
    appointmentController.getMyAppointmentsPersonnelSante,
  );
router
  .route("/acceptAppointment/:id")
  .patch(
    authController.protect,
    appointmentController.acceptAppointmentPersonnelSante,
  );

router
  .route("/refuseAppointmentPersonnelSante/:id")
  .patch(
    authController.protect,
    appointmentController.refuseAppointmentPersonnelSante,
  );

module.exports = router;
