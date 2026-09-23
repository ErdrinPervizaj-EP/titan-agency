import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

const CYCLE_MS = 3200;

function prefersStill() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * One "how it works" block: numbered steps beside a diagram. Hovering a step
 * (or a box in the diagram) highlights that part of the flow. Left alone and
 * in view, it walks through the steps by itself; the diagram card also tilts
 * slightly toward the cursor. Both stop for visitors who prefer reduced motion.
 */
export default function HowItWorks({
  title,
  body,
  steps,
  reverse = false,
  renderDiagram,
}: {
  title: string;
  body: string;
  steps: { title: string; desc: string }[];
  reverse?: boolean;
  renderDiagram: (active: number | null, setActive: (step: number | null) => void) => ReactNode;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [auto, setAuto] = useState(1);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const active = hovered ?? (prefersStill() ? null : auto);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hovered !== null || prefersStill()) return;
    const timer = window.setInterval(() => setAuto((step) => (step % steps.length) + 1), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [inView, hovered, steps.length]);

  function tilt(event: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card || prefersStill() || !window.matchMedia('(pointer: fine)').matches) return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    card.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  }
  function resetTilt() {
    if (cardRef.current) cardRef.current.style.transform = '';
  }

  return (
    <div
      ref={rootRef}
      className={`grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:gap-14 ${
        reverse ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'
      }`}
    >
      <div className={reverse ? 'lg:order-2' : ''}>
        <h3 className="font-display text-2xl font-bold text-navy-900">{title}</h3>
        <p className="mt-3 leading-relaxed text-navy-500">{body}</p>
        <ol className="mt-8 space-y-1">
          {steps.map((step, i) => {
            const n = i + 1;
            const isActive = active === n;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n)}
                  onBlur={() => setHovered(null)}
                  aria-pressed={isActive}
                  className={`grid w-full grid-cols-[2rem_minmax(0,1fr)] gap-x-3 rounded-lg border-l-2 px-4 py-3 text-left transition-colors ${
                    isActive ? 'border-indigo-500 bg-slate-50' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-mono text-sm ${isActive ? 'text-indigo-500' : 'text-navy-400'}`}>{String(n).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-semibold text-navy-900">{step.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-navy-500">{step.desc}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`[perspective:1400px] ${reverse ? 'lg:order-1' : ''}`} onMouseMove={tilt} onMouseLeave={resetTilt}>
        <div
          ref={cardRef}
          className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_30px_60px_-30px_rgba(16,26,51,0.25)] transition-transform duration-300 ease-out sm:p-6"
        >
          {renderDiagram(active, setHovered)}
        </div>
      </div>
    </div>
  );
}
