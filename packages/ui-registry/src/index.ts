export type CatalogCategory =
  | "foundation"
  | "action"
  | "form"
  | "navigation"
  | "overlay"
  | "feedback"
  | "data"
  | "agent"
export type ComponentStatus = "implemented" | "planned"

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
}

const groups: Record<CatalogCategory, string[]> = {
  foundation: [
    "ThemeProvider",
    "ThemeScript",
    "Icon",
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
    "FileField",
  ],
  navigation: [
    "Tabs",
    "TabList",
    "Tab",
    "TabPanel",
    "Accordion",
    "Collapsible",
    "Breadcrumbs",
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
    "DescriptionList",
    "Stat",
    "StatsGrid",
    "Timeline",
    "Tree",
    "FileList",
    "DiffViewer",
    "ResizablePanels",
  ],
  agent: [
    "PromptComposer",
    "Conversation",
    "Message",
    "MessageGroup",
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
  DataTable: "A typed data table with explicit columns and renderers.",
  PromptComposer: "A safe, clear input surface for agent instructions.",
  ApprovalCard: "A visible human gate before a consequential agent action.",
  ToolCall: "A transparent record of an agent tool invocation.",
  ThemeProvider: "A semantic token context for light, dark, and high contrast.",
}

export const catalog: ComponentMeta[] = Object.entries(groups).flatMap(
  ([category, names]) =>
    names.map((name) => ({
      name,
      category: category as CatalogCategory,
      description:
        descriptions[name] ??
        `${name} with StyleX tokens and an agent-readable contract.`,
      status: "implemented" as const,
      sourceFiles: ["src/components/components.tsx"],
      exportName: name,
      states: ["default", "focus", "disabled"],
      accessibility: [
        "semantic HTML",
        "keyboard reachable",
        "visible focus state",
      ],
      agentNotes: [
        "Prefer the documented variant API over styling strings.",
        "Inspect the registry before composing.",
      ],
    })),
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
