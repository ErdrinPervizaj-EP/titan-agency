import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useFocusTrap } from './lib/useFocusTrap';

export default function Drawer({
  open, onClose, title, badge, width = 480, children,
}: { open: boolean; onClose: () => void; title: string; badge?: React.ReactNode; width?: number; children: React.ReactNode }) {
  const asideRef = useRef<HTMLElement>(null);
  useFocusTrap(open, asideRef);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-40 bg-black/40 transition-opacity" />
      <aside
        ref={asideRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth: width }}
        className={clsx('fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto border-l border-line bg-surface shadow-pop transition-transform duration-200 focus:outline-none', open ? 'translate-x-0' : 'translate-x-full')}
      >
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-line bg-surface px-5 py-4">
          <h2 className="min-w-0 break-words text-base font-semibold text-ink">{title}</h2>
          {badge}
          <button onClick={onClose} aria-label={`Close ${title}`} type="button" className="focus-ring ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-control border border-line text-ink-soft hover:bg-line-soft">
            <X size={18} />
          </button>
        </header>
        <div className="min-w-0 flex-1 p-5">{children}</div>
      </aside>
    </>,
    document.body,
  );
}
