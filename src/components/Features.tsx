const SERVICES = [
  {
    color: 'indigo',
    title: 'Managed IT Support',
    desc: 'Round-the-clock help desk, device management, and onboarding for teams of any size.',
    icon: <path d="M4 4h16v12H8l-4 4V4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  },
  {
    color: 'teal',
    title: 'Network Infrastructure',
    desc: 'Design, deployment, and monitoring of switches, VLANs, and connectivity across every site.',
    icon: <path d="M12 3v4M5 10h14M7 10v4a5 5 0 0 0 10 0v-4M9 21h6" strokeWidth="1.6" strokeLinecap="round" />,
  },
  {
    color: 'gold',
    title: 'Cybersecurity',
    desc: 'Threat monitoring, access control, and audits that keep client networks and data protected.',
    icon: <path d="M12 2 4 6v6c0 5 3.6 8.7 8 10 4.4-1.3 8-5 8-10V6l-8-4Z" strokeWidth="1.6" strokeLinejoin="round" />,
  },
  {
    color: 'indigo',
    title: 'Cloud Solutions',
    desc: 'Migration, backup, and cloud infrastructure management across AWS, Azure, and hybrid setups.',
    icon: <path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 15.9 8H17a4 4 0 0 1 1 7.9M9 15l3-3 3 3M12 12v9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: 'teal',
    title: 'Custom Software',
    desc: "From internal tools to client-facing platforms — like TitanDesk, built and run by our own team.",
    icon: <path d="M4 6h16M4 12h10M4 18h7" strokeWidth="1.6" strokeLinecap="round" />,
  },
  {
    color: 'gold',
    title: 'IT Consulting & Strategy',
    desc: 'Roadmaps, vendor selection, and budget planning to align technology with business goals.',
    icon: <path d="M4 20V10m6 10V4m6 16v-7" strokeWidth="1.6" strokeLinecap="round" />,
  },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/10 text-indigo-500',
  teal: 'bg-teal-500/10 text-teal-600',
  gold: 'bg-gold-500/15 text-gold-600',
};

export default function Features() {
  return (
    <section id="services" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">What We Do</span>
          <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            IT services built around your business
          </h2>
          <p className="mt-4 text-navy-500">
            We're a full-service IT solutions agency — from day-to-day support to the custom
            platforms that run your operations.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[f.color]}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
