const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
  },
  Longitude: {
    type: Number,
    required: false,
  },
  Lattitude: {
    type: Number,
    required: false,
  },
  Value: {
    type: Number,
    required: false,
  },
});

const ScaleMapSchema = new mongoose.Schema({
  MapID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  MinColor: {
    type: String,
    required: true,
  },
  MaxColor: {
    type: String,
    required: true,
  },
  Location: {
    type: [LocationSchema],
    required: false,
  },
});

const ScaleMapModel = mongoose.model("ScaleMap", ScaleMapSchema);
module.exports = ScaleMapModel;
