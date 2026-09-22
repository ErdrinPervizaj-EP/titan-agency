const DAYS = [
  { day: 'Mon', date: 14, events: ['Patch window — Acme'] },
  { day: 'Tue', date: 15, events: [] },
  { day: 'Wed', date: 16, events: ['Onsite visit — Norwood'] },
  { day: 'Thu', date: 17, events: ['Security review'] },
  { day: 'Fri', date: 18, events: ['Backup audit', 'Client QBR'] },
  { day: 'Sat', date: 19, events: [] },
  { day: 'Sun', date: 20, events: [] },
];

export default function CalendarMock() {
  return (
    <div className="bg-navy-900 p-5 text-ink-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-500">Delivery</p>
          <h3 className="font-display text-lg font-semibold">Calendar — Sep 14–20</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-navy-800 px-3 py-1.5 text-xs text-ink-400">
          4 scheduled this week
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(({ day, date, events }) => (
          <div
            key={day}
            className={`min-h-[132px] rounded-xl border p-2.5 ${
              events.length ? 'border-white/10 bg-navy-800' : 'border-white/5 bg-navy-800/40'
            }`}
          >
            <p className="text-[11px] text-ink-500">{day}</p>
            <p className="font-display text-sm font-bold">{date}</p>
            <div className="mt-2 space-y-1">
              {events.map((e) => (
                <div
                  key={e}
                  className="truncate rounded-md bg-indigo-500/15 px-1.5 py-1 text-[10px] font-medium text-indigo-300"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
