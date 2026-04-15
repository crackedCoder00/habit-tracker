import { Router } from "express";
import Note from "../models/Note.js";

const router = Router();

// GET /api/notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /api/notes
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text is required" });
    }

    const note = await Note.create({
      userId: req.userId,
      text: text.trim(),
    });

    res.status(201).json(note);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: message });
    }
    res.status(500).json({ error: "Failed to create note" });
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
