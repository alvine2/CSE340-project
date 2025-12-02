const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");

// ---------------------
// Route to build management view
// ---------------------
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

// ---------------------
// AJAX: Get Inventory by Classification (GET) - ADDED AS PER INSTRUCTIONS
// ---------------------
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// ---------------------
// Add Classification Form (GET)
// ---------------------
router.get(
  "/add-classification",
  utilities.handleErrors(invController.addClassificationView)
);

// ---------------------
// Process Add Classification (POST)
// ---------------------
router.post(
  "/add-classification",
  classValidate.classificationValidationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// ---------------------
// AJAX: Add Classification (POST)
// ---------------------
router.post(
  "/add-classification-ajax",
  classValidate.classificationValidationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationAJAX)
);

// ---------------------
// AJAX: Get Classifications (GET)
// ---------------------
router.get(
  "/api/classifications",
  utilities.handleErrors(invController.getClassificationsAJAX)
);

// ---------------------
// Add Inventory Form (GET)
// ---------------------
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.addInventoryView)
);

// ---------------------
// Process Add Inventory (POST)
// ---------------------
router.post(
  "/add-inventory",
  invValidate.inventoryValidationRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// ---------------------
// AJAX: Add Inventory (POST)
// ---------------------
router.post(
  "/add-inventory-ajax",
  invValidate.inventoryValidationRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryAJAX)
);

router.get("/debug-flash", utilities.handleErrors(invController.debugFlash));
router.get("/test-flash", utilities.handleErrors(invController.testFlash));

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildVehicleDetail)
);
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update",
  invValidate.inventoryValidationRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);


router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteConfirmation)
);

router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;  