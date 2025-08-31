import { useEffect, useState } from "react";

export default function NoteForm({ onSubmit, initial, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setContent(initial.content || "");
      setTags((initial.tags || []).join(", "));
    } else {
      setTitle(""); setContent(""); setTags("");
    }
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
    };
    if (!payload.title || !payload.content) return;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit}
      className="rounded-2xl bg-[var(--panel)] shadow-[var(--shadow)] border border-[var(--soft)] p-6">
      <h3 className="text-2xl font-semibold text-[var(--ink-2)]">Add a Note</h3>
      <p className="text-sm text-[var(--muted)] mb-4">Title</p>
      <input
        className="w-full rounded-xl border border-[var(--soft)] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        required
      />
      <p className="text-sm text-[var(--muted)] mt-4 mb-2">Take a note…</p>
      <textarea
        rows={5}
        className="w-full rounded-xl border border-[var(--soft)] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Take a note..."
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        required
      />
      <input
        className="w-full rounded-xl border border-[var(--soft)] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 mt-3"
        placeholder="tags (comma separated)"
        value={tags}
        onChange={(e)=>setTags(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          {initial ? "Update Note" : "Add Note"}
        </button>
        {initial && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[var(--soft)] hover:bg-gray-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
