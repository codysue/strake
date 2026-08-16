import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cx } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  /** Register a global ⌘K / Ctrl+K toggle. @default true */
  shortcut?: boolean;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="strk-command__search-icon">
      <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A ⌘K command palette. The text input is a `role="combobox"` driving a
 * `role="listbox"` via `aria-activedescendant`, so arrow keys move the active
 * option while focus (and typing) stay in the input. Fuzzy-filters by label and
 * keywords, groups results, traps focus, and closes on Escape or ⌘K.
 */
export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder = 'Type a command or search…',
  emptyMessage = 'No results found.',
  shortcut = true,
}: CommandMenuProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionRefs = React.useRef<Array<HTMLElement | null>>([]);
  const baseId = React.useId();
  const listId = `${baseId}-list`;
  const reduce = useReducedMotion();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [items, query]);

  // Reset the active option whenever the result set changes.
  React.useEffect(() => {
    setActiveIndex(filtered.length > 0 ? 0 : null);
  }, [filtered]);

  // Clear the query when the menu closes.
  React.useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Keep the active option scrolled into view.
  React.useEffect(() => {
    if (activeIndex == null) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useFocusTrap(open && mounted, panelRef, {
    initialFocusRef: inputRef,
    onEscape: () => onOpenChange(false),
  });

  // Global ⌘K / Ctrl+K.
  React.useEffect(() => {
    if (!shortcut) return;
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcut, open, onOpenChange]);

  function move(delta: number) {
    setActiveIndex((current) => {
      const n = filtered.length;
      if (n === 0) return null;
      let next = current == null ? (delta > 0 ? 0 : n - 1) : (current + delta + n) % n;
      let guard = 0;
      while (filtered[next]?.disabled && guard < n) {
        next = (next + delta + n) % n;
        guard += 1;
      }
      return next;
    });
  }

  function run(index: number | null) {
    if (index == null) return;
    const item = filtered[index];
    if (!item || item.disabled) return;
    onOpenChange(false);
    setQuery('');
    item.onSelect();
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        run(activeIndex);
        break;
      default:
        break;
    }
  }

  // Group filtered items while preserving flat indices for aria + activation.
  const groups: Array<{ name?: string; entries: Array<{ item: CommandItem; index: number }> }> = [];
  const groupPos = new Map<string, number>();
  filtered.forEach((item, index) => {
    const key = item.group ?? '';
    if (!groupPos.has(key)) {
      groupPos.set(key, groups.length);
      groups.push({ name: item.group, entries: [] });
    }
    groups[groupPos.get(key)!]!.entries.push({ item, index });
  });

  if (!mounted) return null;
  const duration = reduce ? 0 : 0.18;
  const optionId = (index: number) => `${baseId}-opt-${index}`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="strk-command__root">
          <motion.div
            className="strk-command__backdrop"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <div className="strk-command__viewport">
            <motion.div
              ref={panelRef}
              className="strk-command__panel"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration, ease: [0.2, 0, 0, 1] }}
            >
              <div className="strk-command__search">
                <SearchIcon />
                <input
                  ref={inputRef}
                  className="strk-command__input"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={
                    activeIndex != null ? optionId(activeIndex) : undefined
                  }
                  aria-autocomplete="list"
                  aria-label={placeholder}
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                />
              </div>

              <div className="strk-command__list" id={listId} role="listbox">
                {filtered.length === 0 ? (
                  <div className="strk-command__empty">{emptyMessage}</div>
                ) : (
                  groups.map((group, gi) => (
                    <div className="strk-command__group" key={group.name ?? `g-${gi}`} role="group">
                      {group.name && (
                        <div className="strk-command__group-label">{group.name}</div>
                      )}
                      {group.entries.map(({ item, index }) => (
                        <div
                          key={item.id}
                          id={optionId(index)}
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          role="option"
                          aria-selected={activeIndex === index}
                          aria-disabled={item.disabled || undefined}
                          className={cx(
                            'strk-command__item',
                            activeIndex === index && 'is-active',
                            item.disabled && 'is-disabled',
                          )}
                          onPointerMove={() => setActiveIndex(index)}
                          onClick={() => run(index)}
                        >
                          {item.icon && (
                            <span className="strk-command__item-icon" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
                          <span className="strk-command__item-label">{item.label}</span>
                          {item.hint && (
                            <span className="strk-command__item-hint">{item.hint}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              <div className="strk-command__footer" aria-hidden="true">
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                <span>to navigate</span>
                <kbd>↵</kbd>
                <span>to select</span>
                <kbd>esc</kbd>
                <span>to close</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
