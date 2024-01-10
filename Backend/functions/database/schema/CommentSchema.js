const mongoose = require("mongoose");

const CommentSchema_ = new mongoose.Schema({
  commenterId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: false,
  },
  mapID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  commenterUsername: {
    type: String,
    required: true,
  },
  commenterAvatar: {
    type: String,
    required: false,
  },
  likes: {
    type: [mongoose.Schema.ObjectId],
    default: [],
  },
  disLikes: {
    type: [mongoose.Schema.ObjectId],
    default: [],
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
  },
});

const CommentSchema = mongoose.model("Comment", CommentSchema_);
module.exports = CommentSchema;
