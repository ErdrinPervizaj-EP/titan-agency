import DashboardMock from './mocks/DashboardMock';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-20 lg:pt-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4f63d2 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -top-20 left-[-10%] h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #2fb3a6 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            IT Solutions Agency
          </span>

          <h1 className="font-display text-balance mt-7 text-4xl font-bold leading-[1.08] text-navy-900 sm:text-5xl lg:text-6xl">
            IT support, networks, and{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-teal-500 to-gold-600 bg-clip-text text-transparent">
              custom software
            </span>{' '}
            — done right
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-500">
            Titan Network is a full-service IT solutions agency. We manage infrastructure, secure
            networks, and build the custom software our clients need to run their operations —
            including TitanDesk, our own service-desk platform.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Get a Free Assessment →
            </a>
            <a
              href="#services"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-slate-50"
            >
              Explore Our Services
            </a>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              ['120+', 'Clients Supported'],
              ['99.9%', 'Network Uptime'],
              ['24/7', 'Monitoring & Support'],
              ['3+', 'Years in Business'],
            ].map(([stat, label]) => (
              <div key={label} className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-navy-900">{stat}</p>
                <p className="mt-1 text-sm text-navy-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product screenshot in browser frame */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-indigo-500/10 via-transparent to-teal-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-900/10">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 rounded-md bg-white px-3 py-1 text-xs text-navy-400 border border-slate-200">
                app.titandesk.io/dashboard
              </span>
            </div>
            <DashboardMock />
          </div>
          <p className="mt-4 text-center text-sm text-navy-400">
            Pictured: TitanDesk, the service-desk platform we built and use with our own clients.
          </p>
        </div>
      </div>
    </section>
  );
}
