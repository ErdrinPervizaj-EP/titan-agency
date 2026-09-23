import { useEffect, useRef } from 'react';

/**
 * Writes pointer and scroll position to CSS variables on the given element,
 * for transforms that respond to the visitor:
 *   --px, --py  cursor position, -1..1 on each axis from the viewport center
 *   --sp        how far the element has scrolled up, 0 (in view) .. 1 (one viewport)
 * Consumers read them in their own styles, e.g. rotateX(calc(var(--py) * 4deg)).
 * Nothing is written for touch devices or visitors who prefer reduced motion,
 * so the variables stay at their CSS fallbacks and everything sits still.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let pointer: { x: number; y: number } | null = null;
    function update() {
      raf = 0;
      if (pointer) {
        el!.style.setProperty('--px', ((pointer.x / window.innerWidth) * 2 - 1).toFixed(3));
        el!.style.setProperty('--py', ((pointer.y / window.innerHeight) * 2 - 1).toFixed(3));
      }
      const scrolled = Math.min(Math.max(-el!.getBoundingClientRect().top / window.innerHeight, 0), 1);
      el!.style.setProperty('--sp', scrolled.toFixed(3));
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    function onMove(e: MouseEvent) {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
