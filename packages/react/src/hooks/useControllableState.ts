import * as React from 'react';

type SetStateAction<T> = T | ((prev: T) => T);

/**
 * Controlled/uncontrolled state in one hook. If `value` is provided the state
 * is controlled and updates flow only through `onChange`; otherwise the hook
 * owns the state and still notifies `onChange`.
 */
export function useControllableState<T>(params: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): readonly [T, (next: SetStateAction<T>) => void] {
  const { value, defaultValue, onChange } = params;
  const isControlled = value !== undefined;

  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const current = isControlled ? (value as T) : uncontrolled;

  // Keep the latest value in a ref so the setter can resolve updater functions
  // without being re-created on every render.
  const currentRef = React.useRef(current);
  React.useEffect(() => {
    currentRef.current = current;
  });

  const setValue = React.useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(currentRef.current)
          : next;
      if (Object.is(resolved, currentRef.current)) return;
      if (!isControlled) setUncontrolled(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue] as const;
}
