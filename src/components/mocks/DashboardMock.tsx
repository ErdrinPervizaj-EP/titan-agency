const BARS = [42, 58, 39, 71, 64, 80, 55, 68, 74, 90, 62, 77];

export default function DashboardMock() {
  return (
    <div className="flex bg-navy-900 text-ink-100">
      {/* sidebar */}
      <div className="hidden w-52 shrink-0 border-r border-white/10 bg-navy-950 p-4 sm:block">
        <div className="mb-6 flex items-center gap-2 px-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500 text-xs font-bold">T</span>
          <span className="text-sm font-semibold">Titan Network</span>
        </div>
        <nav className="space-y-1 text-xs">
          {['Home', 'Support', 'Clients & Sales', 'Delivery', 'Devices', 'People', 'Reports'].map((item, i) => (
            <div
              key={item}
              className={`rounded-lg px-3 py-2 ${i === 0 ? 'bg-indigo-500/15 text-indigo-300 font-medium' : 'text-ink-500'}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </div>

      {/* main */}
      <div className="flex-1 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-500">Overview</p>
            <h3 className="font-display text-lg font-semibold">Dashboard</h3>
          </div>
          <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-medium text-teal-400">
            ● All systems operational
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Open Tickets', '18'],
            ['Unassigned', '3'],
            ['Active Clients', '64'],
            ['SLA Compliance', '98%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-navy-800 p-3.5">
              <p className="text-[11px] text-ink-500">{label}</p>
              <p className="font-display mt-1 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-white/10 bg-navy-800 p-4">
            <p className="mb-4 text-xs font-medium text-ink-400">Ticket Volume — Last 12 Weeks</p>
            <div className="flex h-28 items-end gap-1.5">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-teal-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-navy-800 p-4">
            <p className="mb-3 text-xs font-medium text-ink-400">Top Agents</p>
            <div className="space-y-2.5">
              {[
                ['Maya Chen', '32 tickets'],
                ['Daniel Osei', '27 tickets'],
                ['Priya Nair', '21 tickets'],
              ].map(([name, count]) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <span className="text-ink-300">{name}</span>
                  <span className="text-ink-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
