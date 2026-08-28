import { crossFrameworkComponents } from "@nifrajs/ui-adapters"

export type CatalogCategory =
  | "foundation"
  | "action"
  | "form"
  | "navigation"
  | "overlay"
  | "feedback"
  | "data"
  | "agent"
export type ComponentKind = "standard" | "foundation" | "agent" | "recipe"
export type ComponentStatus = "implemented" | "planned"
export type ComponentTarget =
  | "react"
  | "vue"
  | "svelte"
  | "solid"
  | "web-components"
export type ComponentTargetStatus = "reference" | "alpha" | "planned"
export type ComponentExample = {
  title: string
  description: string
  code: string
}
export type ComponentDocs = {
  install: {
    command: string
    manual: string
  }
  usageNotes: string
  examples: ComponentExample[]
}

export type ComponentMeta = {
  name: string
  category: CatalogCategory
  description: string
  status: ComponentStatus
  sourceFiles: string[]
  exportName: string
  states: string[]
  accessibility: string[]
  agentNotes: string[]
  kind: ComponentKind
  installCommand: string
  importCode: string
  usageCode: string
  dependencies: string[]
  variants: string[]
  targets: Record<ComponentTarget, ComponentTargetStatus>
  previewStatus: "live"
  docs: ComponentDocs
}

const groups: Record<CatalogCategory, string[]> = {
  foundation: [
    "ThemeProvider",
    "ThemeScript",
    "Icon",
    "AspectRatio",
    "Direction",
    "Marker",
    "Typography",
    "Portal",
    "Slot",
    "VisuallyHidden",
    "FocusRing",
    "Container",
    "Stack",
    "Inline",
    "Grid",
    "Separator",
    "ScrollArea",
  ],
  action: [
    "Button",
    "IconButton",
    "ButtonGroup",
    "Link",
    "LinkButton",
    "Toggle",
    "ToggleGroup",
    "Badge",
    "Tag",
    "Avatar",
    "AvatarGroup",
    "Kbd",
    "Code",
    "CodeBlock",
    "Card",
    "Callout",
    "Attachment",
    "Bubble",
    "Carousel",
    "Chart",
  ],
  form: [
    "Form",
    "Field",
    "Label",
    "Description",
    "FieldError",
    "Input",
    "InputGroup",
    "Textarea",
    "PasswordField",
    "SearchField",
    "NumberField",
    "Checkbox",
    "CheckboxGroup",
    "RadioGroup",
    "Switch",
    "Select",
    "Combobox",
    "MultiSelect",
    "Slider",
    "DatePicker",
    "Calendar",
    "TimeField",
    "OTPInput",
    "InputOTP",
    "FileField",
    "NativeSelect",
    "Questionnaire",
  ],
  navigation: [
    "Tabs",
    "TabList",
    "Tab",
    "TabPanel",
    "Accordion",
    "Collapsible",
    "Breadcrumbs",
    "Breadcrumb",
    "Pagination",
    "Stepper",
    "Menu",
    "DropdownMenu",
    "ContextMenu",
    "Menubar",
    "NavigationMenu",
    "Sidebar",
    "Toolbar",
  ],
  overlay: [
    "Dialog",
    "AlertDialog",
    "Drawer",
    "Sheet",
    "Popover",
    "Tooltip",
    "HoverCard",
    "Toast",
    "Toaster",
    "Command",
    "CommandInput",
    "CommandList",
  ],
  feedback: [
    "Alert",
    "Banner",
    "Progress",
    "ProgressCircle",
    "Meter",
    "Spinner",
    "Skeleton",
    "LoadingOverlay",
    "EmptyState",
    "Empty",
    "ErrorState",
    "Result",
    "Status",
  ],
  data: [
    "Table",
    "DataTable",
    "DataGrid",
    "List",
    "ListItem",
    "Item",
    "DescriptionList",
    "Stat",
    "StatsGrid",
    "Timeline",
    "Tree",
    "FileList",
    "DiffViewer",
    "ResizablePanels",
    "Resizable",
  ],
  agent: [
    "PromptComposer",
    "Conversation",
    "Message",
    "MessageGroup",
    "MessageScroller",
    "StreamingText",
    "ToolCall",
    "ToolStatus",
    "ApprovalCard",
    "HumanApproval",
    "RunTimeline",
    "CitationList",
    "SourceCard",
    "ModelPicker",
    "TokenUsage",
    "ActivityFeed",
  ],
}

