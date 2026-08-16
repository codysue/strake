import * as React from 'react';

/** Tiny classnames joiner — truthy strings only, no dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  let out = '';
  for (const p of parts) {
    if (p) out += (out ? ' ' : '') + p;
  }
  return out;
}

/**
 * Compose a library event handler with a consumer's. The consumer's handler
 * runs first; if it calls preventDefault, the internal handler is skipped
 * (unless `checkForDefaultPrevented` is false).
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirHandler: ((event: E) => void) | undefined,
  ourHandler: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return (event) => {
    theirHandler?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ourHandler(event);
    }
  };
}

/** Merge multiple refs (callback or object) into one ref callback. */
export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref != null) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
