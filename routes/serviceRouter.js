const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router
  .route("/getInfirmiereService")
  .get(serviceController.getAllServicesInfermiere);

router.route("/getKineService").get(serviceController.getAllServicesKine);

router
  .route("/getSageFemmeService")
  .get(serviceController.getAllServicesSageFemme);

router
  .route("/createServiceInfermiere")
  .post(serviceController.createServiceInfermiere);
router.route("/createServiceKine").post(serviceController.createServiceKine);
router
  .route("/createServiceSageFemme")
  .post(serviceController.createServiceSageFemme);

router
  .route("/createServiceAideSoignante")
  .post(serviceController.createServiceAideSoignante);
module.exports = router;
