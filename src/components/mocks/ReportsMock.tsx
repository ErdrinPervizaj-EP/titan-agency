const WEEKS = [
  ['Week 1', 96],
  ['Week 2', 99],
  ['Week 3', 94],
  ['Week 4', 100],
];

export default function ReportsMock() {
  return (
    <div className="bg-navy-900 p-5 text-ink-100">
      <div className="mb-5">
        <p className="text-xs text-ink-500">Reports</p>
        <h3 className="font-display text-lg font-semibold">SLA & Performance</h3>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Tickets Resolved', '312'],
          ['Open Tickets', '18'],
          ['Avg. Resolution', '2.4h'],
          ['SLA Compliance', '98%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-navy-800 p-3.5">
            <p className="text-[11px] text-ink-500">{label}</p>
            <p className="font-display mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-navy-800 p-4">
          <p className="mb-3 text-xs font-medium text-ink-400">SLA Compliance by Week</p>
          <div className="space-y-3">
            {WEEKS.map(([label, pct]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-[11px] text-ink-500">
                  <span>{label}</span>
                  <span className="text-ink-300">{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-navy-800 p-4">
          <p className="mb-3 text-xs font-medium text-ink-400">Priority Mix</p>
          <div className="space-y-2.5">
            {[
              ['Low', '46%', 'teal'],
              ['Medium', '38%', 'gold'],
              ['High', '16%', 'indigo'],
            ].map(([label, pct, color]) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-300">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      color === 'teal' ? 'bg-teal-400' : color === 'gold' ? 'bg-gold-500' : 'bg-indigo-400'
                    }`}
                  />
                  {label}
                </span>
                <span className="text-ink-500">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
