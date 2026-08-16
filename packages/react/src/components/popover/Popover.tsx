import * as React from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  type Placement,
} from '@floating-ui/react';
import { cx } from '../../lib/utils';
import { useControllableState } from '../../hooks/useControllableState';

export interface PopoverProps {
  /** The element that toggles the popover. Gets `aria-expanded`/`aria-haspopup`. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  side?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * A click-triggered popover. Floating UI positions and flips it; focus moves
 * into the panel on open and returns to the trigger on close; Escape and
 * outside-clicks dismiss. Exposed as `role="dialog"`.
 */
export function Popover({
  trigger,
  children,
  side = 'bottom-start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: side,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const { isMounted, styles: transition } = useTransitionStyles(context, {
    duration: { open: 160, close: 120 },
    initial: { opacity: 0, transform: 'scale(0.97)' },
  });

  const childRef = (trigger as { ref?: React.Ref<unknown> }).ref;
  const ref = useMergeRefs([refs.setReference, childRef]);
  const triggerEl = React.cloneElement(
    trigger,
    getReferenceProps({ ref, ...trigger.props }),
  );

  return (
    <>
      {triggerEl}
      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={cx('strk-popover', className)}
              {...getFloatingProps()}
            >
              <div className="strk-popover__inner" style={transition}>
                {children}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
