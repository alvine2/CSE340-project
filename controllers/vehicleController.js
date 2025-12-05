const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

exports.getVehicleDetail = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) return res.status(404).render('404');
    res.render('vehicles/detail', { vehicle, user: req.user, messages: req.flash() });
  } catch (err) { next(err); }
};

exports.uploadVehicleImage = async (req, res, next) => {
  try {
    // server side validation for other fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(e=>e.msg).join(', '));
      return res.redirect('back');
    }

    // multer saved file in req.file
    if (!req.file) {
      req.flash('error', 'No file uploaded');
      return res.redirect('back');
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('error', 'Vehicle not found');
      return res.redirect('back');
    }

    // only allow manager/admin via route middleware (see routes)
    await vehicle.addImage({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      userId: req.user._id
    });

    req.flash('success', 'Image uploaded');
    res.redirect(`/vehicles/${vehicle._id}`);
  } catch (err) { next(err); }
};

exports.deleteVehicleImage = async (req, res, next) => {
  try {
    const { vehicleId, imageId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      req.flash('error', 'Vehicle not found');
      return res.redirect('back');
    }

    // optional: check uploadedBy or role
    vehicle.deleteImageById(imageId);
    await vehicle.save();

    req.flash('success', 'Image deleted');
    res.redirect(`/vehicles/${vehicleId}`);
  } catch (err) { next(err); }
};

exports.getGalleryJson = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).select('images').lean();
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    // send image metadata and base64 content to allow browser display
    const images = vehicle.images.map(img => ({
      _id: img._id,
      filename: img.filename,
      contentType: img.contentType,
      createdAt: img.createdAt,
      // convert binary to base64 for immediate display
      data: img.data ? `data:${img.contentType};base64,${img.data.toString('base64')}` : null
    }));
    res.json({ images });
  } catch (err) { next(err); }
};
