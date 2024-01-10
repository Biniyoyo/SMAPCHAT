const mongoose = require("mongoose");

const RatingSchema_ = new mongoose.Schema({
  mapID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    unique: false,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    unique: false,
  },
  rate: {
    type: Number,
    required: false,
    unique: false,
    dafalt: 0,
  },
});

const RatingSchema = mongoose.model("Rating", RatingSchema_);
module.exports = RatingSchema;
