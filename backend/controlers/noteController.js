// controllers/noteController.js
import Note from "../models/Note.js";

// tiny async wrapper
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/notes
export const listNotes = asyncHandler(async (req, res) => {
  const { q, tag, pinned } = req.query;
  const query = {};
  if (q) {
    query.$or = [
      { title:   { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }
  if (tag) query.tags = tag;
  if (typeof pinned !== "undefined") query.pinned = pinned === "true";

  const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// POST /api/notes
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ message: "title and content are required" });
  }
  const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
    tags: (tags ?? []).map(t => String(t).trim()).filter(Boolean),
  });
  res.status(201).json(note);
});

// GET /api/notes/:id
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// PATCH /api/notes/:id
export const updateNote = asyncHandler(async (req, res) => {
  const { title, content, tags, pinned } = req.body;
  const updates = {};
  if (typeof title  !== "undefined")  updates.title  = String(title).trim();
  if (typeof content!== "undefined")  updates.content= String(content).trim();
  if (typeof tags   !== "undefined")  updates.tags   = Array.isArray(tags) ? tags.map(t=>String(t).trim()) : [];
  if (typeof pinned !== "undefined")  updates.pinned = Boolean(pinned);

  const note = await Note.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// DELETE /api/notes/:id
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ ok: true });
});

// PATCH /api/notes/:id/toggle-pin
export const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  note.pinned = !note.pinned;
  await note.save();
  res.json(note);
});
