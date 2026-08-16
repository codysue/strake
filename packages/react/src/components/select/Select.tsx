import * as React from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { cx } from '../../lib/utils';
import { useControllableState } from '../../hooks/useControllableState';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Emits a hidden input so the value posts with a form. */
  name?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

function ChevronIcon() {
  return (
    <svg className="strk-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="strk-select__check" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M13 4.5l-6 7L3 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * An accessible custom select (listbox pattern). Full keyboard support —
 * Up/Down move the active option, Home/End jump to the ends, type-ahead
 * matches by label, Enter/Space select, Escape closes — with `role="listbox"`,
 * `role="option"`, `aria-selected`, and `aria-activedescendant`-style focus
 * managed by Floating UI. Provide an `aria-label` or `aria-labelledby`.
 */
export function Select({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = 'Select…',
  disabled = false,
  size: sizeProp = 'md',
  name,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: (v) => {
      if (v != null) onValueChange?.(v);
    },
  });
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const selectedIndex = options.findIndex((o) => o.value === selected);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  React.useEffect(() => {
    labelsRef.current = options.map((o) => o.label);
  }, [options]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, 320)}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex: selectedIndex < 0 ? null : selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex: selectedIndex < 0 ? null : selectedIndex,
    onMatch: open
      ? setActiveIndex
      : (index) => {
          const opt = options[index];
          if (opt && !opt.disabled) setSelected(opt.value);
        },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead,
  ]);

  function commit(index: number) {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    setSelected(opt.value);
    setOpen(false);
  }

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className={cx(
          'strk-select__trigger',
          'strk-focus-ring',
          `strk-select__trigger--${sizeProp}`,
          className,
        )}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-placeholder={selectedOption ? undefined : true}
        {...getReferenceProps()}
      >
        <span className="strk-select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon />
      </button>

      {name && <input type="hidden" name={name} value={selected ?? ''} />}

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className="strk-select__listbox"
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {options.map((opt, i) => (
                <div
                  key={opt.value}
                  ref={(node) => {
                    elementsRef.current[i] = node;
                  }}
                  role="option"
                  aria-selected={opt.value === selected}
                  aria-disabled={opt.disabled || undefined}
                  className={cx(
                    'strk-select__option',
                    activeIndex === i && 'is-active',
                    opt.value === selected && 'is-selected',
                    opt.disabled && 'is-disabled',
                  )}
                  tabIndex={activeIndex === i ? 0 : -1}
                  {...getItemProps({
                    onClick: () => commit(i),
                    onKeyDown: (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        commit(i);
                      }
                    },
                  })}
                >
                  <span className="strk-select__option-label">{opt.label}</span>
                  {opt.value === selected && <CheckIcon />}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
