// routes/noteRoutes.js
import { Router } from "express";
import {
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
  togglePin,
} from "../controlers/noteController.js";

const router = Router();

router.get("/", listNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/toggle-pin", togglePin);

export default router;
