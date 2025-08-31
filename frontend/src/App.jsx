import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { getToken, clearToken } from "./auth";
import AuthForm from "./components/AuthForm";

import Sidebar from "./components/Sidebar";
import NoteForm from "./components/NoteForm";
import NoteItem from "./components/NoteItem";
import Filters from "./components/Filters";

export default function App() {
  // theme
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // auth
  const [authed, setAuthed] = useState(() => Boolean(getToken()));

  // notes
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

  useEffect(() => { if (authed) load(); }, [authed]);

  const tagOptions = useMemo(() => {
    const s = new Set();
    notes.forEach((n) => n.tags?.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [notes]);

  const handleCreate = async (payload) => { await api.post("/notes", payload); await load({ q, tag }); };
  const handleUpdate = async (payload) => { await api.patch(`/notes/${editing._id}`, payload); setEditing(null); await load({ q, tag }); };
  const handleDelete = async (id) => { await api.delete(`/notes/${id}`); await load({ q, tag }); };
  const handleTogglePin = async (note) => { await api.patch(`/notes/${note._id}/toggle-pin`); await load({ q, tag }); };
  const onSearch = () => load({ q, tag });
  const onClear = () => { setQ(""); setTag(""); load(); };

  const pinned = notes.filter((n) => n.pinned);
  const others = notes.filter((n) => !n.pinned);

  // auth gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-[radial-gradient(60%_120%_at_50%_-20%,#e2efff,transparent)] dark:bg-[radial-gradient(60%_120%_at_50%_-20%,#0b1220,transparent)]">
        <header className="border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600" />
              <h1 className="font-bold text-lg">Notes App</h1>
            </div>
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4">
          <AuthForm onAuthed={() => setAuthed(true)} />
        </main>
      </div>
    );
  }

  // logged-in layout
  const themeButton = (
    <button
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10 w-full text-left"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
  const logoutButton = (
    <button
      onClick={() => { clearToken(); setAuthed(false); }}
      className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10 w-full text-left"
    >
      Logout
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[radial-gradient(60%_120%_at_50%_-20%,#e2efff,transparent)] dark:bg-[radial-gradient(60%_120%_at_50%_-20%,#0b1220,transparent)]">
      <Sidebar themeButton={themeButton} logoutButton={logoutButton} />

      <main className="flex-1">
        {/* top bar on mobile */}
        <div className="md:hidden border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600" />
              <h1 className="font-bold">Notes App</h1>
            </div>
            <div className="flex gap-2">
              {themeButton}
              {logoutButton}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          {/* Add card + “My Notes” look */}
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6">
            {/* left column */}
            <section>
              <div className="mb-4">
                <Filters
                  q={q} setQ={setQ}
                  tag={tag} setTag={setTag}
                  tagOptions={tagOptions}
                  onSearch={onSearch}
                  onClear={onClear}
                />
              </div>

              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                My Notes
              </h2>
              <div className="text-xs text-gray-400 mb-2">Recently viewed</div>

              {/* pinned row */}
              {pinned.length > 0 && (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
              )}

              {/* all notes grid */}
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

            {/* right column: big add card */}
            <aside className="self-start">
              <NoteForm
                initial={editing}
                onSubmit={editing ? handleUpdate : handleCreate}
                onCancel={() => setEditing(null)}
              />
            </aside>
          </div>

          {err && (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 px-3 py-2">
              {err}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
