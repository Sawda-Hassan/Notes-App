export default function Filters({ q, setQ, tag, setTag, tagOptions, onSearch, onClear }) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative flex-1 min-w-[240px]">
        <input
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-10 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search text…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="absolute left-3 top-2.5 select-none">🔎</span>
      </div>

      <select
        className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      >
        <option value="">All tags</option>
        {tagOptions.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button
        onClick={onSearch}
        className="rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
      >
        Search
      </button>
      <button
        onClick={onClear}
        className="rounded-xl px-4 py-2 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
      >
        Clear
      </button>
    </div>
  );
}
