import { Router } from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { listUsers, listNotes, toggleBlockUser, deleteNote, getReportedNotes } from "../controllers/adminController.js";

const router = Router();

// Admin routes are protected and require isAdmin
router.get("/users", protect, isAdmin, listUsers);
router.get("/notes", protect, isAdmin, listNotes);
router.get("/reports", protect, isAdmin, getReportedNotes);
router.patch("/users/:id/block", protect, isAdmin, toggleBlockUser);
router.delete("/notes/:id", protect, isAdmin, deleteNote);

export default router;


