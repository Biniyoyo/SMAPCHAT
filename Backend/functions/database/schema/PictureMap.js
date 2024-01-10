const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
  },
  Images: {
    type: [String],
    required: false,
  },
});

const LocationSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
  },
  Library: {
    type: [LibrarySchema],
    required: false,
  },
  Longitude: {
    type: String,
    required: false,
  },
  Lattitude: {
    type: String,
    required: false,
  },
});

const PictureSchema = new mongoose.Schema({
  MapID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  Location: {
    type: [LocationSchema],
    required: false,
  },
});

const PictureMapSchema = mongoose.model("PictureMap", PictureSchema);
module.exports = PictureMapSchema;
