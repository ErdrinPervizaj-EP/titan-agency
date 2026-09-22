import { useT } from '../i18n/useLang';

export default function TrustBar() {
  const t = useT();
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
          {t.trustBar.label}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {t.trustBar.items.map((m) => (
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
