import User from "../models/User.js";
import Note from "../models/Note.js";

// GET /api/users/:id
// Returns user basic info, uploaded notes, liked notes, disliked notes, and saved notes
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Uploaded notes by the user
    const uploadedNotes = await Note.find({ uploadedBy: id })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    // Liked notes by the user
    const likedNotes = await Note.find({ likedBy: id })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    // Disliked notes by the user
    const dislikedNotes = await Note.find({ dislikedBy: id })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    // Saved notes (favorites)
    const savedNotes = await Note.find({ _id: { $in: user.savedNotes || [] } })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
        createdAt: user.createdAt,
      },
      uploadedNotes,
      likedNotes,
      dislikedNotes,
      savedNotes,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/users/:id/save
// Toggle save/unsave a note for the authenticated user
export const toggleSaveNote = async (req, res) => {
  try {
    const { id } = req.params; // user id from URL
    const { noteId } = req.body;

    // Only allow a user to modify their own savedNotes, unless admin logic added
    if (req.user._id.toString() !== id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = (user.savedNotes || []).some((n) => n.toString() === noteId);
    if (exists) {
      user.savedNotes = user.savedNotes.filter((n) => n.toString() !== noteId);
    } else {
      user.savedNotes.push(noteId);
    }
    await user.save();

    const savedNotes = await Note.find({ _id: { $in: user.savedNotes } })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({ savedNotes, savedNoteIds: user.savedNotes });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


