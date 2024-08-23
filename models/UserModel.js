import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["M", "F", "O"],
  },
  role: {
    type: String,
    enum: ["viewer", "admin", "user"],
    default: "viewer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Middleware to hash password before saving
// UserSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