const descriptions: Partial<Record<string, string>> = {
  Button: "An action with explicit intent and typed visual tone.",
  Dialog: "A modal surface requiring focused human attention.",
  PromptComposer: "A safe, clear input surface for agent instructions.",
  ApprovalCard: "A visible human gate before a consequential agent action.",
  ToolCall: "A transparent record of an agent tool invocation.",
  ThemeProvider: "A semantic token context for light, dark, and high contrast.",
  AspectRatio: "A media-safe frame that preserves a predictable shape.",
  Accordion: "A stacked set of collapsible panels for progressive disclosure.",
  Alert: "A visible message for important status, context, or recovery.",
  AlertDialog:
    "A modal confirmation for actions that need an explicit decision.",
  Avatar: "A compact identity marker with an image or generated initials.",
  Badge: "A compact status label for scanning state at a glance.",
  ButtonGroup: "A related set of actions kept together as one control group.",
  Calendar: "A month view for choosing a single date with visible selection.",
  Card: "A composable surface with header, body, and footer regions.",
  Checkbox:
    "A binary or indeterminate control for selecting one or more values.",
  Collapsible:
    "A single disclosure control for showing or hiding supporting content.",
  Combobox:
    "A searchable field for filtering and selecting from known options.",
  Command: "A searchable command surface for keyboard-first actions.",
  ContextMenu: "A contextual action menu attached to a user-selected surface.",
  DataTable:
    "A typed table that renders structured rows and custom cell content.",
  DatePicker:
    "A labelled date trigger with an anchored calendar for scheduling and form input.",
  Drawer:
    "A side panel for focused detail while preserving the current context.",
  DropdownMenu: "A compact menu of related actions opened from a trigger.",
  Empty: "A calm, actionable state for a surface with no records yet.",
  Field: "A field boundary that connects labels, controls, help, and errors.",
  HoverCard:
    "A lightweight preview that reveals supporting context on hover or focus.",
  Input:
    "A single-line text control with themeable focus and validation states.",
  InputGroup:
    "A field composition that adds leading or trailing context to an input.",
  InputOTP: "A segmented one-time-password control with per-digit labelling.",
  Item: "A flexible list row with icon, content, description, and action slots.",
  Kbd: "A small keycap treatment for communicating keyboard shortcuts.",
  Label: "A semantic label that names a form control.",
  Marker: "An inline highlight for important context without extra chrome.",
  Menubar: "A horizontal menu bar for top-level application actions.",
  Message: "A conversation message with human and agent visual roles.",
  MessageScroller:
    "A bounded conversation stream that keeps message rhythm readable.",
  NativeSelect: "A styled select that preserves native platform behavior.",
  NavigationMenu: "A semantic navigation row for moving between related areas.",
  Pagination: "A compact control for moving through a finite result set.",
  Popover:
    "A contextual surface anchored to a trigger without leaving the page.",
  Progress:
    "A determinate progress indicator with an accessible numeric value.",
  Questionnaire:
    "A guided single-choice question with descriptions per option.",
  RadioGroup: "A single-choice group with native keyboard and form semantics.",
  Resizable:
    "A two-pane surface with a visible, user-controlled split boundary.",
  ScrollArea:
    "A bounded scrolling region that keeps surrounding layout stable.",
  Select: "A styled native select with explicit options and keyboard behavior.",
  Separator: "A quiet visual or semantic rule between related regions.",
  Sidebar: "A persistent navigation region paired with a primary workspace.",
  Skeleton:
    "A loading placeholder that preserves the shape of incoming content.",
  Slider: "A range input for choosing a numeric value on a continuous scale.",
  Spinner:
    "A compact progress indicator for work with no known completion time.",
  Switch: "A two-state preference control with switch semantics.",
  Table: "A semantic table wrapper with accessible caption and scroll support.",
  Tabs: "A view switcher that exposes one content panel at a time.",
  Textarea: "A multiline text control for notes, prompts, or longer content.",
  Toast: "A transient status message with optional dismissal.",
  Toggle: "A two-state action that communicates its pressed state.",
  ToggleGroup: "A group of related toggle actions for choosing a view or mode.",
  Tooltip: "A short explanation revealed on hover or keyboard focus.",
}

const standardNames = new Set([
  "Accordion",
  "Alert",
  "AlertDialog",
  "AspectRatio",
  "Attachment",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Bubble",
  "Button",
  "ButtonGroup",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "ContextMenu",
  "DataTable",
  "DatePicker",
  "Dialog",
  "Direction",
  "Drawer",
  "DropdownMenu",
  "Empty",
  "Field",
  "Form",
  "HoverCard",
  "Input",
  "InputGroup",
  "InputOTP",
  "Item",
  "Kbd",
  "Label",
  "Marker",
  "Menubar",
  "Message",
  "MessageScroller",
  "NativeSelect",
  "NavigationMenu",
  "Pagination",
  "Popover",
  "Progress",
  "Questionnaire",
  "RadioGroup",
  "Resizable",
  "ScrollArea",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "ToggleGroup",
  "Tooltip",
  "Typography",
])

const crossFrameworkNames = new Set<string>(crossFrameworkComponents)

const usageExamples: Partial<Record<string, string>> = {
  Button: `import { Button } from "@nifrajs/ui"

export function SaveButton() {
  return <Button tone="primary">Save changes</Button>
}`,
  Card: `import { Card, CardBody, CardHeader } from "@nifrajs/ui"

export function ReviewCard() {
  return (
    <Card>
      <CardHeader><strong>Review</strong></CardHeader>
      <CardBody>Ready for a human decision.</CardBody>
    </Card>
  )
}`,
  Input: `import { Field, Input } from "@nifrajs/ui"

export function WorkspaceField() {
  return (
    <Field label="Workspace" htmlFor="workspace">
      <Input id="workspace" placeholder="Northstar" />
    </Field>
  )
}`,
  Form: `import { Button, Field, Form, Input } from "@nifrajs/ui"

export function WorkspaceForm() {
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Field label="Workspace" htmlFor="workspace">
        <Input id="workspace" defaultValue="Northstar" />
      </Field>
      <Button type="submit" tone="primary">Save workspace</Button>
    </Form>
  )
}`,
  DataTable: `import { Badge, DataTable } from "@nifrajs/ui"

const runs = [
  { id: "run-042", name: "Route audit", owner: "Maya Chen", status: "Ready" },
  { id: "run-041", name: "Schema check", owner: "Sam Lee", status: "Review" },
]

export function RunTable() {
  return (
    <DataTable
      caption="Recent runs"
      data={runs}
      rowKey="id"
      responsive="auto"
      columns={[
        { key: "name", header: "Run" },
        { key: "owner", header: "Owner" },
        {
          key: "status",
          header: "Status",
          render: (value) => <Badge tone={value === "Ready" ? "accent" : "neutral"}>{String(value)}</Badge>,
        },
      ]}
    />
  )
}`,
  Dialog: `import { Button, Dialog } from "@nifrajs/ui"

export function ReviewDialog() {
  return (
    <Dialog title="Review proposal" trigger={<Button>Open review</Button>}>
      The agent prepared a reversible change.
    </Dialog>
  )
}`,
  Chart: `import { Chart } from "@nifrajs/ui"

export function UsageChart() {
  return <Chart data={[18, 24, 21, 36, 31, 44]} label="Weekly usage" />
}`,
  Questionnaire: `import { Questionnaire } from "@nifrajs/ui"

export function RiskQuestion() {
  return (
    <Questionnaire
      question="How should this run behave?"
      options={[
        { value: "review", label: "Ask before applying" },
        { value: "draft", label: "Draft only" },
      ]}
      defaultValue="review"
    />
  )
}`,
  ApprovalCard: `import { ApprovalCard } from "@nifrajs/ui"

export function Approval() {
  return (
    <ApprovalCard
      title="A human decision is required"
      description="The agent prepared a reversible change."
      approveLabel="Approve & apply"
    />
  )
}`,
}

