const TICKETS = [
  ['TD-142', 'VPN drops for remote sales team', 'Acme Retail Co.', 'High', 'gold'],
  ['TD-141', 'New hire laptop provisioning', 'Norwood Legal', 'Medium', 'indigo'],
  ['TD-139', 'Guest Wi-Fi certificate renewal', 'Brightline Logistics', 'Low', 'teal'],
];

export default function SupportMock() {
  return (
    <div className="bg-navy-900 p-5 text-ink-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Support</p>
          <h3 className="font-display text-lg font-semibold">Support Queue</h3>
        </div>
        <span className="rounded-full bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold">+ New Ticket</span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['All Open', '18'],
          ['Unassigned', '3'],
          ['SLA at Risk', '1'],
          ['Resolved Today', '9'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-navy-800 p-3.5">
            <p className="text-[11px] text-ink-500">{label}</p>
            <p className="font-display mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {TICKETS.map(([id, title, client, priority, color]) => (
          <div key={id} className="rounded-xl border border-white/10 bg-navy-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-ink-500">{id} · {client}</p>
                <p className="mt-1 text-sm font-medium text-ink-100">{title}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  color === 'gold'
                    ? 'bg-gold-500/15 text-gold-500'
                    : color === 'indigo'
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'bg-teal-500/15 text-teal-400'
                }`}
              >
                {priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
