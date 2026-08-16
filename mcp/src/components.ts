// Hand-authored component catalog served by the MCP server. This is static,
// public API documentation — the same information in the README and Storybook.

export interface ComponentProp {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentMeta {
  name: string;
  category: 'Action' | 'Form' | 'Overlay' | 'Feedback' | 'Data';
  summary: string;
  import: string;
  props: ComponentProp[];
  a11y: string[];
  usage: string;
}

export const components: ComponentMeta[] = [
  {
    name: 'Button',
    category: 'Action',
    summary: 'The primary action control, with variants, sizes, and a loading state.',
    import: "import { Button } from '@codysue/strake';",
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual weight.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner, sets aria-busy, and blocks interaction without reflow.' },
      { name: 'leftIcon / rightIcon', type: 'ReactNode', description: 'Decorative icon slots (aria-hidden).' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
    ],
    a11y: [
      'Renders a native <button>; keyboard and focus come for free.',
      'loading sets aria-busy and disables the control.',
      'Focus-visible ring from the --strake-color-ring token.',
    ],
    usage: '<Button variant="primary" onClick={save}>Save</Button>',
  },
  {
    name: 'TextField',
    category: 'Form',
    summary: 'A labelled text input with description and error slots.',
    import: "import { TextField } from '@codysue/strake';",
    props: [
      { name: 'label', type: 'ReactNode', description: 'Associated to the input by id.' },
      { name: 'description', type: 'ReactNode', description: 'Helper text, linked via aria-describedby.' },
      { name: 'error', type: 'ReactNode', description: 'When set, marks the field aria-invalid and announces the message.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
      { name: 'startAdornment / endAdornment', type: 'ReactNode', description: 'Inline prefix/suffix content.' },
    ],
    a11y: [
      'Label associated by id; aria-describedby points at description or error.',
      'error sets aria-invalid and renders role="alert" so it is announced.',
      'Focus ring shown on the wrapper via :focus-within.',
    ],
    usage: '<TextField label="Email" error="Enter a valid email." />',
  },
  {
    name: 'Switch',
    category: 'Form',
    summary: 'A boolean toggle built on a native button with role="switch".',
    import: "import { Switch } from '@codysue/strake';",
    props: [
      { name: 'checked / defaultChecked', type: 'boolean', description: 'Controlled or uncontrolled state.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Change handler.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track size.' },
    ],
    a11y: [
      'role="switch" with aria-checked; Space/Enter toggle via the native button.',
      'Requires an aria-label or an associated <label>.',
    ],
    usage: '<Switch defaultChecked aria-label="Notifications" />',
  },
  {
    name: 'Select',
    category: 'Form',
    summary: 'An accessible custom select using the listbox pattern.',
    import: "import { Select } from '@codysue/strake';",
    props: [
      { name: 'options', type: 'Array<{ label; value; disabled? }>', description: 'The option set.' },
      { name: 'value / defaultValue', type: 'string | null', description: 'Controlled or uncontrolled selection.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Selection handler.' },
      { name: 'name', type: 'string', description: 'Emits a hidden input so the value posts with a form.' },
    ],
    a11y: [
      'role="listbox" / role="option" with aria-selected; trigger has aria-haspopup + aria-expanded.',
      'Full keyboard: Up/Down, Home/End, type-ahead, Enter/Space select, Escape close.',
      'Focus managed by Floating UI; positioning flips and stays in view.',
    ],
    usage: '<Select options={options} aria-label="Color" onValueChange={setColor} />',
  },
  {
    name: 'Tooltip',
    category: 'Overlay',
    summary: 'A descriptive tooltip on hover and keyboard focus.',
    import: "import { Tooltip } from '@codysue/strake';",
    props: [
      { name: 'content', type: 'ReactNode', description: 'Tooltip body (descriptive text only).' },
      { name: 'side', type: "Placement", default: "'top'", description: 'Preferred placement; flips to stay in view.' },
      { name: 'openDelay', type: 'number', default: '200', description: 'ms before opening on hover.' },
    ],
    a11y: [
      'Opens on hover AND focus; dismisses on Escape.',
      'role="tooltip" wired to the trigger via aria-describedby.',
      'Never place interactive content inside a tooltip.',
    ],
    usage: '<Tooltip content="Copy link"><Button>Copy</Button></Tooltip>',
  },
  {
    name: 'Popover',
    category: 'Overlay',
    summary: 'A click-triggered popover with managed focus.',
    import: "import { Popover } from '@codysue/strake';",
    props: [
      { name: 'trigger', type: 'ReactElement', description: 'The toggle element; receives aria-expanded/haspopup.' },
      { name: 'children', type: 'ReactNode', description: 'Panel content.' },
      { name: 'side', type: 'Placement', default: "'bottom-start'", description: 'Preferred placement.' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / handler', description: 'Controlled or uncontrolled.' },
    ],
    a11y: [
      'Focus moves into the panel on open and returns to the trigger on close.',
      'Escape and outside-click dismiss; exposed as role="dialog".',
    ],
    usage: '<Popover trigger={<Button>Edit</Button>}>…</Popover>',
  },
  {
    name: 'Dialog',
    category: 'Overlay',
    summary: 'A modal dialog with a hand-built focus trap and scroll lock.',
    import: "import { Dialog } from '@codysue/strake';",
    props: [
      { name: 'open / onOpenChange', type: 'boolean / handler', description: 'Controlled open state.' },
      { name: 'title / description', type: 'ReactNode', description: 'Auto-associated via aria-labelledby / aria-describedby.' },
      { name: 'footer', type: 'ReactNode', description: 'Action row (usually buttons).' },
      { name: 'initialFocusRef', type: 'RefObject<HTMLElement>', description: 'Element to focus on open.' },
    ],
    a11y: [
      'role="dialog" + aria-modal; focus trapped (Tab wraps), Escape closes, focus restored to trigger.',
      'Background scroll is locked while open.',
      'Enter/exit animated with Framer Motion, honoring prefers-reduced-motion.',
    ],
    usage: '<Dialog open={open} onOpenChange={setOpen} title="Delete?">…</Dialog>',
  },
  {
    name: 'CommandMenu',
    category: 'Overlay',
    summary: 'A ⌘K command palette (combobox + listbox) with fuzzy filtering.',
    import: "import { CommandMenu } from '@codysue/strake';",
    props: [
      { name: 'open / onOpenChange', type: 'boolean / handler', description: 'Controlled open state.' },
      { name: 'items', type: 'CommandItem[]', description: 'Commands with id, label, group, keywords, onSelect.' },
      { name: 'shortcut', type: 'boolean', default: 'true', description: 'Register a global ⌘K / Ctrl+K toggle.' },
    ],
    a11y: [
      'Input is role="combobox" driving a role="listbox" via aria-activedescendant.',
      'Arrow keys move the active option while focus stays in the input; Enter selects.',
      'Focus trapped; Escape or ⌘K closes.',
    ],
    usage: '<CommandMenu open={open} onOpenChange={setOpen} items={items} />',
  },
  {
    name: 'ToastProvider / useToast',
    category: 'Feedback',
    summary: 'An imperative toast system with an aria-live region.',
    import: "import { ToastProvider, useToast } from '@codysue/strake';",
    props: [
      { name: 'ToastProvider.placement', type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'", default: "'bottom-right'", description: 'Corner to stack in.' },
      { name: 'toast(options)', type: '{ title; description?; variant?; duration?; action? }', description: 'Imperative API from useToast().' },
    ],
    a11y: [
      'Portalled aria-live region; danger/warning are role="alert" (assertive), the rest role="status".',
      'Auto-dismiss pauses on hover.',
    ],
    usage: 'const { toast } = useToast(); toast({ title: "Saved", variant: "success" });',
  },
  {
    name: 'DataTable',
    category: 'Data',
    summary: 'A sortable, keyboard-navigable table on native table semantics.',
    import: "import { DataTable } from '@codysue/strake';",
    props: [
      { name: 'columns', type: 'DataTableColumn<T>[]', description: 'Column defs with header, sortable, align, render, sortAccessor.' },
      { name: 'data', type: 'T[]', description: 'Row data.' },
      { name: 'getRowId', type: '(row: T) => string', description: 'Stable row key.' },
      { name: 'onRowActivate', type: '(row: T) => void', description: 'Makes rows a roving-tabindex group, activatable with Enter/Space/click.' },
    ],
    a11y: [
      'Sortable headers are real buttons and set aria-sort.',
      'With onRowActivate, rows form a roving-tabindex group: Up/Down move, Home/End jump, Enter/Space activate.',
    ],
    usage: '<DataTable columns={columns} data={rows} getRowId={r => r.id} />',
  },
];
