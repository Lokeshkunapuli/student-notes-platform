import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadNote,
  getAllNotes,
  getNotesByUser,
  likeNote,
  dislikeNote,
  addComment,
  getComments,
  deleteNote,
  reportNote,
} from "../controllers/notesController.js";

const router = Router();

// Public: Get all notes (with optional search)
router.get("/", getAllNotes);

// Public: Get notes by a specific user
router.get("/user/:userId", getNotesByUser);

// Protected: Upload a new note
router.post("/", protect, uploadNote);

// Protected: Like a note (simple increment)
router.post("/:id/like", protect, likeNote);

// Protected: Dislike a note (toggle)
router.post("/:id/dislike", protect, dislikeNote);

// Comments
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);

// Protected: Report a note
router.post("/:id/report", protect, reportNote);

// Protected: Delete a note (only by owner)
router.delete("/:id/delete", protect, deleteNote);
// Alternative simpler route for delete
router.delete("/:id", protect, deleteNote);

export default router;