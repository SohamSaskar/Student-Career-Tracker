'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastItem, ToastType } from '@/types/design-system';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (title: string, description?: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = 'success', duration = 3500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-dt-success flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-dt-danger flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-dt-warning flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-dt-info flex-shrink-0" />,
    neutral: <Info className="w-5 h-5 text-dt-secondary flex-shrink-0" />,
  };

  const borderMap = {
    success: 'border-l-4 border-l-dt-success',
    error: 'border-l-4 border-l-dt-danger',
    warning: 'border-l-4 border-l-dt-warning',
    info: 'border-l-4 border-l-dt-info',
    neutral: 'border-l-4 border-l-dt-muted',
  };

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-3.5 bg-dt-elevated border border-dt-border rounded-lg shadow-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2',
        borderMap[toast.type]
      )}
    >
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dt-primary leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-dt-secondary mt-1 leading-snug">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="text-dt-muted hover:text-dt-primary p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-dt-navy"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
