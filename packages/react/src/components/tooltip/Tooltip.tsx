import * as React from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { cx } from '../../lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: Placement;
  /** ms before the tooltip opens on hover. @default 200 */
  openDelay?: number;
  disabled?: boolean;
}

/**
 * A tooltip on Floating UI. Opens on hover *and* keyboard focus, dismisses on
 * Escape, and is exposed with `role="tooltip"` + `aria-describedby` wired to its
 * trigger. Purely descriptive — never put interactive content inside it.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  openDelay = 200,
  disabled = false,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: side,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const hover = useHover(context, {
    move: false,
    enabled: !disabled,
    delay: { open: openDelay, close: 60 },
  });
  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const childRef = (children as { ref?: React.Ref<unknown> }).ref;
  const ref = useMergeRefs([refs.setReference, childRef]);

  const trigger = React.cloneElement(
    children,
    getReferenceProps({ ref, ...children.props }),
  );

  return (
    <>
      {trigger}
      {open && content != null && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cx('strk-tooltip')}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
