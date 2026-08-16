import * as React from 'react';
import { composeEventHandlers, cx } from '../../lib/utils';
import { useControllableState } from '../../hooks/useControllableState';

export interface SwitchProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'value' | 'type'
  > {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

/**
 * A toggle built on a native `<button role="switch">` — Space/Enter toggle it
 * for free, `aria-checked` reflects state, and it participates in a label's
 * click target. Provide an `aria-label` or associate a `<label>`/`aria-labelledby`.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      disabled,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const [on, setOn] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        className={cx(
          'strk-switch',
          'strk-focus-ring',
          `strk-switch--${size}`,
          on && 'is-on',
          className,
        )}
        onClick={composeEventHandlers(onClick, () => setOn((v) => !v))}
        {...rest}
      >
        <span className="strk-switch__thumb" aria-hidden="true" />
      </button>
    );
  },
);
