import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * One TitanDesk page (a replica view) on its own, without the app shell —
 * for feature highlights. Drawn at a fixed design width with the product's
 * tokens (`.td-app`) and scaled to fit its column, like the full replica.
 */
export default function ProductPanel({ children, width = 900, label }: { children: ReactNode; width?: number; label: string }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;
    const observer = new ResizeObserver(() => {
      setScale(Math.min(1, frame.clientWidth / width));
      setHeight(inner.offsetHeight);
    });
    observer.observe(frame);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={frameRef} className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-[0_30px_60px_-30px_rgba(16,26,51,0.3)]" style={{ height: height * scale || undefined }}>
      <div
        ref={innerRef}
        role="region"
        aria-label={label}
        className="td-app origin-top-left bg-canvas p-6"
        style={{ width, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
