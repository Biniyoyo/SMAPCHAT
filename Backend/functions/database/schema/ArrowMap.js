const mongoose = require("mongoose");
const ArrowMapLocationSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
    unique: false,
  },
  Longitude: {
    type: Number,
    required: false,
    unique: false,
  },
  Lattitude: {
    type: Number,
    required: false,
    unique: false,
  },
  Order: {
    type: Number,
    required: false,
    unique: false,
  },
  Date: {
    type: Date,
    required: false,
    unique: false,
    default: Date.now,
  },
});

const ArrowMapSchema_ = new mongoose.Schema({
  MapID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  Maxpin: {
    type: Number,
    required: false,
    unique: false,
  },
  Location: {
    type: [ArrowMapLocationSchema],
    required: false,
    unique: false,
  },
});

const ArrowMapSchema = mongoose.model("ArrowMap", ArrowMapSchema_);
module.exports = ArrowMapSchema;