const stateOverrides: Partial<Record<string, string[]>> = {
  Accordion: ["collapsed", "expanded", "keyboard-focus"],
  AspectRatio: ["default", "responsive"],
  Attachment: ["ready", "uploading", "error", "removable"],
  AlertDialog: ["closed", "open", "escape-to-close", "destructive"],
  Avatar: ["image", "initials", "fallback"],
  Badge: ["neutral", "accent", "danger"],
  Button: ["default", "hover", "focus", "active", "disabled"],
  Breadcrumb: ["linked", "current", "keyboard-focus"],
  Bubble: ["agent", "human"],
  Carousel: ["first", "middle", "last", "keyboard-focus"],
  Chart: ["empty", "populated", "labeled"],
  Checkbox: [
    "unchecked",
    "checked",
    "indeterminate",
    "focus",
    "disabled",
    "invalid",
  ],
  Dialog: ["closed", "open", "escape-to-close", "dismissible"],
  ContextMenu: ["closed", "open", "keyboard-focus"],
  DataTable: [
    "empty",
    "loading",
    "populated",
    "custom-cell",
    "sortable",
    "selectable",
    "responsive-scroll",
    "responsive-stack",
  ],
  DatePicker: ["empty", "selected", "focus", "disabled", "invalid"],
  Direction: ["ltr", "rtl"],
  Drawer: ["closed", "open", "escape-to-close", "dismissible"],
  Empty: ["empty", "with-action"],
  Field: ["default", "description", "error", "disabled"],
  Form: ["default", "invalid", "submitting"],
  HoverCard: ["hidden", "hover", "focus"],
  Input: ["empty", "filled", "focus", "disabled", "invalid"],
  InputGroup: ["default", "with-prefix", "with-suffix"],
  InputOTP: ["empty", "partial", "complete", "focus", "disabled"],
  Item: ["default", "with-description", "with-action"],
  Label: ["default", "disabled"],
  Menubar: ["default", "keyboard-focus"],
  Message: ["human", "agent"],
  MessageScroller: ["empty", "populated", "scrolling"],
  NativeSelect: ["unselected", "selected", "disabled"],
  NavigationMenu: ["default", "active", "keyboard-focus"],
  Pagination: ["first", "middle", "last", "disabled"],
  Popover: ["closed", "open", "keyboard-focus"],
  Progress: ["zero", "determinate", "complete"],
  Questionnaire: ["unselected", "selected", "disabled"],
  RadioGroup: ["unselected", "selected", "focus", "disabled"],
  Resizable: ["default", "dragging"],
  ScrollArea: ["top", "scrolling", "bottom"],
  Select: ["closed", "open", "selected", "disabled"],
  Separator: ["horizontal"],
  Sheet: ["closed", "open", "escape-to-close", "dismissible"],
  Sidebar: ["default", "with-navigation"],
  Skeleton: ["loading"],
  Slider: ["min", "default", "max", "focus", "disabled"],
  Spinner: ["loading"],
  Switch: ["off", "on", "focus", "disabled"],
  Table: ["empty", "populated", "scrolling"],
  Tabs: ["active", "inactive", "keyboard-focus"],
  Textarea: ["empty", "filled", "focus", "disabled", "invalid"],
  Toast: ["visible", "dismissed", "action"],
  Toggle: ["off", "on", "focus", "disabled"],
  ToggleGroup: ["none", "selected", "keyboard-focus"],
  Tooltip: ["hidden", "hover", "focus"],
  Typography: ["display", "lead", "body", "muted"],
}

const variantOverrides: Partial<Record<string, string[]>> = {
  Alert: ["neutral", "success", "danger"],
  Badge: ["neutral", "accent", "danger"],
  Button: ["neutral", "primary", "danger", "ghost", "sm", "lg"],
  Checkbox: ["basic", "indeterminate", "invalid", "disabled"],
  Dialog: ["default", "with-description", "with-footer"],
  Form: ["default", "with-validation", "with-actions"],
  Input: ["default", "invalid", "disabled"],
  Progress: ["determinate", "complete"],
  RadioGroup: ["default", "with-description"],
  Select: ["native", "with-options"],
  Switch: ["off", "on", "disabled"],
  Tabs: ["default", "with-render-function"],
  Toggle: ["off", "on", "disabled"],
  Tooltip: ["hover", "focus"],
}

