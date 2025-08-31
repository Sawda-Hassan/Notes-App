export default function Sidebar({ themeButton, logoutButton }) {
  return (
    <aside className="hidden md:block w-60 shrink-0 border-r border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="p-4">
        <a href="#" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600"></div>
          <span className="text-lg font-bold tracking-tight">Notes App</span>
        </a>
      </div>

      <nav className="px-2 py-3">
        <div className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-gray-400 px-2 mb-2">
          Menu
        </div>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-300"
          title="Notes"
        >
          <span>📑</span>
          <span className="font-medium">Notes</span>
        </button>
      </nav>

      <div className="mt-auto p-4 flex flex-col gap-2">
        {themeButton}
        {logoutButton}
      </div>
    </aside>
  );
}
