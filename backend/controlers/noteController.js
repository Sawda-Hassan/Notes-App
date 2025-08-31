// controllers/noteController.js
import Note from "../models/Note.js";
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// LIST
export const listNotes = asyncHandler(async (req, res) => {
  const { q, tag, pinned } = req.query;
  const query = { user: req.user.id };
  if (q) query.$or = [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }];
  if (tag) query.tags = tag;
  if (typeof pinned !== "undefined") query.pinned = pinned === "true";
  const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// CREATE
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ message: "title & content required" });
  const note = await Note.create({ user: req.user.id, title: title.trim(), content: content.trim(), tags: tags ?? [] });
  res.status(201).json(note);
});

// READ
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// UPDATE
export const updateNote = asyncHandler(async (req, res) => {
  const updates = {};
  const { title, content, tags, pinned } = req.body;
  if (title !== undefined) updates.title = String(title).trim();
  if (content !== undefined) updates.content = String(content).trim();
  if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];
  if (pinned !== undefined) updates.pinned = Boolean(pinned);

  const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, { new: true });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// DELETE
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ ok: true });
});

// TOGGLE PIN
export const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  note.pinned = !note.pinned;
  await note.save();
  res.json(note);
});
