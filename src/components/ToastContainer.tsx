import React, { useEffect, useState } from 'react';
import { subscribeToasts, removeToast, ToastItem } from '../utils/toast';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts((updated) => setToasts(updated));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notification Toasts"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toasts.map((t) => {
        let icon = <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />;
        let borderClass = 'border-slate-700/80 bg-slate-900/95 text-slate-100';

        if (t.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
          borderClass = 'border-emerald-700/50 bg-slate-950/95 text-slate-100 shadow-emerald-950/20';
        } else if (t.type === 'error') {
          icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-700/60 bg-slate-950/95 text-slate-100 shadow-rose-950/20';
        } else if (t.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
          borderClass = 'border-amber-700/60 bg-slate-950/95 text-slate-100 shadow-amber-950/20';
        }

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl text-xs sm:text-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 leading-snug break-words">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition p-0.5 -mr-1 rounded cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
