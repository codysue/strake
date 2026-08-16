import * as React from 'react';
import { cx } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. @default 'primary' */
  variant?: ButtonVariant;
  /** Control height. @default 'md' */
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy, and blocks interaction. */
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * The workhorse button. `loading` keeps the label's footprint so the control
 * doesn't reflow, and reports `aria-busy` to assistive tech.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          'strk-button',
          'strk-focus-ring',
          `strk-button--${variant}`,
          `strk-button--${size}`,
          fullWidth && 'strk-button--full',
          loading && 'is-loading',
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <span className="strk-button__spinner" aria-hidden="true" />}
        {leftIcon && (
          <span className="strk-button__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="strk-button__label">{children}</span>
        {rightIcon && (
          <span className="strk-button__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);
