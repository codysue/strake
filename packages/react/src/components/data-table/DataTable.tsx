import * as React from 'react';
import { cx } from '../../lib/utils';

export interface DataTableColumn<T> {
  /** Stable column id; also the default value accessor (row[key]). */
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: 'start' | 'end';
  /** Custom cell renderer. */
  render?: (row: T) => React.ReactNode;
  /** Value used for sorting; defaults to row[key]. */
  sortAccessor?: (row: T) => string | number;
}

export type SortDirection = 'asc' | 'desc';

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  caption?: React.ReactNode;
  defaultSort?: { key: string; direction: SortDirection };
  /** Makes rows focusable/roving and activatable with Enter/Space or click. */
  onRowActivate?: (row: T) => void;
  className?: string;
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <svg className="strk-table__sort-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 3.5l3 3.5H5z"
        fill="currentColor"
        opacity={direction === 'asc' ? 1 : 0.3}
      />
      <path
        d="M8 12.5l-3-3.5h6z"
        fill="currentColor"
        opacity={direction === 'desc' ? 1 : 0.3}
      />
    </svg>
  );
}

/**
 * A sortable, keyboard-navigable data table on native table semantics.
 * Sortable headers are real buttons and set `aria-sort`. When `onRowActivate`
 * is set, rows become a roving-tabindex group: Up/Down move focus, Home/End
 * jump, Enter/Space (or click) activate.
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  caption,
  defaultSort,
  onRowActivate,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; direction: SortDirection } | null>(
    defaultSort ?? null,
  );
  const [focusedRow, setFocusedRow] = React.useState(0);
  const rowRefs = React.useRef<Array<HTMLTableRowElement | null>>([]);
  const interactive = Boolean(onRowActivate);

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    const accessor =
      col?.sortAccessor ?? ((row: T) => (row as Record<string, unknown>)[sort.key] as string | number);
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });
  }, [data, sort, columns]);

  function toggleSort(key: string) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: 'asc' };
      return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
    });
  }

  function focusRow(index: number) {
    const clamped = Math.max(0, Math.min(index, sorted.length - 1));
    setFocusedRow(clamped);
    rowRefs.current[clamped]?.focus();
  }

  function onRowKeyDown(event: React.KeyboardEvent, row: T, index: number) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusRow(0);
        break;
      case 'End':
        event.preventDefault();
        focusRow(sorted.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onRowActivate?.(row);
        break;
      default:
        break;
    }
  }

  return (
    <div className={cx('strk-table__wrap', className)}>
      <table className="strk-table">
        {caption && <caption className="strk-table__caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              const ariaSort = !col.sortable
                ? undefined
                : active
                  ? sort!.direction === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none';
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cx(
                    'strk-table__th',
                    col.align === 'end' && 'strk-table__cell--end',
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="strk-table__sort strk-focus-ring"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span>{col.header}</span>
                      <SortIcon direction={active ? sort!.direction : null} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => {
            const id = getRowId(row);
            return (
              <tr
                key={id}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                className={cx('strk-table__row', interactive && 'is-interactive')}
                tabIndex={interactive ? (index === focusedRow ? 0 : -1) : undefined}
                onFocus={interactive ? () => setFocusedRow(index) : undefined}
                onClick={interactive ? () => onRowActivate?.(row) : undefined}
                onKeyDown={interactive ? (e) => onRowKeyDown(e, row, index) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      'strk-table__td',
                      col.align === 'end' && 'strk-table__cell--end',
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
