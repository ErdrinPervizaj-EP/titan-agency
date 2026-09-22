import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

/** Animates from 0 to the numeric part of `value` once visible, keeping any prefix/suffix (e.g. "120+", "99.9%"). */
export default function Counter({ value, duration = 1200 }: { value: string; duration?: number }) {
  const { ref, visible } = useReveal<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(value.replace(/[0-9.]/g, (c) => (c === '.' ? '.' : '0')));

  const match = value.match(/(-?\d+(?:[.,]\d+)?)/);
  const numeric = match ? parseFloat(match[1].replace(',', '.')) : null;

  useEffect(() => {
    if (!visible || numeric === null) {
      if (numeric === null) setDisplay(value);
      return;
    }
    const decimals = match![1].includes('.') || match![1].includes(',') ? 1 : 0;
    const start = performance.now();

    let raf: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numeric! * eased;
      setDisplay(value.replace(match![1], current.toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return <span ref={ref}>{display}</span>;
}
