import Note from "../models/Note.js";

// POST /api/notes
export const uploadNote = async (req, res) => {
  try {
    const { title, description, fileUrl, tags } = req.body;

    if (!title?.trim() || !fileUrl?.trim()) {
      return res.status(400).json({ message: "Title and fileUrl are required" });
    }

    const note = await Note.create({
      title,
      description: description || "",
      fileUrl,
      uploadedBy: req.user._id,
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [],
    });

    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/notes?search=...&tag=...&sort=...
export const getAllNotes = async (req, res) => {
  try {
    const { search, tag, sort } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // Search in comments text as well
        { "comments.text": { $regex: search, $options: "i" } },
      ];
    }

    if (tag && String(tag).trim()) {
      filter.tags = { $in: [String(tag).trim()] };
    }

    // Build sort object based on sort parameter
    let sortObj = { createdAt: -1 }; // default: most recent
    if (sort === "likes") {
      sortObj = { likedBy: -1, createdAt: -1 }; // most liked, then recent
    } else if (sort === "comments") {
      sortObj = { "comments": -1, createdAt: -1 }; // most commented, then recent
    } else if (sort === "recent") {
      sortObj = { createdAt: -1 }; // most recent (default)
    }

    const notes = await Note.find(filter)
      .populate("uploadedBy", "name email")
      .sort(sortObj);

    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/notes/user/:userId
export const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ uploadedBy: userId })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/notes/:id/like
// POST /api/notes/:id/like - toggle like for current user
export const likeNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(id).populate("uploadedBy", "name email");
    if (!note) return res.status(404).json({ message: "Note not found" });

    const hasLiked = note.likedBy.some((u) => u.toString() === userId.toString());
    const hasDisliked = note.dislikedBy.some((u) => u.toString() === userId.toString());

    // If disliked already, remove dislike when liking
    if (hasDisliked) {
      note.dislikedBy = note.dislikedBy.filter((u) => u.toString() !== userId.toString());
    }

    if (hasLiked) {
      // toggle off like
      note.likedBy = note.likedBy.filter((u) => u.toString() !== userId.toString());
    } else {
      // add like
      note.likedBy.push(userId);
    }

    await note.save();
    return res.json(note);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/notes/:id/dislike - toggle dislike for current user
export const dislikeNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(id).populate("uploadedBy", "name email");
    if (!note) return res.status(404).json({ message: "Note not found" });

    const hasLiked = note.likedBy.some((u) => u.toString() === userId.toString());
    const hasDisliked = note.dislikedBy.some((u) => u.toString() === userId.toString());

    // If liked already, remove like when disliking
    if (hasLiked) {
      note.likedBy = note.likedBy.filter((u) => u.toString() !== userId.toString());
    }

    if (hasDisliked) {
      // toggle off dislike
      note.dislikedBy = note.dislikedBy.filter((u) => u.toString() !== userId.toString());
    } else {
      // add dislike
      note.dislikedBy.push(userId);
    }

    await note.save();
    return res.json(note);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/notes/:id/comments - add a comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment text required" });
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.comments.push({ user: req.user._id, text: text.trim() });
    await note.save();
    const populated = await Note.findById(id)
      .populate("comments.user", "name email")
      .select("comments");
    return res.status(201).json(populated.comments);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/notes/:id/comments - fetch comments for a note
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id)
      .populate("comments.user", "name email")
      .select("comments");
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json(note.comments);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/notes/:id/delete - delete a note (only by owner)
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the note and check if it exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if the current user is the owner of the note
    if (note.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: "Forbidden: You can only delete your own notes" 
      });
    }

    // Delete the note from MongoDB
    await Note.findByIdAndDelete(id);

    // Return success response - only one response per request
    return res.status(200).json({ 
      message: "Note deleted successfully",
      deletedNoteId: id 
    });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/notes/:id/report - report a note
export const reportNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    // Validate reason is provided
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    // Find the note and check if it exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user has already reported this note
    const hasReported = note.reports.some(report => 
      report.user.toString() === userId.toString()
    );

    if (hasReported) {
      return res.status(400).json({ 
        message: "You have already reported this note" 
      });
    }

    // Add the report to the note
    note.reports.push({
      user: userId,
      reason: reason.trim(),
      createdAt: new Date()
    });

    await note.save();

    // Return success response
    return res.status(201).json({ 
      message: "Note reported successfully",
      reportCount: note.reports.length
    });
  } catch (err) {
    console.error("Report note error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};