const docsNotes: Partial<Record<string, string>> = {
  Accordion:
    "Pass stable value, title, and content records. The component keeps one panel open at a time and exposes aria-expanded on every trigger.",
  Alert:
    "Use tone=success, neutral, or danger to communicate the result without making the message depend on color alone.",
  AlertDialog:
    "Use for an explicit destructive decision. The alert dialog keeps focus inside the modal and requires the user to choose an action.",
  AspectRatio:
    "Wrap media or embeds with ratio={width / height} to preserve the frame while its width changes.",
  Attachment:
    "Use name, size, and status to show a file through ready, uploading, or error states; pass onRemove when removal is allowed.",
  Avatar:
    "Provide a name for an accessible fallback; add src when an image is available. The fallback remains useful when the image fails to load.",
  Badge:
    "Use neutral, accent, or danger for compact state labels. Keep the text meaningful when the badge is read without its surrounding row.",
  Breadcrumb:
    "Pass ordered items with href for linked ancestors and omit href for the current location.",
  Button:
    "Choose a semantic tone and size, then use the native button props for disabled, type, and event handling.",
  ButtonGroup:
    "Compose related Button instances inside ButtonGroup when the actions belong to one decision or toolbar.",
  Calendar:
    "Use an ISO date string (YYYY-MM-DD). defaultValue creates an uncontrolled selection; value and onChange make it controlled.",
  Card: "Compose Card with CardHeader, CardBody, and CardFooter so hierarchy remains visible in source and in the rendered surface.",
  Carousel:
    "Pass an ordered slides array and an accessible label. Previous and next controls wrap around and announce the active slide.",
  Chart:
    "Pass numeric data and optional labels. The SVG has an accessible label, gridlines, points, and a visible axis label row.",
  Checkbox:
    "Use defaultChecked for uncontrolled state, or checked with onCheckedChange for controlled state. The control supports checked, unchecked, indeterminate, invalid, and disabled states.",
  Collapsible:
    "Use for one disclosure surface. defaultOpen controls the initial state and the trigger exposes aria-expanded.",
  Combobox:
    "Pass value/label options. Focus opens the list, typing filters it, Enter selects the first match, Escape closes it, and onValueChange receives the selected value.",
  Command:
    "Use for keyboard-first filtering of a known action list. Keep each value stable and use hint for a visible shortcut key.",
  ContextMenu:
    "Wrap the surface users should act on. A right click or Shift+F10 opens the menu; Escape and outside click close it.",
  DataTable:
    "Provide typed data and columns, give each row a stable rowKey, and use render for badges, links, or other custom cell surfaces. The table supports controlled sorting, loading and empty rows, responsive scroll or stack layouts, optional striping, and controlled or uncontrolled row selection. Use responsive=auto to stack rows inside narrow containers. Empty data renders an accessible empty row.",
  DatePicker:
    "DatePicker is a composition of a labelled trigger, hidden form value, Popover, and Calendar. Use ISO date strings for stable form data.",
  Dialog:
    "Use title and description to give the modal an accessible name and description. The trigger, close button, Escape key, and backdrop manage the open state.",
  Direction:
    "Scope dir=ltr or dir=rtl to the smallest region that needs it so surrounding layout keeps its existing direction.",
  Drawer:
    "Use Drawer for focused detail that should preserve the current context. It shares Dialog semantics and enters from the side.",
  DropdownMenu:
    "Use for actions attached to a button. The menu exposes menu/menuitem roles and closes on selection, Escape, or outside click.",
  Empty:
    "Give an empty surface a title, explanation, and one useful next action instead of leaving the user at a dead end.",
  Field:
    "Use label, htmlFor, description, and error to keep the control boundary and its supporting text together.",
  Form: "Use Form as the semantic submission boundary, then compose Field, controls, validation copy, and explicit submit actions inside it.",
  HoverCard:
    "Use for non-essential supporting context. Keep the child focusable so keyboard users can reveal the same content.",
  Input:
    "Use the native input props for name, type, validation, and events. Field supplies the visible label and supporting copy.",
  InputGroup:
    "Place leading or trailing context in start/end while keeping the actual Input as the editable control.",
  InputOTP:
    "Use defaultValue for an editable uncontrolled code, or value/onChange for controlled verification flows. Paste fills consecutive digits.",
  Item: "Use icon, title, description, and action slots to build readable list rows without inventing one-off layout CSS.",
  Kbd: "Use Kbd for a visible shortcut hint that should remain legible next to an action.",
  Label: "Use htmlFor to connect a label to a native control by id.",
  Marker:
    "Use Marker to highlight a short evidence phrase without changing its meaning.",
  Menubar:
    "Compose top-level actions inside Menubar and keep each action keyboard reachable.",
  Message:
    "Set role=human or role=agent so conversation ownership is visible in both color and alignment.",
  MessageScroller:
    "Pass ordered messages and maxHeight to keep a conversation readable inside a bounded surface.",
  NativeSelect:
    "Use when native platform selection is the priority. Pass options or normal select children.",
  NavigationMenu: "Pass labelled links for a semantic primary navigation row.",
  Pagination:
    "Pass the current page and total pages; onPageChange receives the requested page while boundary buttons disable themselves.",
  Popover:
    "Use for contextual content anchored to a trigger. It supports controlled or defaultOpen state and closes on Escape or outside click.",
  Progress:
    "Pass a value from 0 to 100 and a label when the percentage needs a visible explanation.",
  Questionnaire:
    "Use for a single guided decision. Each option can carry a description and the selected value is exposed through native radios.",
  RadioGroup:
    "Use for mutually exclusive options. legend, description, and per-option descriptions keep the group understandable.",
  Resizable:
    "Pass two panes as children. defaultSplit sets the initial percentage and the range control provides an accessible resize affordance.",
  ScrollArea:
    "Use around long content when the surrounding frame must remain stable; the region keeps native keyboard and wheel scrolling.",
  Select:
    "Select intentionally preserves native platform behavior. Pass options or normal select children and use standard select props.",
  Separator: "Use as a visual or semantic rule between related regions.",
  Sheet:
    "Use Sheet for a persistent side surface with a title, optional description, and closable content.",
  Sidebar:
    "Use Sidebar for persistent navigation paired with workspace content; compose Menu or custom navigation inside it.",
  Skeleton:
    "Match width and height to the incoming content so loading does not shift the layout.",
  Slider:
    "Use native range props such as min, max, step, value, and defaultValue; add an accessible label.",
  Spinner:
    "Use for work with no known completion time and give it a useful status label.",
  Switch:
    "Use for an immediate on/off preference. The button exposes role=switch and aria-checked, and supports controlled or uncontrolled state.",
  Table:
    "Use caption plus thead/tbody/tfoot to keep tabular data readable to assistive technology and visually scannable.",
  Tabs: "Pass tab items and either static children or a render function. Arrow keys, Home, and End move and select tabs.",
  Textarea:
    "Use native textarea props for longer input and pair it with Field for labels, helper text, and errors.",
  Toast:
    "Use for a transient result that can be dismissed. Control visibility with open and onOpenChange.",
  Toggle:
    "Use for a reversible action that has a pressed state; defaultPressed or pressed controls state and onPressedChange reports it.",
  ToggleGroup:
    "Use for a single selected view or mode. value/defaultValue identify the option and onValueChange reports changes.",
  Tooltip:
    "Keep content short and supplemental. It appears on pointer hover and keyboard focus and is connected with aria-describedby.",
  Typography:
    "Use semantic as plus display, lead, body, or muted variant instead of adding one-off type styles.",
}

