const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const upload = require('../middleware/upload');
const { body } = require('express-validator');
const { requireRole } = require('../middleware/auth'); // implement role check middleware

router.get('/:id', vehicleController.getVehicleDetail);

// fetch gallery JSON (used by client-side)
router.get('/:id/gallery/json', vehicleController.getGalleryJson);

// upload — only manager or admin
router.post(
  '/:id/gallery/upload',
  requireRole(['manager','admin']),
  upload.single('image'),
  body('image').custom((value, { req }) => {
    if (!req.file) throw new Error('Image is required');
    return true;
  }),
  vehicleController.uploadVehicleImage
);

// delete — only admin or manager
router.post('/:vehicleId/gallery/:imageId/delete', requireRole(['manager','admin']), vehicleController.deleteVehicleImage);

module.exports = router;
