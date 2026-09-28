'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101318]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'w-full bg-dt-elevated border border-dt-border rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[90vh] transition-transform animate-in zoom-in-95',
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-dt-border">
            <div className="flex flex-col gap-0.5">
              {title && <h3 className="text-lg font-bold text-dt-primary">{title}</h3>}
              {description && <p className="text-xs text-dt-secondary">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-dt-muted hover:text-dt-primary p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-dt-navy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-5 overflow-y-auto flex-1 text-sm text-dt-primary">{children}</div>

        {footer && (
          <div className="p-4 bg-dt-card border-t border-dt-border flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
