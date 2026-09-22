import { useState } from 'react';

const ITEMS = [
  {
    q: 'What kinds of businesses do you support?',
    a: 'We work with small and mid-sized businesses across industries — anyone who needs reliable IT support, secure networks, or custom software without hiring a full in-house team.',
  },
  {
    q: 'Is TitanDesk required if we hire Titan Network?',
    a: "No. TitanDesk is a platform we built and use internally to deliver faster, more transparent support — but our services stand on their own regardless of the tools involved.",
  },
  {
    q: 'Do you offer on-site support or remote only?',
    a: 'Both. Most day-to-day support is handled remotely for speed, and our Enterprise plan includes on-site visits for hardware, networking, and infrastructure work.',
  },
  {
    q: 'Can you build custom software for our business?',
    a: "Yes — our engineering team builds everything from internal tools to client-facing platforms. TitanDesk itself started as a custom build for our own operations.",
  },
  {
    q: 'What happens after my free trial ends?',
    a: 'You can choose any support plan to continue exactly as configured, or we can help you transition off — no lock-in, no surprise fees.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-slate-50 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">FAQ</span>
          <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-navy-900">{item.q}</span>
                  <span
                    className={`shrink-0 text-xl leading-none text-indigo-500 transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-navy-500">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
