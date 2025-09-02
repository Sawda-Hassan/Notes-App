export default function NoteItem({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <li className="rounded-xl bg-[var(--panel)] shadow-[var(--shadow)] border border-[var(--soft)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-[var(--ink-2)]">{note.title}</h4>
          <p className="mt-1 text-sm text-[var(--ink)]/80 whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button title={note.pinned ? "Unpin" : "Pin"} onClick={()=>onTogglePin(note)}
            className="text-[13px] px-2 py-1 rounded-md border border-[var(--soft)] hover:bg-gray-50">📌</button>
          <button title="Edit" onClick={()=>onEdit(note)}
            className="text-[13px] px-2 py-1 rounded-md border border-[var(--soft)] hover:bg-gray-50">✏️</button>
          <button title="Delete" onClick={()=>onDelete(note._id)}
            className="text-[13px] px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">🗑️</button>
        </div>
      </div>

      {note.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {note.tags.map(t=>(
            <span key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-[#eef3ff] text-[var(--ink-2)]">
              #{t}
            </span>
          ))}
        </div>
      )}

      <small className="block mt-2 text-[11px] text-[var(--muted)]">
        {new Date(note.updatedAt).toLocaleString()}
      </small>
    </li>
  );
}
