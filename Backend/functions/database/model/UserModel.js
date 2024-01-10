const mongodb = require("mongodb");
const UserSchema = require("../schema/User.js");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

class UserModel {
  static async findAll() {
    const users = await UserSchema.find(
      {},
      "_id username avatar email isActive userType"
    ).exec();
    return users;
  }

  static async findByEmail(email) {
    return await UserSchema.findOne({ email: email }).exec();
  }

  static async findByID(id) {
    return await UserSchema.findOne({ _id: id });
  }

  static async createUser(email, username, password, avatar) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserSchema({
      email,
      username,
      password: hashedPassword,
      avatar,
    });
    await newUser.save();
    const userId = newUser._id.toString();

    // Creating a new object with the desired structure
    const user = {
      userId: userId,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar,
      isActive: newUser.isActive,
      mapList: newUser.mapList || [],
      userType: newUser.userType,
      isVerified: newUser.isVerified,
    };

    return user;
  }

  static async updateProfile(userId, updatedData) {
    try {
      const updatedUser = await UserSchema.findOneAndUpdate(
        { _id: new mongodb.ObjectId(userId) },
        updatedData
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user by ID:", error);
      throw new Error(error.message);
    }
  }

  static async verifyCode(userId, code) {
    const user = await findById(userId);
    if (!user) throw new Error("User not found");

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null; // Clear the verification code
      await user.save();
      return true;
    }
    return false;
  }

  static async verifyResetPasswordCode(email, code) {
    const user = await this.findByEmail(email);
    if (!user) throw new Error("User not found");

    const now = new Date();

    if (
      user.passwordResetExpires &&
      now <= new Date(user.passwordResetExpires)
    ) {
      if (user.passwordResetToken === code) {
        // after verifying reset code, give user 15 minutes for updating his/her password
        now.setMinutes(now.getMinutes() + 15);
        user.passwordResetExpires = now;
        await user.save();
        return true;
      } else {
        throw new Error("Invalid reset code");
      }
      return true;
    } else {
      throw new Error("Reset Password Code has expired");
    }
    return false;
  }

  static async updatePasswordByCode(email, code, newPassword) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      const now = new Date();
      if (
        user.passwordResetToken === code &&
        user.passwordResetExpires &&
        now <= new Date(user.passwordResetExpires)
      ) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        console.log("error here1: ");
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        console.log("error here2: ");

        await user.save();
        return true;
      } else if (now > new Date(user.passwordResetExpires)) {
        throw new Error("Reset Password Code has expired");
      } else {
        throw new Error("Invalid reset code");
      }
    } catch (error) {
      console.error("Error in updatePasswordByCode:", error);
      throw error;
    }
  }

  static async updateActivationStatus(userId, isActive) {
    return await findByIdAndUpdate(userId, { isActive }, { new: true });
  }

  static async deleteUserById(userId) {
    return await UserSchema.findByIdAndDelete(userId);
  }

  static async recoverPasswordByEmail(email) {
    try {
      const user = await UserSchema.findOne({ email: email }).exec();
      if (!user) {
        throw new Error("User not found");
      }

      const token = crypto.randomBytes(5).toString("hex");

      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15);

      user.passwordResetToken = token;
      user.passwordResetExpires = expirationTime;
      await user.save();

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>Your password reset code: <b>${token}</b></p>
             <p>Please use this code to reset your password.</p>`,
      };

      const info = transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // console.log("error in transporter: ", error);
          throw error;
        } else {
          // console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.error("Error in recoverPasswordByEmail:", error);
      throw error;
    }
  }
}

module.exports = UserModel;
