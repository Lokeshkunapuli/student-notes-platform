import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, required: true }, // Can be a Cloudinary or external URL
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Tags/subjects for filtering (e.g., Math, Physics, CSE)
    tags: [{ type: String, trim: true }],
    // Store user IDs who liked the note
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Store user IDs who disliked the note
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Comments array: each comment has user ref, text, and timestamp
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Reports array: each report has user ref, reason, and timestamp
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;