/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

interface ToastItem { id: number; message: string; tone: 'success' | 'error' }
interface ToastContextValue { push: (message: string, tone?: ToastItem['tone']) => void }
const ToastContext = createContext<ToastContextValue | null>(null);

export function SuperAdminToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: ToastItem['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4500);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-5 top-5 z-[100] flex w-[min(360px,calc(100vw-40px))] flex-col gap-2" aria-live="polite">
        {items.map((item) => {
          const Icon = item.tone === 'success' ? CheckCircle2 : XCircle;
          return (
            <div key={item.id} className={`flex items-start gap-3 rounded-card border bg-surface p-3.5 shadow-pop ${item.tone === 'success' ? 'border-ok/30' : 'border-bad/30'}`}>
              <Icon size={18} className={item.tone === 'success' ? 'text-ok' : 'text-bad'} />
              <p className="min-w-0 flex-1 text-body-sm font-medium text-ink">{item.message}</p>
              <button aria-label="Dismiss notification" onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useSuperAdminToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useSuperAdminToast must be used inside SuperAdminToastProvider');
  return value;
}
