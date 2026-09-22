const CUSTOMERS = [
  ['Acme Retail Co.', 'Retail · 12 sites', 'Active', 'teal'],
  ['Brightline Logistics', 'Logistics · 4 sites', 'Active', 'teal'],
  ['Meridian Health Group', 'Healthcare · 7 sites', 'Onboarding', 'gold'],
  ['Norwood Legal', 'Professional Services', 'Active', 'teal'],
];

export default function CustomersMock() {
  return (
    <div className="bg-navy-900 p-5 text-ink-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Clients & Sales</p>
          <h3 className="font-display text-lg font-semibold">Customers</h3>
        </div>
        <span className="rounded-full bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold">+ Add Customer</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800">
        <div className="grid grid-cols-[1.6fr_1.4fr_1fr] gap-2 border-b border-white/10 px-4 py-2.5 text-[11px] font-medium text-ink-500">
          <span>Customer</span>
          <span>Segment</span>
          <span>Status</span>
        </div>
        {CUSTOMERS.map(([name, segment, status, color]) => (
          <div
            key={name}
            className="grid grid-cols-[1.6fr_1.4fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3.5 text-xs last:border-0"
          >
            <span className="flex items-center gap-2.5 font-medium text-ink-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-[11px] font-bold text-indigo-300">
                {name[0]}
              </span>
              {name}
            </span>
            <span className="text-ink-500">{segment}</span>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                color === 'teal' ? 'bg-teal-500/15 text-teal-400' : 'bg-gold-500/15 text-gold-500'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${color === 'teal' ? 'bg-teal-400' : 'bg-gold-500'}`} />
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
