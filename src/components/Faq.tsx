import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useT } from '../i18n/useLang';

export default function Faq() {
  const t = useT();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-slate-50 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{t.faq.tag}</span>
          <h2 className="font-display mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">{t.faq.title}</h2>
        </div>

        <div className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-navy-900">{item.q}</span>
                  <Plus
                    size={20}
                    strokeWidth={2}
                    className={`shrink-0 text-indigo-500 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  />
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
