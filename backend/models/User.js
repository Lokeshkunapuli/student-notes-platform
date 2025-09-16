import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // hashed
    // Optional avatar URL (e.g., Cloudinary URL)
    avatarUrl: { type: String, default: "" },
    // Saved notes (favorites) for the user
    savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    // Admin flag: only admins can access admin routes
    isAdmin: { type: Boolean, default: false },
    // Block flag: blocked users might be restricted by app logic if needed
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;