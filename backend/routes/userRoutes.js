import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile, toggleSaveNote } from "../controllers/usersController.js";

const router = Router();

// Get profile details and related notes
router.get("/:id", getUserProfile);

// Toggle save/unsave a note (requires auth)
router.post("/:id/save", protect, toggleSaveNote);

export default router;


