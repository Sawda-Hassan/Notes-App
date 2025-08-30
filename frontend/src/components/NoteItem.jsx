export default function NoteItem({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <li className="group rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <strong className="text-[15px] leading-tight text-gray-900 dark:text-white truncate">
              {note.title}
            </strong>
            {note.pinned && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                Pinned
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {note.content}
          </p>
        </div>

        <div className="flex shrink-0 gap-2 opacity-90">
          <button
            onClick={() => onTogglePin(note)}
            className="px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            title={note.pinned ? "Unpin" : "Pin"}
          >
            {note.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            onClick={() => onEdit(note)}
            className="px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {(note.tags || []).map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700 dark:bg-white/10 dark:text-gray-300"
          >
            #{t}
          </span>
        ))}
      </div>

      <small className="block mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </small>
    </li>
  );
}
