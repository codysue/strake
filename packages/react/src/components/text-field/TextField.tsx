import * as React from 'react';
import { cx } from '../../lib/utils';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message. When set, the field is marked aria-invalid and described by it. */
  error?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

/**
 * A labelled text input with description and error slots, wired for
 * accessibility: the label is associated by id, `aria-describedby` points at
 * whichever of description/error is present, and errors get `role="alert"` so
 * they're announced.
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      description,
      error,
      size = 'md',
      startAdornment,
      endAdornment,
      id,
      required,
      className,
      disabled,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const descId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    const invalid = error != null && error !== false;

    // Reference only ids that are actually rendered: the description element is
    // omitted when the field is invalid (the error replaces it).
    const describedBy =
      [description && !invalid ? descId : null, invalid ? errorId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className={cx('strk-field', `strk-field--${size}`, className)}>
        {label && (
          <label htmlFor={inputId} className="strk-field__label">
            {label}
            {required && (
              <span className="strk-field__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div
          className="strk-field__control strk-focus-ring"
          data-invalid={invalid || undefined}
          data-disabled={disabled || undefined}
        >
          {startAdornment && (
            <span className="strk-field__adornment" aria-hidden="true">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className="strk-field__input"
            required={required}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          {endAdornment && (
            <span className="strk-field__adornment" aria-hidden="true">
              {endAdornment}
            </span>
          )}
        </div>
        {description && !invalid && (
          <p id={descId} className="strk-field__description">
            {description}
          </p>
        )}
        {invalid && (
          <p id={errorId} className="strk-field__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
