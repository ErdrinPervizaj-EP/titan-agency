const SERVICES = [
  'Managed IT',
  'Networking',
  'Cybersecurity',
  'Cloud',
  'Custom Software',
  'IT Consulting',
  'Help Desk',
];

export default function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
          Everything under one roof
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {SERVICES.map((m) => (
            <span
              key={m}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-navy-700 shadow-sm"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
