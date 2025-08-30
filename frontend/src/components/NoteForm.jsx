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
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    };
    if (!payload.title || !payload.content) return;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input
        className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        rows={5}
        className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl px-4 py-2 bg-green-600 text-white hover:bg-green-700"
        >
          {initial ? "Update Note" : "Add Note"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
