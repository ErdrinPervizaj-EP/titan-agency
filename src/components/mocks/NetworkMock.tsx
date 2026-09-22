const DEVICES = [
  ['CORE-SW-01', 'Cisco Catalyst 9300', 'Online', 'teal'],
  ['FW-EDGE-01', 'MikroTik CCR2004', 'Online', 'teal'],
  ['AP-FLOOR-2', 'Ubiquiti UniFi U6', 'Online', 'teal'],
  ['NAS-BACKUP', 'Synology RS1221+', 'Degraded', 'gold'],
];

export default function NetworkMock() {
  return (
    <div className="bg-navy-900 p-5 text-ink-100">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-500">Devices</p>
          <h3 className="font-display text-lg font-semibold">Network Overview</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-navy-800 px-3 py-1.5 text-xs text-ink-400">
          Client environment — Acme Retail Co.
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Devices', '47'],
          ['VLANs', '6'],
          ['Subnets', '4'],
          ['Online Now', '46 / 47'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-navy-800 p-3.5">
            <p className="text-[11px] text-ink-500">{label}</p>
            <p className="font-display mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800">
        <div className="grid grid-cols-[1.4fr_1.6fr_1fr] gap-2 border-b border-white/10 px-4 py-2.5 text-[11px] font-medium text-ink-500">
          <span>Device</span>
          <span>Model</span>
          <span>Status</span>
        </div>
        {DEVICES.map(([name, model, status, color]) => (
          <div
            key={name}
            className="grid grid-cols-[1.4fr_1.6fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-xs last:border-0"
          >
            <span className="font-medium text-ink-100">{name}</span>
            <span className="text-ink-500">{model}</span>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              color === 'teal' ? 'bg-teal-500/15 text-teal-400' : 'bg-gold-500/15 text-gold-500'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${color === 'teal' ? 'bg-teal-400' : 'bg-gold-500'}`} />
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