const docsOverrides: Partial<Record<string, ComponentExample[]>> = {
  Checkbox: [
    {
      title: "Basic",
      description: "Use an uncontrolled checkbox for a simple form field.",
      code: `import { Checkbox, Label } from "@nifrajs/ui"\n\nexport function TermsField() {\n  return (\n    <div>\n      <Checkbox id="terms" />\n      <Label htmlFor="terms">Accept terms and conditions</Label>\n    </div>\n  )\n}`,
    },
    {
      title: "Controlled",
      description: "Use checked and onCheckedChange when state lives in React.",
      code: `import * as React from "react"\nimport { Checkbox } from "@nifrajs/ui"\n\nexport function ControlledCheckbox() {\n  const [checked, setChecked] = React.useState(false)\n  return <Checkbox checked={checked} onCheckedChange={setChecked} />\n}`,
    },
    {
      title: "Invalid state",
      description:
        "Expose validation through aria-invalid at the control boundary.",
      code: `import { Checkbox, Field, FieldError } from "@nifrajs/ui"\n\nexport function InvalidCheckbox() {\n  return (\n    <Field label="Notifications" htmlFor="notifications">\n      <Checkbox id="notifications" aria-invalid="true" />\n      <FieldError>Choose an option before continuing.</FieldError>\n    </Field>\n  )\n}`,
    },
    {
      title: "Description",
      description:
        "Pair the control with helper text when the choice needs context.",
      code: `import { Checkbox, Field } from "@nifrajs/ui"\n\nexport function NotificationField() {\n  return (\n    <Field label="Notifications" htmlFor="notifications" description="You can change this preference at any time.">\n      <Checkbox id="notifications" label="Enable notifications" defaultChecked />\n    </Field>\n  )\n}`,
    },
    {
      title: "Disabled",
      description:
        "Use disabled when the option is unavailable in the current state.",
      code: `import { Checkbox } from "@nifrajs/ui"\n\nexport function DisabledCheckbox() {\n  return <Checkbox label="Enable notifications" disabled />\n}`,
    },
    {
      title: "Group",
      description: "Use CheckboxGroup for a labelled list of related choices.",
      code: `import { CheckboxGroup } from "@nifrajs/ui"\n\nexport function DesktopItems() {\n  return (\n    <CheckboxGroup\n      legend="Show these items on the desktop"\n      defaultValue={["hard-disks", "external-disks"]}\n      options={[\n        { value: "hard-disks", label: "Hard disks" },\n        { value: "external-disks", label: "External disks" },\n        { value: "servers", label: "Connected servers" },\n      ]}\n    />\n  )\n}`,
    },
    {
      title: "Table",
      description:
        "Use labelled controls in table headers and rows for bulk selection.",
      code: `import { Checkbox, Table } from "@nifrajs/ui"\n\nexport function MemberTable() {\n  return (\n    <Table caption="Project members">\n      <thead>\n        <tr>\n          <th><Checkbox aria-label="Select all members" /></th>\n          <th>Name</th>\n          <th>Role</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td><Checkbox aria-label="Select Sarah Chen" defaultChecked /></td>\n          <td>Sarah Chen</td>\n          <td>Admin</td>\n        </tr>\n      </tbody>\n    </Table>\n  )\n}`,
    },
    {
      title: "RTL",
      description:
        "Wrap the control in Direction when a section needs right-to-left layout.",
      code: `import { Checkbox, Direction } from "@nifrajs/ui"\n\nexport function ArabicCheckbox() {\n  return (\n    <Direction dir="rtl">\n      <Checkbox label="قبول الشروط والأحكام" defaultChecked />\n    </Direction>\n  )\n}`,
    },
  ],
  Card: [
    {
      title: "Composition",
      description:
        "Compose header, body, and footer sections instead of styling a generic box.",
      code: `import { Button, Card, CardBody, CardFooter, CardHeader } from "@nifrajs/ui"\n\nexport function ReviewCard() {\n  return (\n    <Card>\n      <CardHeader><strong>Review proposal</strong></CardHeader>\n      <CardBody>The agent prepared a reversible change.</CardBody>\n      <CardFooter><Button tone="primary">Approve</Button></CardFooter>\n    </Card>\n  )\n}`,
    },
  ],
  Dialog: [
    {
      title: "Review flow",
      description: "Keep the trigger, description, body, and footer explicit.",
      code: `import { Button, Dialog } from "@nifrajs/ui"\n\nexport function ReviewDialog() {\n  return (\n    <Dialog title="Review proposal" description="The agent prepared a reversible change." trigger={<Button>Open review</Button>} footer={<Button tone="primary">Approve & apply</Button>}>\n      Three files will change. Nothing is applied until you approve.\n    </Dialog>\n  )\n}`,
    },
  ],
  Form: [
    {
      title: "Workspace form",
      description:
        "Keep the native form boundary and the visible field/action relationship explicit.",
      code: `import { Button, Field, Form, Input } from "@nifrajs/ui"\n\nexport function WorkspaceForm() {\n  return (\n    <Form onSubmit={(event) => event.preventDefault()}>\n      <Field label="Workspace" htmlFor="workspace">\n        <Input id="workspace" defaultValue="Northstar" />\n      </Field>\n      <Button type="submit" tone="primary">Save workspace</Button>\n    </Form>\n  )\n}`,
    },
  ],
  DataTable: [
    {
      title: "Typed rows with custom cells",
      description:
        "Give each row a stable key, use semantic custom cells, and opt into the interaction contracts you need. Sorting and selection are controlled at the application boundary, so server data and pagination stay yours.",
      code: `import { useState } from "react"\nimport { Badge, DataTable } from "@nifrajs/ui"\n\ntype Run = {\n  id: string\n  name: string\n  owner: string\n  status: "Ready" | "Review"\n}\n\nconst runs: Run[] = [\n  { id: "run-042", name: "Route audit", owner: "Maya Chen", status: "Ready" },\n  { id: "run-041", name: "Schema check", owner: "Sam Lee", status: "Review" },\n]\n\nexport function RunTable() {\n  const [selectedKeys, setSelectedKeys] = useState<string[]>([])\n  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")\n  const orderedRuns = [...runs].sort((a, b) =>\n    sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),\n  )\n\n  return (\n    <DataTable\n      caption="Recent runs"\n      data={orderedRuns}\n      rowKey="id"\n      minWidth="560px"\n      striped\n      selection={{\n        selectedKeys,\n        onSelectedKeysChange: (keys) => setSelectedKeys(keys.map(String)),\n        getRowLabel: (row) => String(row.name),\n      }}\n      sort={{\n        key: "name",\n        direction: sortDirection,\n        onChange: (_key, direction) => setSortDirection(direction),\n      }}\n      emptyState="No runs have been recorded."\n      columns={[\n        { key: "name", header: "Run", width: "44%", sortable: true },\n        { key: "owner", header: "Owner", width: "24%" },\n        {\n          key: "status",\n          header: "Status",\n          width: "32%",\n          render: (value) => (\n            <Badge size="sm" tone={value === "Ready" ? "accent" : "neutral"}>\n              {String(value)}\n            </Badge>\n          ),\n        },\n      ]}\n    />\n  )\n}`,
    },
  ],
  Table: [
    {
      title: "Accessible data",
      description:
        "Use a caption, scoped headers, semantic sections, and a footer when the table summarizes real tabular data.",
      code: `import { Badge, Table } from "@nifrajs/ui"\n\nexport function RunTable() {\n  return (\n    <Table caption="Recent runs" aria-label="Recent runs">\n      <thead>\n        <tr><th scope="col">Run</th><th scope="col">Status</th></tr>\n      </thead>\n      <tbody>\n        <tr><td>Route audit</td><td><Badge tone="accent">Ready</Badge></td></tr>\n        <tr><td>Schema check</td><td><Badge>Review</Badge></td></tr>\n      </tbody>\n      <tfoot>\n        <tr><td colSpan={2}>2 runs</td></tr>\n      </tfoot>\n    </Table>\n  )\n}`,
    },
  ],
  Tabs: [
    {
      title: "Content panels",
      description:
        "Use a render function when the active tab controls its panel content.",
      code: `import { Tabs } from "@nifrajs/ui"\n\nexport function RunTabs() {\n  return (\n    <Tabs items={[{ value: "overview", label: "Overview" }, { value: "activity", label: "Activity" }]}>\n      {(value) => value === "overview" ? <p>Run overview</p> : <p>Recent activity</p>}\n    </Tabs>\n  )\n}`,
    },
  ],
}

