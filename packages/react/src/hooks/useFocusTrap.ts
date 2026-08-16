import * as React from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(el: HTMLElement): boolean {
  return (
    el.offsetWidth > 0 ||
    el.offsetHeight > 0 ||
    el.getClientRects().length > 0
  );
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.getAttribute('aria-hidden') !== 'true' && isVisible(el));
}

export interface FocusTrapOptions {
  /** Element to focus when the trap activates. Defaults to the first focusable. */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Restore focus to the previously-focused element on deactivate. Default true. */
  restoreFocus?: boolean;
  /** Called on Escape while the trap is active. */
  onEscape?: (event: KeyboardEvent) => void;
}

/**
 * A hand-built focus trap: wraps Tab / Shift+Tab inside `containerRef`, moves
 * initial focus in, forwards Escape, and restores focus on close. No third-party
 * focus-management dependency — this is the accessibility core of Dialog and the
 * Command menu, so it's worth owning outright.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement>,
  options: FocusTrapOptions = {},
): void {
  // Options in a ref so the effect depends only on `active`.
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  React.useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusInitial = () => {
      const { initialFocusRef } = optionsRef.current;
      const target =
        initialFocusRef?.current ?? getFocusable(container)[0] ?? container;
      target.focus();
    };
    const raf = requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        optionsRef.current.onEscape?.(event);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const activeEl = document.activeElement;

      if (event.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !container.contains(activeEl)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const { restoreFocus = true } = optionsRef.current;
      if (restoreFocus && previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
