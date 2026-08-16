import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cx } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'danger' | 'warning';

export interface ToastOptions {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** ms before auto-dismiss. Pass Infinity to keep it until dismissed. @default 5000 */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Access the imperative `toast()` / `dismiss()` API. Must be inside a ToastProvider. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return ctx;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ToastItem({
  record,
  onDismiss,
}: {
  record: ToastRecord;
  onDismiss: () => void;
}) {
  const { title, description, variant = 'default', duration = 5000, action } = record;
  const reduce = useReducedMotion();
  const remaining = React.useRef(duration);
  const startedAt = React.useRef<number>(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const resume = React.useCallback(() => {
    if (!Number.isFinite(remaining.current)) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(onDismiss, remaining.current);
  }, [onDismiss]);

  const pause = React.useCallback(() => {
    clear();
    if (Number.isFinite(remaining.current)) {
      remaining.current -= Date.now() - startedAt.current;
    }
  }, [clear]);

  React.useEffect(() => {
    resume();
    return clear;
  }, [resume, clear]);

  const assertive = variant === 'danger' || variant === 'warning';

  return (
    <motion.li
      layout
      role={assertive ? 'alert' : 'status'}
      aria-atomic="true"
      className={cx('strk-toast', `strk-toast--${variant}`)}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
      onPointerEnter={pause}
      onPointerLeave={resume}
    >
      <div className="strk-toast__content">
        <p className="strk-toast__title">{title}</p>
        {description && <p className="strk-toast__description">{description}</p>}
      </div>
      {action && (
        <button
          type="button"
          className="strk-toast__action strk-focus-ring"
          onClick={() => {
            action.onClick();
            onDismiss();
          }}
        >
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="strk-toast__close strk-focus-ring"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </motion.li>
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Corner to stack toasts in. @default 'bottom-right' */
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Wrap the app once. Renders a portalled, `aria-live` region and exposes the
 * imperative `toast()` API through `useToast()`. Danger/warning toasts announce
 * assertively (`role="alert"`); the rest are polite (`role="status"`). Auto-
 * dismiss pauses on hover.
 */
export function ToastProvider({
  children,
  placement = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const counter = React.useRef(0);
  React.useEffect(() => setMounted(true), []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((options: ToastOptions) => {
    counter.current += 1;
    const id = options.id ?? `toast-${counter.current}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <ol
            className={cx('strk-toast__viewport', `strk-toast__viewport--${placement}`)}
            aria-label="Notifications"
          >
            <AnimatePresence initial={false}>
              {toasts.map((record) => (
                <ToastItem
                  key={record.id}
                  record={record}
                  onDismiss={() => dismiss(record.id)}
                />
              ))}
            </AnimatePresence>
          </ol>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