function docsFor(
  name: string,
  installCommand: string,
  usageCode: string,
): ComponentDocs {
  return {
    install: {
      command: installCommand,
      manual: `import { ${name} } from "@nifrajs/ui"`,
    },
    usageNotes:
      docsNotes[name] ??
      `Copy the complete example into a client-side React component, then customize the documented props for ${name}.`,
    examples: docsOverrides[name] ?? [
      {
        title: "Basic",
        description:
          docsNotes[name] ??
          `A complete ${name} example with the smallest useful contract.`,
        code: usageCode,
      },
    ],
  }
}

function usageFor(name: string): string {
  if (usageExamples[name]) return usageExamples[name]
  const wrap = (
    body: string,
    imports = name,
  ) => `import { ${imports} } from "@nifrajs/ui"

export function ${name}Example() {
  return (
    ${body}
  )
}`
  switch (name) {
    case "ThemeProvider":
      return wrap(
        '<ThemeProvider theme="dark"><main>Application content</main></ThemeProvider>',
      )
    case "ThemeScript":
      return `import { ThemeScript } from "@nifrajs/ui"

export function ThemeHead() {
  return <ThemeScript defaultTheme="dark" />
}`
    case "Icon":
      return wrap('<Icon label="Spark">✦</Icon>')
    case "AspectRatio":
      return wrap(
        '<AspectRatio ratio={16 / 9}><img src="/cover.jpg" alt="Cover" /></AspectRatio>',
      )
    case "Attachment":
      return wrap('<Attachment name="proposal.patch" size="4 KB" />')
    case "Avatar":
      return wrap('<Avatar name="Nifra" />')
    case "Breadcrumb":
      return wrap(
        '<Breadcrumb items={[{ label: "Docs" }, { label: "Components" }]} />',
      )
    case "Bubble":
      return wrap('<Bubble tone="accent">I will review it.</Bubble>')
    case "Carousel":
      return wrap(
        '<Carousel slides={[<div key="one">First slide</div>, <div key="two">Second slide</div>]} />',
      )
    case "Checkbox":
      return wrap('<Checkbox label="Require approval" defaultChecked />')
    case "Combobox":
      return wrap(
        '<Combobox options={[{ value: "safe", label: "Safe mode" }]} placeholder="Choose mode…" />',
      )
    case "Command":
      return wrap(
        '<Command items={[{ value: "inspect", label: "Inspect component" }]} />',
      )
    case "ContextMenu":
      return wrap(
        '<ContextMenu items={[{ label: "Inspect" }]}><span>Open menu</span></ContextMenu>',
      )
    case "DataTable":
      return wrap(
        '<DataTable data={[{ name: "Route" }]} columns={[{ key: "name", header: "Name" }]} />',
      )
    case "Dialog":
      return wrap(
        '<Dialog title="Review proposal" trigger={<Button>Open</Button>}>Review the change.</Dialog>',
        "Button, Dialog",
      )
    case "Direction":
      return wrap(
        '<Direction dir="rtl"><span>Scoped direction</span></Direction>',
      )
    case "Drawer":
      return wrap(
        '<Drawer title="Details" trigger={<Button>Open</Button>}>Focused detail.</Drawer>',
        "Button, Drawer",
      )
    case "DropdownMenu":
      return wrap(
        '<DropdownMenu label="Actions" items={[{ label: "Inspect" }]} />',
      )
    case "Empty":
      return wrap(
        '<Empty title="No results" description="Try another search." />',
      )
    case "Field":
      return wrap(
        '<Field label="Workspace" htmlFor="workspace"><Input id="workspace" /></Field>',
        "Field, Input",
      )
    case "HoverCard":
      return wrap(
        '<HoverCard content="More detail"><span>Hover here</span></HoverCard>',
      )
    case "InputGroup":
      return wrap(
        '<InputGroup start="$"><Input aria-label="Amount" /></InputGroup>',
        "Input, InputGroup",
      )
    case "InputOTP":
      return wrap('<InputOTP length={6} value="2048" />')
    case "Item":
      return wrap(
        '<Item icon="◇" title="Read contract" description="Succeeded" />',
      )
    case "Label":
      return wrap('<Label htmlFor="workspace">Workspace</Label>')
    case "Marker":
      return wrap("<p>Evidence is <Marker>marked in context</Marker>.</p>")
    case "Message":
      return wrap('<Message role="agent">Draft ready for review.</Message>')
    case "MessageScroller":
      return wrap(
        '<MessageScroller messages={[{ role: "agent", children: "Contract loaded." }]} />',
      )
    case "NativeSelect":
      return wrap(
        '<NativeSelect options={[{ value: "safe", label: "Safe mode" }]} />',
      )
    case "NavigationMenu":
      return wrap(
        '<NavigationMenu items={[{ label: "Docs", href: "/docs" }]} />',
      )
    case "Pagination":
      return wrap("<Pagination page={1} pages={4} />")
    case "Popover":
      return wrap(
        "<Popover trigger={<Button>Open</Button>}>Contextual detail.</Popover>",
        "Button, Popover",
      )
    case "Questionnaire":
      return wrap(
        '<Questionnaire question="Choose a mode" options={[{ value: "safe", label: "Safe mode" }]} />',
      )
    case "RadioGroup":
      return wrap(
        '<RadioGroup options={[{ value: "safe", label: "Safe mode" }]} defaultValue="safe" />',
      )
    case "Resizable":
      return wrap("<Resizable><div>Source</div><div>Preview</div></Resizable>")
    case "Sheet":
      return wrap(
        '<Sheet title="Details" trigger={<Button>Open</Button>}>Focused detail.</Sheet>',
        "Button, Sheet",
      )
    case "Sidebar":
      return wrap(
        '<Sidebar title="Workspace"><Menu items={[{ label: "Overview" }]} /></Sidebar>',
        "Menu, Sidebar",
      )
    case "Table":
      return wrap(
        "<Table><tbody><tr><td>Route</td><td>Ready</td></tr></tbody></Table>",
      )
    case "Tabs":
      return wrap(
        '<Tabs items={[{ value: "preview", label: "Preview" }]}><p>Content</p></Tabs>',
      )
    case "Toast":
      return wrap(
        '<Toast title="Saved" description="The contract is current." />',
      )
    case "ToggleGroup":
      return wrap(
        '<ToggleGroup options={[{ value: "all", label: "All" }]} defaultValue="all" />',
      )
    case "Tooltip":
      return wrap(
        '<Tooltip content="More detail"><span>Hover here</span></Tooltip>',
      )
    case "Typography":
      return wrap(
        '<Typography as="h2" variant="display">A clear heading</Typography>',
      )
    case "Link":
      return wrap('<Link href="/docs">Open documentation</Link>')
    case "LinkButton":
      return wrap('<LinkButton href="/start">Get started</LinkButton>')
    case "Tag":
      return wrap("<Tag>Source-owned</Tag>")
    case "Code":
      return wrap("<Code>nifra check</Code>")
    case "CodeBlock":
      return wrap('<CodeBlock code="$ nifra check\\n✓ contract verified" />')
    case "Callout":
      return wrap(
        '<Callout title="Heads up">This state is reversible.</Callout>',
      )
    case "Description":
      return wrap("<Description>Visible before the next action.</Description>")
    case "FieldError":
      return wrap(
        "<FieldError>Choose a workspace before continuing.</FieldError>",
      )
    case "Textarea":
      return wrap('<Textarea placeholder="Describe the change…" />')
    case "PasswordField":
      return wrap('<PasswordField aria-label="Password" />')
    case "SearchField":
      return wrap('<SearchField aria-label="Search" />')
    case "NumberField":
      return wrap('<NumberField aria-label="Quantity" />')
    case "CheckboxGroup":
      return wrap(
        '<CheckboxGroup options={[{ value: "review", label: "Require approval" }]} />',
      )
    case "MultiSelect":
      return wrap(
        '<MultiSelect options={[{ value: "agent", label: "Agent layer" }]} />',
      )
    case "Slider":
      return wrap(
        '<Slider aria-label="Confidence" defaultValue={72} max={100} />',
      )
    case "DatePicker":
      return wrap('<DatePicker aria-label="Choose date" />')
    case "Calendar":
      return wrap("<Calendar />")
    case "TimeField":
      return wrap('<TimeField aria-label="Choose time" />')
    case "OTPInput":
      return wrap('<OTPInput length={6} value="2048" />')
    case "FileField":
      return wrap('<FileField aria-label="Upload source" />')
    case "TabList":
      return wrap(
        "<TabList><Tab active>Preview</Tab><Tab>Code</Tab></TabList>",
        "Tab, TabList",
      )
    case "Tab":
      return wrap("<Tab active>Preview</Tab>")
    case "TabPanel":
      return wrap("<TabPanel><p>Panel content.</p></TabPanel>")
    case "Accordion":
      return wrap(
        '<Accordion items={[{ value: "one", title: "What does it do?", content: "It makes state explicit." }]} />',
      )
    case "Collapsible":
      return wrap(
        '<Collapsible title="Show contract">Readable source.</Collapsible>',
      )
    case "Breadcrumbs":
      return wrap(
        '<Breadcrumbs items={[{ label: "Docs" }, { label: "Components" }]} />',
      )
    case "Stepper":
      return wrap(
        '<Stepper steps={[{ label: "Draft" }, { label: "Review" }]} current={0} />',
      )
    case "Menu":
      return wrap('<Menu items={[{ label: "Overview" }]} />')
    case "AlertDialog":
      return wrap(
        '<AlertDialog title="Delete draft?" trigger={<Button>Delete</Button>}>This cannot be undone.</AlertDialog>',
        "AlertDialog, Button",
      )
    case "Toaster":
      return wrap(
        '<Toaster><Toast title="Saved" /></Toaster>',
        "Toast, Toaster",
      )
    case "CommandInput":
      return wrap('<CommandInput placeholder="Search commands…" />')
    case "CommandList":
      return wrap(
        '<CommandList><Button size="sm">Inspect</Button></CommandList>',
        "Button, CommandList",
      )
    case "Banner":
      return wrap(
        '<Banner title="Registry synced">The latest contract is loaded.</Banner>',
      )
    case "ProgressCircle":
      return wrap("<ProgressCircle value={72} />")
    case "Meter":
      return wrap('<Meter value={72} label="Confidence" />')
    case "Spinner":
      return wrap('<Spinner label="Loading" />')
    case "Skeleton":
      return wrap('<Skeleton width="100%" height={42} />')
    case "LoadingOverlay":
      return wrap(
        "<LoadingOverlay loading><p>Loading state</p></LoadingOverlay>",
      )
    case "EmptyState":
      return wrap(
        '<EmptyState title="Nothing here yet" description="Start a run to see activity." />',
      )
    case "ErrorState":
      return wrap('<ErrorState title="Could not load this" />')
    case "Result":
      return wrap(
        '<Result status="success" title="Verified" description="No drift found." />',
      )
    case "Status":
      return wrap('<Status tone="accent">Ready</Status>')
    case "DataGrid":
      return wrap(
        '<DataGrid data={[{ name: "Route" }]} columns={[{ key: "name", header: "Name" }]} />',
      )
    case "List":
      return wrap(
        '<List items={[{ title: "Read contract", description: "Succeeded" }]} />',
      )
    case "ListItem":
      return wrap("<ListItem><strong>Read contract</strong></ListItem>")
    case "DescriptionList":
      return wrap(
        '<DescriptionList items={[{ label: "Risk", value: "Low" }]} />',
      )
    case "Stat":
      return wrap('<Stat label="Coverage" value="72%" />')
    case "StatsGrid":
      return wrap(
        '<StatsGrid><Stat label="Routes" value="24" /></StatsGrid>',
        "Stat, StatsGrid",
      )
    case "Timeline":
      return wrap(
        '<Timeline items={[{ title: "Read contract", time: "now" }]} />',
      )
    case "Tree":
      return wrap('<Tree nodes={[{ label: "src", children: "components" }]} />')
    case "FileList":
      return wrap('<FileList files={[{ name: "route.ts", size: "4 KB" }]} />')
    case "DiffViewer":
      return wrap('<DiffViewer before="- old" after="+ new" />')
    case "ResizablePanels":
      return wrap(
        "<ResizablePanels><div>Source</div><div>Preview</div></ResizablePanels>",
      )
    case "PromptComposer":
      return wrap("<PromptComposer onSubmit={(value) => console.log(value)} />")
    case "Conversation":
      return wrap(
        '<Conversation><Message role="agent">Draft ready.</Message></Conversation>',
        "Conversation, Message",
      )
    case "MessageGroup":
      return wrap(
        '<MessageGroup><Message role="agent">Draft ready.</Message></MessageGroup>',
        "Message, MessageGroup",
      )
    case "StreamingText":
      return wrap(
        "<StreamingText streaming>Preparing the next step</StreamingText>",
      )
    case "ToolCall":
      return wrap(
        '<ToolCall name="nifra.validate" status="succeeded" input="{ scope: \'ui\' }" />',
      )
    case "ToolStatus":
      return wrap('<ToolStatus status="running" label="Preparing patch" />')
    case "HumanApproval":
      return wrap('<HumanApproval title="A human decision is required" />')
    case "RunTimeline":
      return wrap(
        '<RunTimeline runs={[{ title: "Read contract", status: "succeeded" }]} />',
      )
    case "CitationList":
      return wrap(
        '<CitationList citations={[{ title: "Route contract", excerpt: "Verified." }]} />',
      )
    case "SourceCard":
      return wrap(
        '<SourceCard title="Live contract" excerpt="Readable by people and agents." />',
      )
    case "ModelPicker":
      return wrap('<ModelPicker models={["Nifra Scout", "Codex review"]} />')
    case "TokenUsage":
      return wrap("<TokenUsage input={842} output={231} limit={2048} />")
    case "ActivityFeed":
      return wrap(
        '<ActivityFeed items={[{ title: "Registry synced", time: "now" }]} />',
      )
    default:
      return wrap(`<${name}>Example content</${name}>`)
  }
}

