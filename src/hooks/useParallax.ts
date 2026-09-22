import { useEffect, useRef } from 'react';

/**
 * Tracks normalized cursor position (-1..1 on each axis, relative to the
 * viewport center) and writes it to CSS variables (--px, --py) on the given
 * element. Disabled on touch/coarse-pointer devices. Consumers read the
 * variables in their own transforms, e.g. translate(calc(var(--px) * 12px), ...).
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    function onMove(e: MouseEvent) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const px = (e.clientX / window.innerWidth) * 2 - 1;
        const py = (e.clientY / window.innerHeight) * 2 - 1;
        el!.style.setProperty('--px', px.toFixed(3));
        el!.style.setProperty('--py', py.toFixed(3));
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
