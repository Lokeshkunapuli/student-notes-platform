import User from "../models/User.js";
import Note from "../models/Note.js";

// GET /api/admin/users - list all users (basic info)
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email isAdmin isBlocked createdAt");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/admin/notes - list all notes
export const listNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/admin/users/:id/block - toggle block
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.json({ id: user._id, isBlocked: user.isBlocked });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/admin/notes/:id - delete a note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json({ deleted: true, id });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/admin/reports - get all reported notes with report details
export const getReportedNotes = async (req, res) => {
  try {
    // Find all notes that have reports
    const reportedNotes = await Note.find({ 
      reports: { $exists: true, $not: { $size: 0 } } 
    })
      .populate("uploadedBy", "name email")
      .populate("reports.user", "name email")
      .sort({ createdAt: -1 });

    // Format the response to include report details
    const formattedNotes = reportedNotes.map(note => ({
      _id: note._id,
      title: note.title,
      description: note.description,
      fileUrl: note.fileUrl,
      uploadedBy: note.uploadedBy,
      createdAt: note.createdAt,
      reportCount: note.reports.length,
      reports: note.reports.map(report => ({
        _id: report._id,
        user: report.user,
        reason: report.reason,
        createdAt: report.createdAt
      }))
    }));

    return res.json(formattedNotes);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


