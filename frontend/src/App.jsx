import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

// 🔐 auth helpers + form
import { getToken, clearToken } from "./auth";
import AuthForm from "./components/AuthForm";

// notes UI
import NoteForm from "./components/NoteForm";
import NoteItem from "./components/NoteItem";
import Filters from "./components/Filters";

export default function App() {
  // ===== THEME =====
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ===== AUTH STATE =====
  const [authed, setAuthed] = useState(() => Boolean(getToken())); // true if token exists

  // ===== NOTES STATE =====
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");

  const load = async (params = {}) => {
    try {
      setErr("");
      const { data } = await api.get("/notes", { params });
      setNotes(data);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load notes");
    }
  };

  // load only when authenticated
  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const tagOptions = useMemo(() => {
    const s = new Set();
    notes.forEach((n) => n.tags?.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [notes]);

  const handleCreate = async (payload) => {
    await api.post("/notes", payload);
    await load({ q, tag });
  };
  const handleUpdate = async (payload) => {
    await api.patch(`/notes/${editing._id}`, payload);
    setEditing(null);
    await load({ q, tag });
  };
  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    await load({ q, tag });
  };
  const handleTogglePin = async (note) => {
    await api.patch(`/notes/${note._id}/toggle-pin`);
    await load({ q, tag });
  };

  const onSearch = () => load({ q, tag });
  const onClear = () => {
    setQ("");
    setTag("");
    load();
  };

  const pinned = notes.filter((n) => n.pinned);
  const others = notes.filter((n) => !n.pinned);

  // ===== NOT LOGGED IN → show Auth screen =====
  if (!authed) {
    return (
      <div className="min-h-screen bg-[radial-gradient(60%_120%_at_50%_-20%,#e2efff,transparent)] dark:bg-[radial-gradient(60%_120%_at_50%_-20%,#0b1220,transparent)] transition-colors">
        <header className="sticky top-0 z-10 border-b border-black/5 dark:border-white/10 backdrop-blur bg-white/80 dark:bg-black/40">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-blue-600" />
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Notes</h1>
            </div>
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          <AuthForm
            onAuthed={() => {
              // token is stored by AuthForm via setToken(); just flip state
              setAuthed(true);
            }}
          />
        </main>
      </div>
    );
  }

  // ===== LOGGED IN → show Notes app =====
  return (
    <div className="min-h-screen bg-[radial-gradient(60%_120%_at_50%_-20%,#e2efff,transparent)] dark:bg-[radial-gradient(60%_120%_at_50%_-20%,#0b1220,transparent)] transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-black/5 dark:border-white/10 backdrop-blur bg-white/80 dark:bg-black/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600"></div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => {
                clearToken();
                setAuthed(false);
              }}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {err && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 px-3 py-2">
            {err}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          {/* left: filters + notes list */}
          <section>
            <div className="mb-4">
              <Filters
                q={q}
                setQ={setQ}
                tag={tag}
                setTag={setTag}
                tagOptions={tagOptions}
                onSearch={onSearch}
                onClear={onClear}
              />
            </div>

            {/* pinned */}
            {pinned.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Pinned
                  </h2>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                  {pinned.map((n) => (
                    <NoteItem
                      key={n._id}
                      note={n}
                      onEdit={setEditing}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </ul>
              </>
            )}

            {/* others */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                All Notes
              </h2>
              <span className="text-xs text-gray-400">{notes.length} total</span>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {others.length === 0 && notes.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No notes yet — add your first on the right.</p>
              )}
              {others.map((n) => (
                <NoteItem
                  key={n._id}
                  note={n}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </ul>
          </section>

          {/* right: form card */}
          <aside className="self-start">
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-4 shadow-sm">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editing ? "Edit Note" : "Add Note"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Title, content, and optional tags (comma separated).
                </p>
              </div>
              <NoteForm
                initial={editing}
                onSubmit={editing ? handleUpdate : handleCreate}
                onCancel={() => setEditing(null)}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
