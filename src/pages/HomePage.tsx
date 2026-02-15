function HomePage() {
  return (
    <div className="h-full w-full p-6">
      <header className="mb-8 text-center">
        <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">
          Xush kelibsiz
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-200">
          Admin Panel
        </h1>
      </header>

      {/* dashboard cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition">
          <div>
            <h2 className="text-xs text-slate-400 uppercase tracking-wide">Users</h2>
            <p className="mt-2 text-2xl font-semibold text-indigo-400">1,234</p>
          </div>
          <span className="text-sm text-slate-500">Last 24h</span>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition">
          <div>
            <h2 className="text-xs text-slate-400 uppercase tracking-wide">Sales</h2>
            <p className="mt-2 text-2xl font-semibold text-indigo-400">$9,876</p>
          </div>
          <span className="text-sm text-slate-500">This week</span>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition">
          <div>
            <h2 className="text-xs text-slate-400 uppercase tracking-wide">Products</h2>
            <p className="mt-2 text-2xl font-semibold text-indigo-400">234</p>
          </div>
          <span className="text-sm text-slate-500">Active</span>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition">
          <div>
            <h2 className="text-xs text-slate-400 uppercase tracking-wide">Revenue</h2>
            <p className="mt-2 text-2xl font-semibold text-indigo-400">$23k</p>
          </div>
          <span className="text-sm text-slate-500">Monthly</span>
        </div>
      </div>

      {/* optional welcome graphic */}
      <div className="mt-12 flex justify-center">
        <svg
          className="w-48 h-48 text-indigo-500 opacity-30"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 10l4 4 4-4" />
        </svg>
      </div>
    </div>
  )
}

export default HomePage

