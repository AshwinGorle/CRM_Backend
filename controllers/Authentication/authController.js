import UserModel from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import { type } from "os";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";

class AuthController {
  static homeFunction = (req, res) => {
    return res.status(200).send("Shree Ganesh");
  };

  static verifyAutoGeneratedPassword = async (userId) => {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isVerified: true,
    });
  };

  static getUserByToken = async (token) => {
    try {
      const tokenData = jwt.verify(token, process.env.SECRET_KEY);
      const user = await UserModel.findById(tokenData.userId).select(
        "-password"
      );
      return user;
    } catch (err) {
      console.error("getUserByToken error:", err);
      return null;
    }
  };

  static signup = async (req, res, sendPassword = false) => {
    console.log("request body ", req.body);
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      password_confirmation,
      gender,
      role = "viewer",
      city = "N/A",
      state = "N/A",
      country = "N/A",
    } = req.body;

    if (password !== password_confirmation) {
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !password ||
      !gender ||
      !role
    ) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ status: "failed", message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const otp = crypto.randomInt(100000, 999999); // Generate OTP
      
      const address = {
        city,
        state,
        country
      }

      const newUser = new UserModel({
        firstName,
        lastName,
        phone,
        email,
        address,
        gender,
        role,
        password: hashedPassword,
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
      });
      if (req.file) {
        console.log("file ", req.file);
        newUser.avatar = await uploadAndGetAvatarUrl(
          req.file,
          "user",
          newUser._id,
          "stream"
        );
      }
      await newUser.save();
      // Send OTP to user email
      if (sendPassword) {
        await sendEmail({
          to: email,
          subject: "OTP for Account Verification",
          html: `<p>Your password for CRM is <b>${password}</b> for email <b>${email}</b> . Please verify and change your password</p>`,
        });
        return res.status(201).json({
          status: "success",
          message: `User created. Please verify the user.`,
          verified: false,
        });
      } else {
        await sendEmail({
          to: email,
          subject: "OTP for Account Verification",
          html: `<p>Your OTP for account verification is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
        });
        return res.status(201).json({
          status: "success",
          message: `User created. Please verify your email with the OTP sent.`,
          verified: false,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      res
        .status(500)
        .json({ status: "failed", message: "User not created", error: err });
    }
  };

  static verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user || user.otp != otp || user.otpExpiresAt < Date.now()) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid or expired OTP" });
      }

      user.otp = null;
      user.otpExpiresAt = null;
      user.isVerified = true;
      await user.save();

      const token = jwt.sign(
        { userId: user._id, userEmail: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "10d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite : 'None',
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });

      res.status(200).json({
        status: "success",
        message: "Email verified and login successful",
        data: user,
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      if (!user.isVerified) {
        console.log("password to verify : ", password)
        if (password.startsWith("AXRC")) {
          console.log("entered verified")
          await this.verifyAutoGeneratedPassword(user._id);
        } else {
          return res.status(400).json({
            status: "failed",
            message: "Please verify your email first",
            verified: false,
          });
        }
      }

      const token = jwt.sign(
        { userId: user._id, userEmail: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "10d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "None",
        sameSite: process.env.NODE_ENV === "local" ?  "Lax" : "None",
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: user,
        verified: true,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };

  static logout = (req, res) => {
    res.cookie("token", "", { maxAge: 1 , sameSite : "None"});
    res.status(200).json({ status: "success", message: "Logout successful" });
  };

  static sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email is required" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email does not exist" });
      }

      const otp = crypto.randomInt(100000, 999999); // Generate OTP
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      await user.save();

      await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
      });

      res.status(200).json({
        status: "success",
        message: "OTP sent successfully to your email.",
      });
    } catch (err) {
      console.error("Send reset password email error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };

  static resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email is required" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: "failed", message: "User not found" });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email is already verified" });
      }

      const otp = crypto.randomInt(100000, 999999); // Generate a new OTP
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      await user.save();

      // Resend OTP to user's email
      await sendEmail({
        to: email,
        subject: "Resend OTP for Account Verification",
        html: `<p>Your OTP for account verification is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
      });

      res.status(200).json({
        status: "success",
        message: "OTP resent successfully. Please check your email.",
      });
    } catch (err) {
      console.error("Resend OTP error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };

  static resetPasswordWithOtp = async (req, res) => {
    const { email, otp, newPassword, newPasswordConfirmation } = req.body;

    if (newPassword !== newPasswordConfirmation) {
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user || user.otp != otp || user.otpExpiresAt < Date.now()) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid or expired OTP" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      res
        .status(200)
        .json({ status: "success", message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password with OTP error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };

  static changePassword = async (req, res) => {
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    if (newPassword !== newPasswordConfirmation) {
      return res
        .status(400)
        .json({ status: "failed", message: "Passwords do not match" });
    }

    try {
      const user = req.user;
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ status: "failed", message: "Incorrect current password" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      res
        .status(200)
        .json({ status: "success", message: "Password changed successfully" });
    } catch (err) {
      console.error("Change password error:", err);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong. Try again.",
        error: err,
      });
    }
  };
}

export default AuthController;
