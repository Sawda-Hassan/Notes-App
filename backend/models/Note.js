import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
