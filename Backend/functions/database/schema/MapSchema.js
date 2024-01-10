const mongoose = require("mongoose");

const MapSchema_ = new mongoose.Schema({
  mapType: {
    type: String,
    unique: false,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
  },
  avgRate: {
    type: Number,
    required: false,
    default: 0,
  },
  mapFile: {
    type: String,
    required: false,
    unique: false,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  public: {
    type: Number,
    required: true,
    enum: [0, 1],
    default: 0,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  }
});

const MapSchema = mongoose.model("Map", MapSchema_);
module.exports = MapSchema;
