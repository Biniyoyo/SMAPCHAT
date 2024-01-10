const mongoose = require("mongoose");

const UserSchema_ = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: false,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  avatar: {
    type: String,
    required: false,
    unique: false,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  mapList: {
    type: [Number], // This assumes that mapList is an array of numbers.
    required: false,
    unique: false,
  },
  userType: {
    type: Number,
    required: true,
    enum: [0, 1],
    default: 0,
  },
  // email authentication
  verificationCode: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
  },
});

const UserSchema = mongoose.model("User", UserSchema_);
module.exports = UserSchema;