export const catalog: ComponentMeta[] = Object.entries(groups).flatMap(
  ([category, names]) =>
    names.map((name) => {
      const usageCode = usageFor(name)
      const installCommand = `bunx @nifrajs/ui-cli add ${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`
      return {
        name,
        category: category as CatalogCategory,
        description:
          descriptions[name] ??
          `${name} with StyleX tokens and an agent-readable contract.`,
        status: "implemented" as const,
        sourceFiles: ["src/components/components.tsx"],
        exportName: name,
        states: stateOverrides[name] ?? ["default", "focus", "disabled"],
        accessibility: [
          "semantic HTML",
          "keyboard reachable",
          "visible focus state",
        ],
        agentNotes: [
          "Prefer the documented variant API over styling strings.",
          "Inspect the registry before composing.",
        ],
        kind: standardNames.has(name)
          ? ("standard" as const)
          : category === "agent"
            ? ("agent" as const)
            : category === "foundation"
              ? ("foundation" as const)
              : ("recipe" as const),
        installCommand,
        importCode: `import { ${name} } from "@nifrajs/ui"`,
        usageCode,
        dependencies: ["react", "@stylexjs/stylex"],
        variants:
          variantOverrides[name] ??
          (standardNames.has(name) ? ["default", "customizable"] : ["default"]),
        targets: {
          react: "reference",
          vue: crossFrameworkNames.has(name) ? "alpha" : "planned",
          svelte: crossFrameworkNames.has(name) ? "alpha" : "planned",
          solid: crossFrameworkNames.has(name) ? "alpha" : "planned",
          "web-components": crossFrameworkNames.has(name) ? "alpha" : "planned",
        },
        previewStatus: "live" as const,
        docs: docsFor(name, installCommand, usageCode),
      }
    }),
)

export const catalogByName = Object.fromEntries(
  catalog.map((item) => [item.name, item]),
) as Record<string, ComponentMeta>

export const registry = {
  schemaVersion: "1.0",
  packageName: "@nifrajs/ui",
  styling: "StyleX",
  sourceOwned: true,
  components: catalog,
} as const

export const categoryLabels: Record<CatalogCategory, string> = {
  foundation: "Foundations",
  action: "Actions & content",
  form: "Forms & inputs",
  navigation: "Navigation",
  overlay: "Overlays",
  feedback: "Feedback & status",
  data: "Data display",
  agent: "Agent-native",
}
