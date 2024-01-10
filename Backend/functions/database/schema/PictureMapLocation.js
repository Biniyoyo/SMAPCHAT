const mongoose = require("mongoose");

const PictureMapLocationSchema = new mongoose.Schema({
  locationId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    unique: false,
  },
  longtude: {
    type: mongoose.Schema.Types.Decimal,
    required: false,
    unique: false,
  },
  lattitude: {
    type: mongoose.Schema.Types.Decimal,
    required: false,
    unique: false,
  },
  libraryIDs: {
    type: [Number],
    required: false,
    unique: false,
  },
});

const PictureMapLocationModel = mongoose.model(
  "PictureMapLocation",
  PictureMapLocationSchema
);
module.exports = PictureMapLocationModel;
