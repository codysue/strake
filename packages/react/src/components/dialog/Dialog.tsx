import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cx } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Element to focus when the dialog opens. Defaults to the first focusable. */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Render the built-in close (×) button. @default true */
  showClose?: boolean;
  className?: string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" width="16" height="16">
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function useScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/**
 * A modal dialog. Focus is trapped by the hand-built `useFocusTrap` hook —
 * initial focus moves in, Tab wraps, Escape closes, and focus returns to the
 * trigger on close. Background scroll is locked, the surface is `role="dialog"`
 * + `aria-modal`, and title/description are associated via `aria-labelledby`/
 * `aria-describedby`. Framer Motion carries the enter/exit.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  initialFocusRef,
  showClose = true,
  className,
}: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const titleId = React.useId();
  const descId = React.useId();

  useScrollLock(open && mounted);
  useFocusTrap(open && mounted, panelRef, {
    initialFocusRef,
    onEscape: () => onOpenChange(false),
  });

  if (!mounted) return null;

  const duration = reduce ? 0 : 0.2;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="strk-dialog__root">
          <motion.div
            className="strk-dialog__backdrop"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <div className="strk-dialog__viewport">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={description ? descId : undefined}
              tabIndex={-1}
              className={cx('strk-dialog__panel', `strk-dialog__panel--${size}`, className)}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration, ease: [0.2, 0, 0, 1] }}
            >
              {(title || showClose) && (
                <header className="strk-dialog__header">
                  <div className="strk-dialog__heading">
                    {title && (
                      <h2 id={titleId} className="strk-dialog__title">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p id={descId} className="strk-dialog__description">
                        {description}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <button
                      type="button"
                      className="strk-dialog__close strk-focus-ring"
                      aria-label="Close dialog"
                      onClick={() => onOpenChange(false)}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </header>
              )}
              {children && <div className="strk-dialog__body">{children}</div>}
              {footer && <footer className="strk-dialog__footer">{footer}</footer>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
