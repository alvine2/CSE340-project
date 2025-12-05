const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
  filename: { type: String, required: true },
  data: { type: Buffer }, // either store binary...
  contentType: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const VehicleSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  // other fields...
  images: [ImageSchema]
});

VehicleSchema.methods.addImage = async function({ filename, data, contentType, userId }) {
  this.images.push({ filename, data, contentType, uploadedBy: userId });
  return this.save();
};

VehicleSchema.methods.deleteImageById = async function(imageId) {
  this.images.id(imageId).remove();
  return this.save();
};

module.exports = mongoose.model('Vehicle', VehicleSchema);
