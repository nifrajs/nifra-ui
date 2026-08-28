import * as UI from "@nifrajs/ui"
import { adapterManifest } from "@nifrajs/ui-adapters"
import {
  type ComponentMeta,
  catalog,
  categoryLabels,
} from "@nifrajs/ui-registry"
import {
  ApprovalInboxScreen,
  exampleApprovalRequests,
  exampleReviewFiles,
  exampleReviewRun,
  exampleRunHistory,
  exampleWorkspaceSettings,
  OnboardingRecoveryScreen,
  ReviewWorkbench,
  RunHistoryScreen,
  screenManifests,
  WorkspaceSettingsScreen,
} from "@nifrajs/ui-screens"
import "../../packages/ui/src/tokens/global.css"
import "../../packages/ui-elements/src/styles.css"
import "../../packages/ui-elements/src/index"
import {
  type CSSProperties,
  createElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import "./docs.css"

type ThemeName = UI.ThemeName
type Section = "components" | "docs" | "build" | "screens" | "directory"
type CategoryFilter = "all" | ComponentMeta["category"]
type InspectorTab = "preview" | "install" | "usage" | "source" | "contract"

const categoryOrder: CategoryFilter[] = [
  "all",
  "foundation",
  "action",
  "form",
  "navigation",
  "overlay",
  "feedback",
  "data",
  "agent",
]

const categoryShortNames: Record<CategoryFilter, string> = {
  all: "Everything",
  ...categoryLabels,
}

const coreNames = catalog
  .filter((item) => item.kind === "standard")
  .map((item) => item.name)
const coreNameSet = new Set(coreNames)
const widePreviewNames = new Set(["Table", "DataTable", "DataGrid"])
const isWidePreview = (name: string) => widePreviewNames.has(name)
const sampleRows = [
  {
    surface: "Command palette",
    owner: "Agent runtime",
    state: "Ready",
    detail: "Keyboard-first actions",
  },
  {
    surface: "Approval flow",
    owner: "Human gate",
    state: "Review",
    detail: "Decision before apply",
  },
  {
    surface: "Route contract",
    owner: "Typed client",
    state: "Blocked",
    detail: "Needs a schema update",
  },
]
const sampleColumns = [
  {
    key: "surface" as const,
    header: "Surface",
    width: "42%",
    render: (value: unknown, row: (typeof sampleRows)[number]) => (
      <span className="table-primary-cell">
        <strong>{String(value)}</strong>
        <small>{row.detail}</small>
      </span>
    ),
  },
  { key: "owner" as const, header: "Owner", width: "28%" },
  {
    key: "state" as const,
    header: "State",
    width: "30%",
    render: (value: unknown) => (
      <UI.Badge
        tone={
          value === "Blocked"
            ? "danger"
            : value === "Ready"
              ? "accent"
              : "neutral"
        }
        size="sm"
      >
        {String(value)}
      </UI.Badge>
    ),
  },
]

type PreviewTableRow = {
  id: string
  name: string
  owner: string
  status: "Ready" | "Review" | "Blocked" | "Complete"
  updated: string
  files: number
}

const previewTableRows: PreviewTableRow[] = [
  {
    id: "run-042",
    name: "Route audit",
    owner: "Maya Chen",
    status: "Ready",
    updated: "2m ago",
    files: 3,
  },
  {
    id: "run-041",
    name: "Schema check",
    owner: "Sam Lee",
    status: "Review",
    updated: "18m ago",
    files: 7,
  },
  {
    id: "run-040",
    name: "MCP smoke test",
    owner: "Noah Kim",
    status: "Blocked",
    updated: "1h ago",
    files: 2,
  },
  {
    id: "run-039",
    name: "Client drift scan",
    owner: "Maya Chen",
    status: "Complete",
    updated: "3h ago",
    files: 12,
  },
]

function Mark() {
  return (
    <span className="wordmark-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}
function Arrow() {
  return <span aria-hidden="true">↗</span>
}
function Glyph({ children = "✦" }: { children?: ReactNode }) {
  return (
    <span className="preview-glyph" aria-hidden="true">
      {children}
    </span>
  )
}

function PreviewCaption({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string
  title: string
  detail?: string
}) {
  return (
    <div className="preview-caption">
      <span className="preview-caption-eyebrow">{eyebrow}</span>
      <strong>{title}</strong>
      {detail && <span>{detail}</span>}
    </div>
  )
}

function DataTableSpecimen({
  compact,
  inspector = false,
}: {
  compact: boolean
  inspector?: boolean
}) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<"name" | "updated">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["run-042"])
  const normalizedQuery = query.trim().toLowerCase()
  const rows = useMemo(() => {
    const filtered = previewTableRows.filter((row) =>
      [row.name, row.owner, row.status, row.id].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
    return [...filtered].sort((left, right) =>
      sortDirection === "asc"
        ? left[sortKey].localeCompare(right[sortKey])
        : right[sortKey].localeCompare(left[sortKey]),
    )
  }, [normalizedQuery, sortDirection, sortKey])
  const columns: Array<UI.DataTableColumn<PreviewTableRow>> = compact
    ? [
        {
          key: "name",
          header: "Run",
          width: "62%",
          sortable: true,
          render: (value, row) => (
            <span className="table-primary-cell">
              <strong>{String(value)}</strong>
              <small>
                {row.owner} · {row.id}
              </small>
            </span>
          ),
        },
        {
          key: "status",
          header: "Status",
          width: "38%",
          render: (value) => (
            <UI.Badge
              tone={
                value === "Blocked"
                  ? "danger"
                  : value === "Ready"
                    ? "accent"
                    : "neutral"
              }
              size="sm"
            >
              {compact && value === "Complete" ? "Done" : String(value)}
            </UI.Badge>
          ),
        },
      ]
    : [
        {
          key: "name",
          header: "Run",
          width: "47%",
          sortable: true,
          render: (value, row) => (
            <span className="table-primary-cell">
              <strong>{String(value)}</strong>
              <small>
                {row.owner} · {row.id}
              </small>
            </span>
          ),
        },
        {
          key: "status",
          header: "Status",
          width: "24%",
          render: (value) => (
            <UI.Badge
              tone={
                value === "Blocked"
                  ? "danger"
                  : value === "Ready"
                    ? "accent"
                    : "neutral"
              }
              size="sm"
            >
              {String(value)}
            </UI.Badge>
          ),
        },
        {
          key: "updated",
          header: "Updated",
          align: "right",
          width: "29%",
          sortable: true,
        },
      ]

  return (
    <div className={`data-table-specimen${compact ? " compact" : ""}`}>
      {!compact && (
        <div className="data-table-toolbar">
          <label className="data-table-search">
            <span className="sr-only">Filter runs</span>
            <UI.Input
              aria-label="Filter runs"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter runs…"
            />
          </label>
          <span className="data-table-selection">
            {selectedKeys.length > 0
              ? `${selectedKeys.length} selected`
              : "No rows selected"}
          </span>
          <UI.Button
            size="sm"
            tone="ghost"
            disabled={selectedKeys.length === 0}
            onClick={() => setSelectedKeys([])}
          >
            Clear selection
          </UI.Button>
        </div>
      )}
      <UI.DataTable
        caption="Recent runs"
        data={rows}
        columns={columns}
        rowKey="id"
        density={compact ? "compact" : "default"}
        // The compact gallery card stays a real horizontal table. The full
        // inspector switches to the same card-like stack used by the native
        // adapter when its container becomes narrow, so its headers and
        // primary-cell metadata remain readable instead of truncating.
        responsive={compact ? "scroll" : "auto"}
        minWidth="100%"
        striped={!compact}
        selection={
          compact
            ? undefined
            : {
                selectedKeys,
                onSelectedKeysChange: (keys) =>
                  setSelectedKeys(keys.map(String)),
                getRowLabel: (row) => `Select ${row.name}`,
              }
        }
        sort={
          compact
            ? undefined
            : {
                key: sortKey,
                direction: sortDirection,
                onChange: (key, direction) => {
                  if (key === "name" || key === "updated") {
                    setSortKey(key)
                    setSortDirection(direction)
                  }
                },
              }
        }
        emptyState={
          <span className="table-empty-state">No runs match this filter.</span>
        }
      />
      {!compact && (
        <div className="data-table-footer">
          <span>
            Showing {rows.length} of {previewTableRows.length} runs
          </span>
          <span className="data-table-footer-meta">Updated just now</span>
        </div>
      )}
    </div>
  )
}

function CoreSpecimen({
  name,
  compact,
  inspector = false,
}: {
  name: string
  compact: boolean
  inspector?: boolean
}) {
  const className = compact
    ? "preview-core preview-core-compact"
    : "preview-core"
  const content = (() => {
    switch (name) {
      case "Accordion":
        return (
          <div className="preview-surface preview-accordion-surface">
            <PreviewCaption
              eyebrow="Run configuration"
              title="What happens before apply?"
              detail="Three explicit checks keep the action reversible."
            />
            <UI.Accordion
              items={[
                {
                  value: "approval",
                  title: "Require human approval",
                  content: "The agent pauses before any file is changed.",
                },
                {
                  value: "scope",
                  title: "Limit the change scope",
                  content: "Only files in the selected package are eligible.",
                },
                {
                  value: "audit",
                  title: "Write an audit note",
                  content: "The final decision is recorded beside the run.",
                },
              ]}
            />
          </div>
        )
      case "Alert":
        return (
          <div className="preview-surface">
            <UI.Alert title="Registry synced" tone="success">
              The latest component contract is available locally.
            </UI.Alert>
          </div>
        )
      case "AlertDialog":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Destructive action"
              title="Remove this draft?"
              detail="The dialog only opens after an intentional click."
            />
            <UI.AlertDialog
              title="Remove draft?"
              description="This removes the local draft and cannot be undone."
              trigger={<UI.Button tone="danger">Remove draft</UI.Button>}
              footer={
                <UI.Button tone="danger" onClick={() => undefined}>
                  Remove
                </UI.Button>
              }
            >
              A new draft can be created from the source branch later.
            </UI.AlertDialog>
          </div>
        )
      case "AspectRatio":
        return (
          <div className="preview-surface">
            <PreviewCaption
              eyebrow="Media frame"
              title="Predictable crop"
              detail="The content stays 16:9 at every width."
            />
            <UI.AspectRatio ratio={16 / 9}>
              <div className="preview-media-frame">
                <span>agent / review / 16:9</span>
                <strong>Northstar run 042</strong>
              </div>
            </UI.AspectRatio>
          </div>
        )
      case "Attachment":
        return (
          <div className="preview-surface preview-list-surface">
            <PreviewCaption
              eyebrow="Files in this change"
              title="Source attachments"
            />
            <UI.Attachment name="route-contract.json" size="18 KB" />
            <UI.Attachment
              name="review-notes.md"
              status="uploading"
              size="Uploading…"
            />
          </div>
        )
      case "Avatar":
        return (
          <div className="preview-surface preview-profile-surface">
            <UI.Inline wrap={false}>
              <UI.Avatar name="Maya Chen" size={48} />
              <UI.Stack gap={3}>
                <strong>Maya Chen</strong>
                <UI.Description>Maintainer · Nifra UI</UI.Description>
              </UI.Stack>
            </UI.Inline>
            <UI.Inline>
              <UI.AvatarGroup names={["Maya Chen", "Sam Lee", "Noah Kim"]} />
              <UI.Badge tone="accent">3 reviewers</UI.Badge>
            </UI.Inline>
          </div>
        )
      case "Badge":
        return (
          <div className="preview-surface preview-status-surface">
            <span className="preview-status-row">
              <UI.Badge tone="accent">Ready</UI.Badge>
              <span>Contract verified</span>
            </span>
            <span className="preview-status-row">
              <UI.Badge>Draft</UI.Badge>
              <span>Awaiting review</span>
            </span>
            <span className="preview-status-row">
              <UI.Badge tone="danger">Blocked</UI.Badge>
              <span>Missing approval</span>
            </span>
          </div>
        )
      case "Breadcrumb":
        return (
          <div className="preview-surface">
            <UI.Breadcrumb
              items={[
                { label: "Workspace", href: "#" },
                { label: "Components", href: "#" },
                { label: "Checkbox" },
              ]}
            />
            <PreviewCaption
              eyebrow="Current location"
              title="Checkbox"
              detail="Form controls / standard base"
            />
          </div>
        )
      case "Bubble":
        return (
          <div className="preview-surface preview-conversation-surface">
            <UI.Bubble>Can you show me the exact files first?</UI.Bubble>
            <UI.Bubble tone="accent">
              Yes — three files, no external writes.
            </UI.Bubble>
          </div>
        )
      case "Button":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Action hierarchy"
              title="Make intent visible"
            />
            <UI.Button tone="primary">
              Approve &amp; apply <Arrow />
            </UI.Button>
            <UI.Inline>
              <UI.Button>Review diff</UI.Button>
              <UI.Button tone="ghost">Dismiss</UI.Button>
              <UI.Button disabled>Disabled</UI.Button>
            </UI.Inline>
          </div>
        )
      case "ButtonGroup":
        return (
          <div className="preview-surface preview-toolbar-surface">
            <PreviewCaption eyebrow="Grouped actions" title="Review controls" />
            <UI.ButtonGroup>
              <UI.Button size="sm">Back</UI.Button>
              <UI.Button size="sm">Save draft</UI.Button>
              <UI.Button size="sm" tone="primary">
                Continue
              </UI.Button>
            </UI.ButtonGroup>
          </div>
        )
      case "Calendar":
        return (
          <div className="preview-calendar-layout">
            <PreviewCaption
              eyebrow="Schedule"
              title="Choose a review date"
              detail="Thursday, August 27, 2026"
            />
            <UI.Calendar defaultValue="2026-08-27" />
          </div>
        )
      case "Card":
        return (
          <UI.Card className="preview-card-composition">
            <UI.CardHeader>
              <UI.Inline wrap={false}>
                <UI.Avatar name="Nifra" size={34} />
                <UI.Stack gap={3}>
                  <strong>Review proposal</strong>
                  <UI.Description>Updated 2 minutes ago</UI.Description>
                </UI.Stack>
                <UI.Badge tone="accent">Ready</UI.Badge>
              </UI.Inline>
            </UI.CardHeader>
            <UI.CardBody>
              <UI.Stack gap={12}>
                <span className="preview-card-copy">
                  The agent prepared a reversible change across three files.
                </span>
                <UI.Progress value={72} label="Contract coverage" />
              </UI.Stack>
            </UI.CardBody>
            <UI.CardFooter>
              <UI.ButtonGroup>
                <UI.Button size="sm">Review diff</UI.Button>
                <UI.Button size="sm" tone="primary">
                  Approve
                </UI.Button>
              </UI.ButtonGroup>
            </UI.CardFooter>
          </UI.Card>
        )
      case "Carousel":
        return (
          <UI.Carousel
            slides={[
              <div className="preview-carousel-slide" key="scope">
                <span className="preview-slide-index">01</span>
                <strong>Scope checked</strong>
                <span>3 files match the selected package.</span>
              </div>,
              <div className="preview-carousel-slide" key="diff">
                <span className="preview-slide-index">02</span>
                <strong>Diff prepared</strong>
                <span>Every change is visible before apply.</span>
              </div>,
              <div className="preview-carousel-slide" key="approval">
                <span className="preview-slide-index">03</span>
                <strong>Human gate</strong>
                <span>The final decision remains yours.</span>
              </div>,
            ]}
            label="Review stages"
          />
        )
      case "Chart":
        return (
          <div className="preview-surface preview-chart-surface">
            <div className="preview-chart-heading">
              <PreviewCaption eyebrow="Last 7 runs" title="Verified coverage" />
              <UI.Badge tone="accent">+12%</UI.Badge>
            </div>
            <UI.Chart
              data={[42, 48, 46, 61, 58, 71, 78]}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              label="Verified coverage over seven runs"
            />
            <div className="preview-chart-legend">
              <span>Coverage</span>
              <strong>78%</strong>
            </div>
          </div>
        )
      case "Checkbox":
        return (
          <div className="preview-surface preview-checkbox-surface">
            <PreviewCaption
              eyebrow="Field states"
              title="Show these items on the desktop"
              detail="Select the surfaces you want people to see."
            />
            <UI.Checkbox label="Hard disks" defaultChecked />
            <UI.Checkbox label="External disks" defaultChecked />
            <UI.Checkbox label="Connected servers" checked="indeterminate" />
            <div className="preview-invalid-row">
              <UI.Checkbox label="CDs, DVDs, and iPods" aria-invalid="true" />
              <span>Choose at least one removable device.</span>
            </div>
            <UI.Checkbox label="Notifications are disabled" disabled />
          </div>
        )
      case "Collapsible":
        return (
          <div className="preview-surface">
            <UI.Collapsible title="Show the source contract" defaultOpen>
              <UI.Inline wrap={false}>
                <UI.Badge tone="accent">stable</UI.Badge>
                <UI.Description>Readable by people and agents.</UI.Description>
              </UI.Inline>
            </UI.Collapsible>
          </div>
        )
      case "Combobox":
        return (
          <div className="preview-surface preview-form-surface">
            <PreviewCaption
              eyebrow="Command target"
              title="Choose a component"
            />
            <UI.Combobox
              aria-label="Choose a component"
              placeholder="Search components…"
              options={[
                { value: "checkbox", label: "Checkbox" },
                { value: "dialog", label: "Dialog" },
                { value: "table", label: "Table" },
                { value: "tabs", label: "Tabs" },
              ]}
            />
            <span className="preview-hint">
              Type to filter the registry, then select a result.
            </span>
          </div>
        )
      case "Command":
        return (
          <div className="preview-surface preview-command-surface">
            <PreviewCaption eyebrow="⌘ K" title="Quick actions" />
            <UI.Command
              items={[
                { value: "inspect", label: "Inspect component", hint: "I" },
                { value: "copy", label: "Copy usage code", hint: "C" },
                { value: "add", label: "Add to project", hint: "A" },
              ]}
            />
          </div>
        )
      case "ContextMenu":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Context menu"
              title="Right-click the file row"
            />
            <UI.ContextMenu
              defaultOpen
              items={[
                { label: "Inspect source" },
                { label: "Copy usage" },
                { label: "Archive draft" },
              ]}
            >
              <UI.Item
                icon="◇"
                title="checkbox.tsx"
                description="Source-owned component"
              />
            </UI.ContextMenu>
          </div>
        )
      case "DataTable":
        return (
          <div className="preview-surface preview-table-surface">
            <PreviewCaption eyebrow="Recent runs" title="Data table" />
            <DataTableSpecimen compact={compact} inspector={inspector} />
          </div>
        )
      case "DatePicker":
        return (
          <div className="preview-surface preview-form-surface">
            <PreviewCaption
              eyebrow="Scheduling"
              title="Review date"
              detail="A labelled trigger with an anchored calendar."
            />
            <UI.Field label="Run on" htmlFor="preview-date-picker">
              <UI.DatePicker
                id="preview-date-picker"
                aria-label="Review date"
                defaultValue="2026-08-27"
                defaultOpen={!inspector}
              />
            </UI.Field>
          </div>
        )
      case "Dialog":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Focused attention"
              title="Review before apply"
              detail="The page stays still while the decision is explicit."
            />
            <UI.Dialog
              title="Review proposal"
              description="The agent prepared a reversible change across three files."
              trigger={<UI.Button tone="primary">Open review</UI.Button>}
              footer={<UI.Button tone="primary">Approve &amp; apply</UI.Button>}
            >
              <UI.Stack gap={10}>
                <UI.Item
                  icon="✓"
                  title="Scope verified"
                  description="Only the selected package is affected."
                />
                <UI.Item
                  icon="◇"
                  title="Audit note ready"
                  description="The decision will be recorded beside the run."
                />
              </UI.Stack>
            </UI.Dialog>
          </div>
        )
      case "Direction":
        return (
          <div className="preview-surface">
            <PreviewCaption
              eyebrow="Bidirectional UI"
              title="Scoped direction"
              detail="The component boundary can be rendered right-to-left."
            />
            <UI.Direction dir="rtl">
              <UI.Item
                icon="←"
                title="مراجعة التغيير"
                description="The surrounding page remains LTR."
              />
            </UI.Direction>
          </div>
        )
      case "Drawer":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Side surface"
              title="Keep context visible"
              detail="A drawer is useful for a focused detail view."
            />
            <UI.Drawer
              title="Run details"
              trigger={<UI.Button>Open run details</UI.Button>}
            >
              <UI.Stack gap={14}>
                <UI.Badge tone="accent">Ready</UI.Badge>
                <UI.Description>
                  Route audit completed without external writes.
                </UI.Description>
                <UI.Progress value={100} label="Checks complete" />
              </UI.Stack>
            </UI.Drawer>
          </div>
        )
      case "DropdownMenu":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Overflow actions"
              title="A compact action menu"
            />
            <UI.DropdownMenu
              label="Run actions"
              items={[
                { label: "Open details" },
                { label: "Copy command" },
                { label: "Archive run" },
              ]}
            />
          </div>
        )
      case "Empty":
        return (
          <div className="preview-surface">
            <UI.Empty
              icon="○"
              title="No saved runs"
              description="Start a run to see activity and review history here."
              action={
                <UI.Button size="sm" tone="primary">
                  Start a run
                </UI.Button>
              }
            />
          </div>
        )
      case "Form":
        return (
          <div className="preview-surface preview-form-surface">
            <PreviewCaption
              eyebrow="Form composition"
              title="Save a workspace"
              detail="Labels, help text, validation, and actions stay together."
            />
            <UI.Form
              className="preview-form-layout"
              onSubmit={(event) => event.preventDefault()}
            >
              <UI.Field
                label="Workspace name"
                htmlFor="preview-form-workspace"
                description="Use a name your team will recognize."
              >
                <UI.Input
                  id="preview-form-workspace"
                  defaultValue="Northstar"
                />
              </UI.Field>
              <UI.ButtonGroup>
                <UI.Button type="button" size="sm">
                  Cancel
                </UI.Button>
                <UI.Button type="submit" size="sm" tone="primary">
                  Save workspace
                </UI.Button>
              </UI.ButtonGroup>
            </UI.Form>
          </div>
        )
      case "Field":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field
              label="Workspace name"
              htmlFor="preview-workspace"
              description="This appears in the review header."
            >
              <UI.Input id="preview-workspace" defaultValue="Northstar" />
            </UI.Field>
          </div>
        )
      case "HoverCard":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Progressive detail"
              title="Reveal context on hover"
            />
            <UI.HoverCard content="The source is owned by your project and can be changed locally.">
              <UI.Link href="#">Hover the source name</UI.Link>
            </UI.HoverCard>
          </div>
        )
      case "Input":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field
              label="Project slug"
              htmlFor="preview-input"
              description="Lowercase letters and hyphens only."
            >
              <UI.Input id="preview-input" defaultValue="nifra-ui" />
            </UI.Field>
            <UI.Field
              label="Invalid example"
              htmlFor="preview-input-invalid"
              error="Use lowercase letters and hyphens."
            >
              <UI.Input
                id="preview-input-invalid"
                defaultValue="Nifra UI"
                aria-invalid="true"
              />
            </UI.Field>
          </div>
        )
      case "InputGroup":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field label="Repository URL" htmlFor="preview-repository">
              <UI.InputGroup start="https://" end="↗">
                <UI.Input
                  id="preview-repository"
                  aria-label="Repository name"
                  defaultValue="github.com/nifrajs/nifra-ui"
                />
              </UI.InputGroup>
            </UI.Field>
          </div>
        )
      case "InputOTP":
        return (
          <div className="preview-surface preview-form-surface">
            <PreviewCaption
              eyebrow="Verification"
              title="Enter the six-digit code"
              detail="Each slot remains individually labelled."
            />
            <UI.InputOTP length={6} value="204816" />
          </div>
        )
      case "Item":
        return (
          <div className="preview-surface preview-list-surface">
            <UI.Item
              icon="✓"
              title="Scope verified"
              description="3 files · 0 external writes"
              action={<UI.Badge tone="accent">Ready</UI.Badge>}
            />
            <UI.Item
              icon="◇"
              title="Human review"
              description="Waiting for your decision"
              action={<UI.Badge>Pending</UI.Badge>}
            />
          </div>
        )
      case "Kbd":
        return (
          <div className="preview-surface preview-command-bar">
            <span>Open command menu</span>
            <UI.Kbd>⌘ K</UI.Kbd>
          </div>
        )
      case "Label":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Label htmlFor="preview-label-input">Workspace</UI.Label>
            <UI.Input id="preview-label-input" placeholder="Northstar" />
          </div>
        )
      case "Marker":
        return (
          <div className="preview-surface preview-copy-surface">
            <p>
              Every consequential action has{" "}
              <UI.Marker>human-visible evidence</UI.Marker> before it runs.
            </p>
            <UI.Description>
              Markers carry meaning without adding another badge.
            </UI.Description>
          </div>
        )
      case "Menubar":
        return (
          <div className="preview-surface preview-menu-surface">
            <UI.Menubar>
              <UI.Link href="#">File</UI.Link>
              <UI.Link href="#">Edit</UI.Link>
              <UI.Link href="#">View</UI.Link>
              <UI.Link href="#">Help</UI.Link>
            </UI.Menubar>
          </div>
        )
      case "Message":
        return (
          <div className="preview-surface preview-conversation-surface">
            <UI.Message role="agent">
              The contract is loaded and ready for your review.
            </UI.Message>
            <UI.Message role="human">Show me the diff first.</UI.Message>
          </div>
        )
      case "MessageScroller":
        return (
          <div className="preview-surface">
            <UI.MessageScroller
              messages={[
                { role: "agent", children: "I found three affected files." },
                { role: "human", children: "Keep the change reversible." },
                {
                  role: "agent",
                  children: "Understood. Waiting for approval.",
                },
              ]}
              maxHeight={174}
            />
          </div>
        )
      case "NativeSelect":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field label="Execution mode" htmlFor="preview-native-select">
              <UI.NativeSelect
                id="preview-native-select"
                aria-label="Execution mode"
                defaultValue="review"
                options={[
                  { value: "review", label: "Review before apply" },
                  { value: "draft", label: "Draft only" },
                  { value: "auto", label: "Auto apply" },
                ]}
              />
            </UI.Field>
          </div>
        )
      case "NavigationMenu":
        return (
          <div className="preview-surface preview-menu-surface">
            <UI.NavigationMenu
              items={[
                { label: "Overview", href: "#" },
                { label: "Components", href: "#" },
                { label: "Registry", href: "#" },
              ]}
            />
          </div>
        )
      case "Pagination":
        return (
          <div className="preview-surface preview-pagination-surface">
            <PreviewCaption eyebrow="Registry" title="Page 2 of 8" />
            <UI.Pagination page={2} pages={8} />
          </div>
        )
      case "Popover":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Contextual detail"
              title="Keep the page in place"
            />
            <UI.Popover trigger={<UI.Button>Show run metadata</UI.Button>}>
              <UI.Stack gap={8}>
                <UI.Item title="Last verified" description="Today at 09:42" />
                <UI.Item title="Risk" description="Low · reversible" />
              </UI.Stack>
            </UI.Popover>
          </div>
        )
      case "Progress":
        return (
          <div className="preview-surface">
            <UI.Progress value={72} label="Contract coverage" />
            <div className="preview-progress-meta">
              <span>18 of 25 checks</span>
              <UI.Badge tone="accent">On track</UI.Badge>
            </div>
          </div>
        )
      case "Questionnaire":
        return (
          <div className="preview-surface">
            <UI.Questionnaire
              question="How should this run behave?"
              options={[
                {
                  value: "review",
                  label: "Ask before applying",
                  description: "Recommended for changes.",
                },
                {
                  value: "draft",
                  label: "Draft only",
                  description: "Prepare the change without applying.",
                },
                {
                  value: "auto",
                  label: "Auto apply",
                  description: "Only use for trusted, reversible tasks.",
                },
              ]}
              defaultValue="review"
            />
          </div>
        )
      case "RadioGroup":
        return (
          <div className="preview-surface preview-form-surface">
            <PreviewCaption eyebrow="Environment" title="Choose a run mode" />
            <UI.RadioGroup
              options={[
                { value: "safe", label: "Safe mode" },
                { value: "fast", label: "Fast mode" },
                { value: "offline", label: "Offline mode" },
              ]}
              defaultValue="safe"
            />
          </div>
        )
      case "Resizable":
        return (
          <div className="preview-surface">
            <UI.Resizable>
              <div className="preview-resize-pane">
                <span>Source</span>
                <strong>checkbox.tsx</strong>
              </div>
              <div className="preview-resize-pane">
                <span>Preview</span>
                <strong>Live state</strong>
              </div>
            </UI.Resizable>
          </div>
        )
      case "ScrollArea":
        return (
          <div className="preview-surface preview-scroll-surface">
            <PreviewCaption
              eyebrow="Long content"
              title="Scroll without losing the frame"
            />
            <UI.ScrollArea>
              <UI.Stack gap={12}>
                <UI.Item
                  icon="01"
                  title="Route contract"
                  description="Verified against the current source."
                />
                <UI.Item
                  icon="02"
                  title="Typecheck"
                  description="No drift found in the generated client."
                />
                <UI.Item
                  icon="03"
                  title="Review gate"
                  description="Waiting for a human decision."
                />
                <UI.Item
                  icon="04"
                  title="Audit note"
                  description="Ready to write after approval."
                />
              </UI.Stack>
            </UI.ScrollArea>
          </div>
        )
      case "Select":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field label="Review policy" htmlFor="preview-select">
              <UI.Select
                id="preview-select"
                aria-label="Review policy"
                defaultValue="review"
                options={[
                  { value: "review", label: "Review before apply" },
                  { value: "draft", label: "Draft only" },
                  { value: "auto", label: "Auto apply" },
                ]}
              />
            </UI.Field>
            <span className="preview-hint">
              Native keyboard behavior stays intact.
            </span>
          </div>
        )
      case "Separator":
        return (
          <div className="preview-surface preview-separator-surface">
            <UI.Inline wrap={false}>
              <span>Source</span>
              <UI.Separator />
              <span>Preview</span>
            </UI.Inline>
            <UI.Description>
              Use a quiet rule to keep related regions legible.
            </UI.Description>
          </div>
        )
      case "Sheet":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Persistent context"
              title="Inspect without leaving the page"
            />
            <UI.Sheet
              title="Review metadata"
              description="The page context remains visible behind this sheet."
              trigger={<UI.Button>Open metadata</UI.Button>}
            >
              <UI.Stack gap={14}>
                <UI.Item
                  title="Last verified"
                  description="Today at 09:42"
                  action={<UI.Badge tone="accent">Fresh</UI.Badge>}
                />
                <UI.Item
                  title="Change scope"
                  description="3 files · low risk"
                />
              </UI.Stack>
            </UI.Sheet>
          </div>
        )
      case "Sidebar":
        return (
          <div className="preview-sidebar-surface">
            <UI.Sidebar title="Workspace">
              <UI.Menu
                items={[
                  { label: "Overview" },
                  { label: "Components" },
                  { label: "Runs" },
                  { label: "Settings" },
                ]}
              />
            </UI.Sidebar>
            <div className="preview-sidebar-main">
              <span className="preview-caption-eyebrow">Selected</span>
              <strong>Components</strong>
              <UI.Description>64 base components</UI.Description>
            </div>
          </div>
        )
      case "Skeleton":
        return (
          <div className="preview-surface preview-skeleton-surface">
            <PreviewCaption
              eyebrow="Loading state"
              title="Preserve the incoming shape"
              detail="Skeletons keep the layout stable while data arrives."
            />
            <div className="preview-skeleton-heading">
              <UI.Skeleton width="38%" height={13} />
              <UI.Skeleton width="18%" height={13} />
            </div>
            <UI.Skeleton width="92%" height={12} />
            <UI.Skeleton width="74%" height={12} />
            <div className="preview-skeleton-actions">
              <UI.Skeleton width="28%" height={34} />
              <UI.Skeleton width="22%" height={34} />
            </div>
          </div>
        )
      case "Slider":
        return (
          <div className="preview-surface preview-form-surface">
            <div className="preview-slider-heading">
              <PreviewCaption
                eyebrow="Confidence"
                title="72"
                detail="Adjust the review threshold."
              />
            </div>
            <UI.Slider aria-label="Confidence" defaultValue={72} max={100} />
          </div>
        )
      case "Spinner":
        return (
          <div className="preview-surface preview-spinner-surface">
            <UI.Spinner label="Loading registry" />
            <span>Loading the latest contracts…</span>
          </div>
        )
      case "Switch":
        return (
          <div className="preview-surface preview-switch-surface">
            <PreviewCaption
              eyebrow="Preferences"
              title="Control the review gate"
            />
            <UI.Switch
              label="Pause before consequential actions"
              defaultChecked
            />
            <UI.Switch label="Send anonymous diagnostics" />
          </div>
        )
      case "Table":
        return (
          <div className="preview-surface preview-table-surface">
            <PreviewCaption eyebrow="Recent runs" title="A semantic table" />
            <UI.Table caption="Recent runs" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "46%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "29%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Run</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="table-primary-cell">
                      <strong>Route audit</strong>
                      <small>run-042 · 3 files</small>
                    </span>
                  </td>
                  <td>Maya Chen</td>
                  <td>
                    <UI.Badge tone="accent" size="sm">
                      Ready
                    </UI.Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-primary-cell">
                      <strong>Schema check</strong>
                      <small>run-041 · 7 files</small>
                    </span>
                  </td>
                  <td>Sam Lee</td>
                  <td>
                    <UI.Badge size="sm">Review</UI.Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-primary-cell">
                      <strong>MCP smoke test</strong>
                      <small>run-040 · 2 files</small>
                    </span>
                  </td>
                  <td>Noah Kim</td>
                  <td>
                    <UI.Badge tone="danger" size="sm">
                      Blocked
                    </UI.Badge>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="table-primary-cell">
                      <strong>Client drift scan</strong>
                      <small>run-039 · 12 files</small>
                    </span>
                  </td>
                  <td>Maya Chen</td>
                  <td>
                    <UI.Badge size="sm">Complete</UI.Badge>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>4 recent runs · fictional fixture data</td>
                </tr>
              </tfoot>
            </UI.Table>
          </div>
        )
      case "Tabs":
        return (
          <div className="preview-surface preview-tabs-surface">
            <PreviewCaption
              eyebrow="Run detail"
              title="Switch views without losing context"
            />
            <UI.Tabs
              items={[
                { value: "overview", label: "Overview" },
                { value: "activity", label: "Activity" },
                { value: "source", label: "Source" },
              ]}
            >
              {(value) =>
                value === "overview" ? (
                  <UI.Item
                    icon="✓"
                    title="Contract verified"
                    description="All checks passed locally."
                    action={<UI.Badge tone="accent">72%</UI.Badge>}
                  />
                ) : value === "activity" ? (
                  <UI.Item
                    icon="02"
                    title="Human review pending"
                    description="Waiting for your decision."
                  />
                ) : (
                  <UI.Code>src/components/checkbox.tsx</UI.Code>
                )
              }
            </UI.Tabs>
          </div>
        )
      case "Textarea":
        return (
          <div className="preview-surface preview-form-surface">
            <UI.Field
              label="Review note"
              htmlFor="preview-textarea"
              description="This note is attached to the run. 0 / 280 characters."
            >
              <UI.Textarea
                id="preview-textarea"
                defaultValue="Keep the change reversible and show the diff before applying."
              />
            </UI.Field>
          </div>
        )
      case "Toast":
        return (
          <div className="preview-surface preview-toast-surface">
            <PreviewCaption
              eyebrow="Feedback"
              title="Give the action a clear result"
            />
            <UI.Toast
              title="Draft saved"
              description="The source and registry are in sync."
            />
          </div>
        )
      case "Toggle":
        return (
          <div className="preview-surface preview-toggle-surface">
            <PreviewCaption eyebrow="Preference" title="A reversible toggle" />
            <UI.Toggle defaultPressed>Pin this run</UI.Toggle>
            <UI.Description>
              Pressed state is communicated through aria-pressed.
            </UI.Description>
          </div>
        )
      case "ToggleGroup":
        return (
          <div className="preview-surface preview-toggle-surface">
            <PreviewCaption eyebrow="View filter" title="Choose a lens" />
            <UI.ToggleGroup
              options={[
                { value: "all", label: "All runs" },
                { value: "mine", label: "Mine" },
                { value: "blocked", label: "Blocked" },
              ]}
              defaultValue="all"
            />
          </div>
        )
      case "Tooltip":
        return (
          <div className="preview-surface preview-action-surface">
            <PreviewCaption
              eyebrow="Small explanation"
              title="Add context without clutter"
            />
            <UI.Tooltip content="Copies the complete usage example">
              <UI.Button tone="ghost">Hover or focus me</UI.Button>
            </UI.Tooltip>
          </div>
        )
      case "Typography":
        return (
          <div className="preview-surface preview-type-surface">
            <UI.Typography as="h3" variant="display">
              A heading with hierarchy
            </UI.Typography>
            <UI.Typography variant="lead">
              Readable type roles make the system feel intentional.
            </UI.Typography>
            <UI.Typography variant="muted">
              Muted copy supports the next decision.
            </UI.Typography>
          </div>
        )
      default:
        return null
    }
  })()
  return content ? <div className={className}>{content}</div> : null
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      let copiedToClipboard = false
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value)
          copiedToClipboard = true
        } catch {
          copiedToClipboard = false
        }
      }
      if (!copiedToClipboard) {
        const textarea = document.createElement("textarea")
        textarea.value = value
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.append(textarea)
        try {
          textarea.select()
          copiedToClipboard = document.execCommand("copy")
        } finally {
          textarea.remove()
        }
      }
      if (!copiedToClipboard) throw new Error("copy command failed")
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button className="copy-button" type="button" onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function ComponentPreview({
  item,
  compact = false,
  inspector = false,
}: {
  item: ComponentMeta
  compact?: boolean
  inspector?: boolean
}) {
  const widePreview = isWidePreview(item.name)
  const className = compact
    ? `mini-preview${widePreview ? " mini-preview-table" : ""}`
    : "full-preview"
  const content = coreNameSet.has(item.name) ? (
    <CoreSpecimen name={item.name} compact={compact} inspector={inspector} />
  ) : (
    (() => {
      switch (item.name) {
        case "ThemeProvider":
          return <UI.Badge tone="accent">Semantic theme context</UI.Badge>
        case "ThemeScript":
          return <UI.Code>data-theme=&quot;dark&quot;</UI.Code>
        case "Icon":
          return (
            <div className="icon-preview-set">
              <UI.Icon label="Spark" size={34}>
                <Glyph>✦</Glyph>
              </UI.Icon>
              <UI.Icon label="Arrow" size={34}>
                <Glyph>↗</Glyph>
              </UI.Icon>
              <UI.Icon label="Check" size={34}>
                <Glyph>✓</Glyph>
              </UI.Icon>
            </div>
          )
        case "Portal":
          return (
            <UI.Portal>
              <UI.Badge tone="accent">Portal content</UI.Badge>
            </UI.Portal>
          )
        case "Slot":
          return (
            <UI.Slot>
              <UI.Badge>Slot content</UI.Badge>
            </UI.Slot>
          )
        case "VisuallyHidden":
          return (
            <>
              <UI.Badge>Visible label</UI.Badge>
              <UI.VisuallyHidden>Screen reader detail</UI.VisuallyHidden>
            </>
          )
        case "FocusRing":
          return (
            <UI.FocusRing>
              <UI.Button>Focus me</UI.Button>
            </UI.FocusRing>
          )
        case "Container":
          return (
            <UI.Container>
              <UI.Badge tone="accent">Container</UI.Badge>
            </UI.Container>
          )
        case "Stack":
          return (
            <UI.Stack gap={6}>
              <UI.Badge>First</UI.Badge>
              <UI.Badge tone="accent">Second</UI.Badge>
            </UI.Stack>
          )
        case "Inline":
          return (
            <UI.Inline>
              <UI.Badge>One</UI.Badge>
              <UI.Badge tone="accent">Two</UI.Badge>
            </UI.Inline>
          )
        case "Grid":
          return (
            <UI.Grid columns="repeat(2, 1fr)" gap={6}>
              <UI.Badge>A</UI.Badge>
              <UI.Badge tone="accent">B</UI.Badge>
            </UI.Grid>
          )
        case "Separator":
          return (
            <div className="separator-preview">
              <span>Before</span>
              <UI.Separator />
              <span>After</span>
            </div>
          )
        case "ScrollArea":
          return (
            <div className="scroll-preview">
              <UI.ScrollArea>
                <UI.Stack gap={8}>
                  <span>Long content stays readable.</span>
                  <span>Scroll within the surface.</span>
                  <span>Still source-owned.</span>
                </UI.Stack>
              </UI.ScrollArea>
            </div>
          )
        case "AspectRatio":
          return (
            <UI.AspectRatio ratio={16 / 9}>
              <div className="ratio-preview">
                <Glyph>16:9</Glyph>
              </div>
            </UI.AspectRatio>
          )
        case "Direction":
          return (
            <UI.Direction dir="rtl">
              <UI.Item
                icon="←"
                title="RTL boundary"
                description="Direction is scoped."
              />
            </UI.Direction>
          )
        case "Marker":
          return (
            <span>
              Evidence is <UI.Marker>marked in context</UI.Marker>.
            </span>
          )
        case "Typography":
          return (
            <UI.Stack gap={4}>
              <UI.Typography as="h3" variant="display">
                Display role
              </UI.Typography>
              <UI.Typography variant="muted">Muted role</UI.Typography>
            </UI.Stack>
          )
        case "Button":
          return (
            <UI.Button tone="primary" size={compact ? "sm" : "md"}>
              Continue <Arrow />
            </UI.Button>
          )
        case "IconButton":
          return <UI.IconButton label="Open details">↗</UI.IconButton>
        case "ButtonGroup":
          return (
            <UI.ButtonGroup>
              <UI.Button size="sm">Cancel</UI.Button>
              <UI.Button size="sm" tone="primary">
                Save
              </UI.Button>
            </UI.ButtonGroup>
          )
        case "Link":
          return (
            <UI.Link href="#components">
              Explore the docs <Arrow />
            </UI.Link>
          )
        case "LinkButton":
          return (
            <UI.LinkButton href="#components">
              Get started <Arrow />
            </UI.LinkButton>
          )
        case "Toggle":
          return <UI.Toggle defaultPressed>Pin to workspace</UI.Toggle>
        case "ToggleGroup":
          return (
            <UI.ToggleGroup
              options={[
                { value: "all", label: "All" },
                { value: "mine", label: "Mine" },
              ]}
              defaultValue="all"
            />
          )
        case "Badge":
          return <UI.Badge tone="accent">Ready</UI.Badge>
        case "Tag":
          return <UI.Tag>Source-owned</UI.Tag>
        case "Avatar":
          return <UI.Avatar name="Nifra" />
        case "AvatarGroup":
          return <UI.AvatarGroup names={["Nifra", "Ada", "Lin"]} />
        case "Kbd":
          return <UI.Kbd>⌘ K</UI.Kbd>
        case "Code":
          return <UI.Code>nifra check</UI.Code>
        case "CodeBlock":
          return <UI.CodeBlock code={"$ nifra check\n✓ contract verified"} />
        case "Card":
          return (
            <UI.Card>
              <UI.CardBody>
                <UI.Stack gap={6}>
                  <strong>Source-owned</strong>
                  <UI.Description>
                    Readable by people and agents.
                  </UI.Description>
                </UI.Stack>
              </UI.CardBody>
            </UI.Card>
          )
        case "Callout":
          return (
            <UI.Callout title="Heads up">This state is reversible.</UI.Callout>
          )
        case "Attachment":
          return (
            <UI.Attachment
              name="proposal.patch"
              size="4 KB"
              onRemove={() => undefined}
            />
          )
        case "Bubble":
          return (
            <UI.Stack gap={8}>
              <UI.Bubble>Agent prepared a draft.</UI.Bubble>
              <UI.Bubble tone="accent">I will review it.</UI.Bubble>
            </UI.Stack>
          )
        case "Carousel":
          return (
            <UI.Carousel
              slides={[
                <UI.Item
                  key="one"
                  icon="01"
                  title="Read contract"
                  description="The surface is inspectable."
                />,
                <UI.Item
                  key="two"
                  icon="02"
                  title="Review change"
                  description="The human stays in control."
                />,
              ]}
            />
          )
        case "Chart":
          return (
            <UI.Chart
              data={[18, 24, 21, 36, 31, 44]}
              labels={["M", "T", "W", "T", "F", "S"]}
              label="Weekly usage"
            />
          )
        case "Field":
          return (
            <UI.Field label="Workspace" htmlFor="preview-field">
              <UI.Input id="preview-field" defaultValue="Northstar" />
            </UI.Field>
          )
        case "Label":
          return <UI.Label>Workspace name</UI.Label>
        case "Description":
          return (
            <UI.Description>Visible before the next action.</UI.Description>
          )
        case "FieldError":
          return (
            <UI.FieldError>Choose a workspace before continuing.</UI.FieldError>
          )
        case "Input":
          return <UI.Input placeholder="Your name" defaultValue="Maya" />
        case "InputGroup":
          return (
            <UI.InputGroup start="$">
              <UI.Input defaultValue="24.00" aria-label="Amount" />
            </UI.InputGroup>
          )
        case "Textarea":
          return (
            <UI.Textarea
              placeholder="Describe the change…"
              defaultValue="Keep it reversible."
            />
          )
        case "PasswordField":
          return (
            <UI.PasswordField aria-label="Password" defaultValue="secret" />
          )
        case "SearchField":
          return <UI.SearchField aria-label="Search" defaultValue="approval" />
        case "NumberField":
          return <UI.NumberField aria-label="Quantity" defaultValue={3} />
        case "Checkbox":
          return <UI.Checkbox label="Require approval" defaultChecked />
        case "CheckboxGroup":
          return (
            <UI.CheckboxGroup
              options={[
                { value: "a", label: "Route assurance" },
                { value: "b", label: "MCP context" },
              ]}
              value={["a"]}
            />
          )
        case "RadioGroup":
          return (
            <UI.RadioGroup
              options={[
                { value: "safe", label: "Safe mode" },
                { value: "fast", label: "Fast mode" },
              ]}
              defaultValue="safe"
            />
          )
        case "Switch":
          return <UI.Switch label="Human approval" defaultChecked />
        case "Select":
          return (
            <UI.Select
              aria-label="Choose mode"
              options={[
                { value: "safe", label: "Safe mode" },
                { value: "fast", label: "Fast mode" },
              ]}
            />
          )
        case "NativeSelect":
          return (
            <UI.NativeSelect
              aria-label="Choose mode"
              options={[
                { value: "safe", label: "Safe mode" },
                { value: "fast", label: "Fast mode" },
              ]}
            />
          )
        case "Combobox":
          return (
            <UI.Combobox
              aria-label="Choose component"
              placeholder="Choose component…"
              options={[
                { value: "button", label: "Button" },
                { value: "dialog", label: "Dialog" },
              ]}
            />
          )
        case "MultiSelect":
          return (
            <UI.MultiSelect
              aria-label="Choose surfaces"
              options={[
                { value: "human", label: "Human gate" },
                { value: "agent", label: "Agent layer" },
              ]}
              value={["human"]}
            />
          )
        case "Slider":
          return (
            <UI.Slider aria-label="Confidence" defaultValue={72} max={100} />
          )
        case "DatePicker":
          return (
            <UI.DatePicker aria-label="Choose date" defaultValue="2026-08-27" />
          )
        case "Calendar":
          return <UI.Calendar value="2026-08-27" />
        case "TimeField":
          return <UI.TimeField aria-label="Choose time" defaultValue="09:30" />
        case "OTPInput":
        case "InputOTP":
          return <UI.InputOTP length={4} value="2048" />
        case "FileField":
          return <UI.FileField aria-label="Upload source" />
        case "Questionnaire":
          return (
            <UI.Questionnaire
              question="How should this run behave?"
              options={[
                {
                  value: "review",
                  label: "Ask before applying",
                  description: "Recommended for changes.",
                },
                { value: "draft", label: "Draft only" },
              ]}
              defaultValue="review"
            />
          )
        case "Form":
          return (
            <UI.Form>
              <UI.Input aria-label="Form field" placeholder="Form field" />
              <UI.Button tone="primary" size="sm">
                Submit
              </UI.Button>
            </UI.Form>
          )
        case "Tabs":
          return (
            <UI.Tabs
              items={[
                { value: "preview", label: "Preview" },
                { value: "code", label: "Code" },
              ]}
            >
              <UI.Description>One contract, two surfaces.</UI.Description>
            </UI.Tabs>
          )
        case "TabList":
          return (
            <UI.TabList>
              <UI.Tab active>Preview</UI.Tab>
              <UI.Tab>Contract</UI.Tab>
            </UI.TabList>
          )
        case "Tab":
          return <UI.Tab active>Preview</UI.Tab>
        case "TabPanel":
          return (
            <UI.TabPanel>
              <UI.Description>Panel content.</UI.Description>
            </UI.TabPanel>
          )
        case "Accordion":
          return (
            <UI.Accordion
              items={[
                {
                  value: "one",
                  title: "What does it do?",
                  content: "It makes state explicit.",
                },
              ]}
            />
          )
        case "Collapsible":
          return (
            <UI.Collapsible title="Show contract" defaultOpen>
              Readable source and typed states.
            </UI.Collapsible>
          )
        case "Breadcrumbs":
        case "Breadcrumb":
          return (
            <UI.Breadcrumb
              items={[{ label: "Docs" }, { label: "Components" }]}
            />
          )
        case "Pagination":
          return <UI.Pagination page={2} pages={5} />
        case "Stepper":
          return (
            <UI.Stepper
              steps={[
                { label: "Draft" },
                { label: "Review" },
                { label: "Ship" },
              ]}
              current={1}
            />
          )
        case "Menu":
          return (
            <UI.Menu items={[{ label: "Overview" }, { label: "Settings" }]} />
          )
        case "DropdownMenu":
          return (
            <UI.DropdownMenu
              label="Actions"
              items={[{ label: "Inspect" }, { label: "Duplicate" }]}
            />
          )
        case "ContextMenu":
          return (
            <UI.ContextMenu
              items={[{ label: "Inspect" }, { label: "Archive" }]}
            >
              <span className="preview-label">More</span>
            </UI.ContextMenu>
          )
        case "Menubar":
          return (
            <UI.Menubar>
              <UI.Link href="#components">File</UI.Link>
              <UI.Link href="#components">Edit</UI.Link>
            </UI.Menubar>
          )
        case "NavigationMenu":
          return (
            <UI.NavigationMenu
              items={[
                { label: "Components", href: "#components" },
                { label: "Agent", href: "#agent" },
              ]}
            />
          )
        case "Sidebar":
          return (
            <UI.Sidebar title="Workspace">
              <UI.Menu items={[{ label: "Overview" }, { label: "Runs" }]} />
            </UI.Sidebar>
          )
        case "Toolbar":
          return (
            <UI.Toolbar>
              <UI.Button size="sm">Undo</UI.Button>
              <UI.Button size="sm">Redo</UI.Button>
            </UI.Toolbar>
          )
        case "Dialog":
          return (
            <UI.Dialog
              title="Review proposal"
              description="The agent prepared a reversible change."
              trigger={<UI.Button>Open dialog</UI.Button>}
              footer={<UI.Button tone="primary">Approve</UI.Button>}
            >
              Three files · low risk · owned by you.
            </UI.Dialog>
          )
        case "AlertDialog":
          return (
            <UI.AlertDialog
              title="Delete draft?"
              trigger={<UI.Button tone="danger">Delete</UI.Button>}
            >
              This cannot be undone.
            </UI.AlertDialog>
          )
        case "Drawer":
          return (
            <UI.Drawer
              title="Run details"
              trigger={<UI.Button>Open drawer</UI.Button>}
            >
              A focused detail surface.
            </UI.Drawer>
          )
        case "Sheet":
          return (
            <UI.Sheet
              title="Run details"
              description="A focused side surface."
              trigger={<UI.Button>Open sheet</UI.Button>}
            >
              The page context remains visible behind this sheet.
            </UI.Sheet>
          )
        case "Popover":
          return (
            <UI.Popover trigger={<UI.Button>Open popover</UI.Button>}>
              <UI.Description>Small contextual detail.</UI.Description>
            </UI.Popover>
          )
        case "Tooltip":
          return (
            <UI.Tooltip content="Copied to clipboard">
              <UI.Button>Hover me</UI.Button>
            </UI.Tooltip>
          )
        case "HoverCard":
          return (
            <UI.HoverCard content="Inspectable source contract">
              <UI.Link href="#components">Hover for details</UI.Link>
            </UI.HoverCard>
          )
        case "Toast":
          return (
            <UI.Toast title="Saved" description="The contract is up to date." />
          )
        case "Toaster":
          return compact ? (
            <UI.Toast title="Synced" description="The contract is current." />
          ) : (
            <UI.Toaster>
              <UI.Toast title="Synced" description="The contract is current." />
            </UI.Toaster>
          )
        case "Command":
          return (
            <UI.Command
              items={[
                { value: "inspect", label: "Inspect component", hint: "I" },
                { value: "add", label: "Add to project", hint: "A" },
              ]}
            />
          )
        case "CommandInput":
          return <UI.CommandInput placeholder="Search commands…" />
        case "CommandList":
          return (
            <UI.CommandList>
              <UI.Button size="sm">Inspect component</UI.Button>
              <UI.Button size="sm">Add to project</UI.Button>
            </UI.CommandList>
          )
        case "Alert":
          return (
            <UI.Alert title="Review required">
              Unknown values stay visible.
            </UI.Alert>
          )
        case "Banner":
          return (
            <UI.Banner title="Registry synced">
              The latest contract is loaded.
            </UI.Banner>
          )
        case "Progress":
          return <UI.Progress value={72} label="Coverage" />
        case "ProgressCircle":
          return <UI.ProgressCircle value={72} />
        case "Meter":
          return <UI.Meter value={72} label="Confidence" />
        case "Spinner":
          return <UI.Spinner label="Loading preview" />
        case "Skeleton":
          return <UI.Skeleton width="100%" height={42} />
        case "LoadingOverlay":
          return (
            <UI.LoadingOverlay loading>
              <UI.Card>
                <UI.CardBody>Loading state</UI.CardBody>
              </UI.Card>
            </UI.LoadingOverlay>
          )
        case "EmptyState":
          return (
            <UI.EmptyState
              title="Nothing here yet"
              description="The next safe action will appear here."
              action={<UI.Button size="sm">Inspect</UI.Button>}
            />
          )
        case "Empty":
          return (
            <UI.Empty
              icon="○"
              title="No runs yet"
              description="Start a run to see activity here."
              action={
                <UI.Button size="sm" tone="primary">
                  Start run
                </UI.Button>
              }
            />
          )
        case "ErrorState":
          return <UI.ErrorState title="Could not load preview" />
        case "Result":
          return (
            <UI.Result
              status="success"
              title="Verified"
              description="No contract drift found."
            />
          )
        case "Status":
          return <UI.Status tone="accent">Ready</UI.Status>
        case "Table":
          return (
            <UI.Table caption="Example surfaces">
              <tbody>
                <tr>
                  <td>Agent</td>
                  <td>Ready</td>
                </tr>
                <tr>
                  <td>Human</td>
                  <td>Review</td>
                </tr>
              </tbody>
            </UI.Table>
          )
        case "DataTable":
          return (
            <UI.DataTable
              caption="Surface inventory"
              data={sampleRows}
              columns={sampleColumns}
              minWidth="100%"
              responsive="auto"
            />
          )
        case "DataGrid":
          return <UI.DataGrid data={sampleRows} columns={sampleColumns} />
        case "List":
          return (
            <UI.List
              items={[
                { title: "Read contract", description: "Succeeded" },
                { title: "Prepare patch", description: "Waiting" },
              ]}
            />
          )
        case "ListItem":
          return (
            <UI.ListItem>
              <strong>Read contract</strong>
            </UI.ListItem>
          )
        case "Item":
          return (
            <UI.Item
              icon="◇"
              title="Read contract"
              description="Succeeded"
              action={<UI.Badge tone="accent">Ready</UI.Badge>}
            />
          )
        case "DescriptionList":
          return (
            <UI.DescriptionList
              items={[
                {
                  label: "Risk",
                  value: <UI.Badge tone="accent">Low</UI.Badge>,
                },
                { label: "Files", value: "3" },
              ]}
            />
          )
        case "Stat":
          return (
            <UI.Stat
              label="Contract coverage"
              value="72%"
              detail="Verified locally"
            />
          )
        case "StatsGrid":
          return (
            <UI.StatsGrid>
              <UI.Stat label="Routes" value="24" />
              <UI.Stat label="Drift" value="0" />
            </UI.StatsGrid>
          )
        case "Timeline":
          return (
            <UI.Timeline
              items={[
                { title: "Read contract", time: "now" },
                { title: "Prepare patch", time: "1m" },
              ]}
            />
          )
        case "Tree":
          return (
            <UI.Tree
              nodes={[
                { label: "src", children: "routes / components" },
                { label: "tests" },
              ]}
            />
          )
        case "FileList":
          return (
            <UI.FileList
              files={[
                { name: "route.ts", size: "4 KB" },
                { name: "schema.ts", size: "2 KB" },
              ]}
            />
          )
        case "DiffViewer":
          return (
            <UI.DiffViewer
              before="- needsReview: true"
              after="+ needsReview: false"
            />
          )
        case "ResizablePanels":
          return (
            <UI.ResizablePanels>
              <UI.Card>
                <UI.CardBody>Source</UI.CardBody>
              </UI.Card>
              <UI.Card>
                <UI.CardBody>Preview</UI.CardBody>
              </UI.Card>
            </UI.ResizablePanels>
          )
        case "Resizable":
          return (
            <UI.Resizable>
              <UI.Badge>Source</UI.Badge>
              <UI.Badge tone="accent">Preview</UI.Badge>
            </UI.Resizable>
          )
        case "PromptComposer":
          return <UI.PromptComposer />
        case "Conversation":
          return (
            <UI.Conversation>
              <UI.Message role="human">Keep it reversible.</UI.Message>
              <UI.Message role="agent">I’ll prepare a draft first.</UI.Message>
            </UI.Conversation>
          )
        case "Message":
          return <UI.Message role="agent">Draft ready for review.</UI.Message>
        case "MessageGroup":
          return (
            <UI.MessageGroup>
              <UI.Message role="human">Propose before acting.</UI.Message>
              <UI.Message role="agent">Understood.</UI.Message>
            </UI.MessageGroup>
          )
        case "MessageScroller":
          return (
            <UI.MessageScroller
              messages={[
                { role: "agent", children: "Contract loaded." },
                { role: "human", children: "Show me the patch." },
              ]}
            />
          )
        case "StreamingText":
          return (
            <UI.StreamingText streaming>
              Preparing the next step
            </UI.StreamingText>
          )
        case "ToolCall":
          return (
            <UI.ToolCall
              name="nifra.validate"
              status="succeeded"
              input="{ scope: 'ui' }"
            />
          )
        case "ToolStatus":
          return <UI.ToolStatus status="running" label="Preparing patch" />
        case "ApprovalCard":
        case "HumanApproval":
          return (
            <UI.ApprovalCard
              title="A human decision is required"
              description="The agent cannot apply this silently."
              approveLabel="Approve & apply"
            />
          )
        case "RunTimeline":
          return (
            <UI.RunTimeline
              runs={[
                { title: "Read contract", status: "succeeded" },
                { title: "Human approval", status: "running" },
              ]}
            />
          )
        case "CitationList":
          return (
            <UI.CitationList
              citations={[
                {
                  title: "Route contract",
                  excerpt: "Verified against the live registry.",
                },
              ]}
            />
          )
        case "SourceCard":
          return (
            <UI.SourceCard
              title="Live component contract"
              excerpt="Readable source for people and agents."
            />
          )
        case "ModelPicker":
          return <UI.ModelPicker models={["Nifra Scout", "Codex review"]} />
        case "TokenUsage":
          return <UI.TokenUsage input={842} output={231} limit={2048} />
        case "ActivityFeed":
          return (
            <UI.ActivityFeed
              items={[
                {
                  title: "Registry synced",
                  detail: "137 contracts available",
                  time: "now",
                  tone: "accent",
                },
              ]}
            />
          )
        default:
          return (
            <UI.Item
              icon="◇"
              title={item.name}
              description="Live source-backed component preview."
            />
          )
      }
    })()
  )
  return (
    <div className={className} data-component-preview={item.name}>
      {content}
    </div>
  )
}

function CodePanel({ code, label }: { code: string; label?: string }) {
  return (
    <div className="code-block-wrap">
      <div className="code-block-head">
        <span>{label ?? "tsx"}</span>
        <CopyButton value={code} />
      </div>
      <pre className="code-panel">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ComponentsPage({
  theme,
  setSection,
}: {
  theme: ThemeName
  setSection: (section: Section) => void
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [scope, setScope] = useState<"core" | "all">("core")
  const [selectedName, setSelectedName] = useState("Button")
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("preview")
  const sourceCatalog =
    scope === "core"
      ? coreNames
          .map((name) => catalog.find((item) => item.name === name))
          .filter((item): item is ComponentMeta => Boolean(item))
      : catalog
  const visibleCatalog = useMemo(
    () =>
      sourceCatalog.filter((item) => {
        const matchesCategory = category === "all" || item.category === category
        const haystack = `${item.name} ${item.description}`.toLowerCase()
        return matchesCategory && haystack.includes(query.toLowerCase())
      }),
    [category, query, sourceCatalog],
  )
  const selectedItem =
    catalog.find((item) => item.name === selectedName) ?? catalog[0]!
  const selectComponent = (name: string) => {
    setSelectedName(name)
    setInspectorTab("preview")
  }
  return (
    <main className="page-main">
      <section className="library-hero">
        <div className="hero-copy-block">
          <p className="eyebrow">
            <span className="status-dot" /> StyleX / open code / agent-ready
          </p>
          <h1>
            Components for software that can <em>explain itself.</em>
          </h1>
          <p className="hero-copy">
            A source-owned component system with a complete standard base, live
            examples, and contracts that make every state legible to people and
            agents.
          </p>
          <div className="hero-actions">
            <button
              className="button-primary"
              type="button"
              onClick={() =>
                document
                  .getElementById("library")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse the library <Arrow />
            </button>
            <button
              className="button-subtle"
              type="button"
              onClick={() => setSection("build")}
            >
              Build your theme <Arrow />
            </button>
          </div>
          <div className="hero-facts">
            <span>
              <strong>{coreNames.length}</strong> core components
            </span>
            <span>
              <strong>{catalog.length}</strong> total contracts
            </span>
            <span>
              <strong>{theme === "dark" ? "dark" : theme}</strong> active theme
            </span>
          </div>
        </div>
        <div className="hero-specimen">
          <div className="specimen-line">
            <span>01 / human gate</span>
            <span>live specimen</span>
          </div>
          <div className="specimen-title">Review before apply</div>
          <p>The component is useful because the agent knows when to stop.</p>
          <UI.ApprovalCard
            title="A human decision is required"
            description="The agent prepared a reversible change. It cannot apply it silently."
            approveLabel="Approve & apply"
          />
          <div className="specimen-foot">
            <span className="status-dot" /> Waiting for a decision{" "}
            <UI.Code>risk: low</UI.Code>
          </div>
        </div>
      </section>
      <section className="library-section" id="library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The library / 01</p>
            <h2>Every component gets a real surface.</h2>
          </div>
          <p>
            Preview it, copy a complete example, see the install command, then
            tune the tokens yourself.
          </p>
        </div>
        <div className="scope-switch" role="tablist" aria-label="Library scope">
          <button
            type="button"
            className={scope === "core" ? "active" : ""}
            onClick={() => {
              setScope("core")
              setSelectedName("Button")
            }}
          >
            Core components <span>{coreNames.length}</span>
          </button>
          <button
            type="button"
            className={scope === "all" ? "active" : ""}
            onClick={() => setScope("all")}
          >
            Full registry <span>{catalog.length}</span>
          </button>
        </div>
        <div className="library-layout">
          <aside className="library-sidebar">
            <div className="sidebar-top">
              <span>Browse {scope === "core" ? "core" : "all"}</span>
              <strong>{visibleCatalog.length}</strong>
            </div>
            <label className="search-field">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search components"
                aria-label="Search components"
              />
            </label>
            <div className="sidebar-label">Categories</div>
            <nav className="category-nav" aria-label="Component categories">
              {categoryOrder.map((key) => {
                const count =
                  key === "all"
                    ? sourceCatalog.length
                    : sourceCatalog.filter((item) => item.category === key)
                        .length
                return (
                  <button
                    type="button"
                    key={key}
                    className={category === key ? "selected" : ""}
                    onClick={() => setCategory(key)}
                  >
                    <span>{categoryShortNames[key]}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </nav>
            <div className="sidebar-rule" />
            <div className="sidebar-note">
              <span className="status-dot" />
              <p>
                Every entry includes live preview, install command, complete
                usage code, and a typed contract.
              </p>
            </div>
          </aside>
          <div className="gallery-column">
            <div className="gallery-toolbar">
              <div>
                <span className="eyebrow">{categoryShortNames[category]}</span>
                <strong>{visibleCatalog.length} components</strong>
              </div>
              <span className="gallery-hint">Click a specimen to inspect</span>
            </div>
            <div className="component-grid">
              {visibleCatalog.map((item) => (
                <article
                  key={item.name}
                  data-component={item.name}
                  className={`component-card ${isWidePreview(item.name) ? "component-card-wide" : ""} ${selectedItem.name === item.name ? "selected" : ""}`}
                >
                  <div className="component-card-preview">
                    <ComponentPreview item={item} compact />
                  </div>
                  <button
                    className="component-card-foot"
                    type="button"
                    onClick={() => selectComponent(item.name)}
                    aria-label={`Inspect ${item.name}`}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </div>
                    <Arrow />
                  </button>
                </article>
              ))}
              {visibleCatalog.length === 0 && (
                <div className="no-results">
                  <strong>No components found.</strong>
                  <span>Try a different search or category.</span>
                </div>
              )}
            </div>
          </div>
          <aside
            className="inspector"
            aria-label={`${selectedItem.name} inspector`}
          >
            <div className="inspector-top">
              <div>
                <p className="eyebrow">Live inspector</p>
                <h3>{selectedItem.name}</h3>
              </div>
              <UI.Badge tone="accent">
                {selectedItem.kind === "standard" ? "Core" : selectedItem.kind}
              </UI.Badge>
            </div>
            <div className="inspector-stage">
              <ComponentPreview item={selectedItem} inspector />
            </div>
            <div
              className="inspector-tabs"
              role="tablist"
              aria-label="Component details"
            >
              {(
                [
                  "preview",
                  "install",
                  "usage",
                  "source",
                  "contract",
                ] as InspectorTab[]
              ).map((tab) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={inspectorTab === tab}
                  key={tab}
                  onClick={() => setInspectorTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {inspectorTab === "preview" && (
              <div className="inspector-copy">
                <p>{selectedItem.description}</p>
                <div className="preview-inspector-note">
                  <span className="live-dot" />
                  <div>
                    <strong>Interactive specimen</strong>
                    <span>
                      Try the control above. The preview uses the same exported
                      component as the package.
                    </span>
                  </div>
                </div>
                <div className="contract-summary">
                  <div>
                    <span>Preview</span>
                    <strong>
                      <span className="live-dot" /> Live
                    </strong>
                  </div>
                  <div>
                    <span>States</span>
                    <strong>
                      {selectedItem.states.slice(0, 5).join(" · ")}
                    </strong>
                  </div>
                </div>
                <div className="inspector-example-count">
                  <span>
                    {selectedItem.docs.examples.length} documented example
                    {selectedItem.docs.examples.length === 1 ? "" : "s"}
                  </span>
                  <button
                    className="text-link"
                    type="button"
                    onClick={() => setInspectorTab("usage")}
                  >
                    View examples <Arrow />
                  </button>
                </div>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => setInspectorTab("usage")}
                >
                  Get the full code <Arrow />
                </button>
              </div>
            )}
            {inspectorTab === "install" && (
              <div className="inspector-copy">
                <div className="panel-label">Install this component</div>
                <p className="inspector-section-copy">
                  Use the CLI to copy the source into your project, or install
                  the package for a shared import.
                </p>
                <CodePanel
                  code={selectedItem.docs.install.command}
                  label="bun"
                />
                <div className="install-manual">
                  <div className="panel-label">Manual import</div>
                  <CodePanel
                    code={`bun add @nifrajs/ui @stylexjs/stylex\n\n${selectedItem.docs.install.manual}`}
                    label="manual"
                  />
                </div>
                <p className="microcopy">
                  The CLI copies the source into your project so you own the
                  implementation. Add <UI.Code>@stylexjs/stylex</UI.Code> if
                  your project does not already have it.
                </p>
              </div>
            )}
            {inspectorTab === "usage" && (
              <div className="inspector-copy">
                <div className="panel-label">Complete usage examples</div>
                <p className="inspector-section-copy">
                  {selectedItem.docs.usageNotes}
                </p>
                <div className="example-stack">
                  {selectedItem.docs.examples.map((example) => (
                    <section className="example-section" key={example.title}>
                      <div className="example-heading">
                        <div>
                          <strong>{example.title}</strong>
                          <span>{example.description}</span>
                        </div>
                      </div>
                      <CodePanel code={example.code} label="tsx" />
                    </section>
                  ))}
                </div>
              </div>
            )}
            {inspectorTab === "source" && (
              <div className="inspector-copy">
                <div className="panel-label">
                  Source ownership &amp; copy surface
                </div>
                <p className="inspector-section-copy">
                  The install command copies the implementation into your app.
                  The usage below is intentionally complete and ready to paste.
                </p>
                <CodePanel
                  code={`// Source: packages/ui/${selectedItem.sourceFiles[0]}\n\n${selectedItem.docs.examples[0]?.code ?? selectedItem.usageCode}`}
                  label="source + usage"
                />
                <p className="microcopy">
                  The implementation is open, local, and StyleX-powered. Nothing
                  is hidden behind a runtime service.
                </p>
              </div>
            )}
            {inspectorTab === "contract" && (
              <div className="contract-copy">
                <div>
                  <span>Documentation</span>
                  <strong>
                    {selectedItem.docs.examples.length} examples · install +
                    usage + source
                  </strong>
                </div>
                <div>
                  <span>Accessibility</span>
                  <strong>{selectedItem.accessibility.join(" · ")}</strong>
                </div>
                <div>
                  <span>Variants</span>
                  <strong>{selectedItem.variants.join(" · ")}</strong>
                </div>
                <div>
                  <span>Dependencies</span>
                  <strong>{selectedItem.dependencies.join(" · ")}</strong>
                </div>
                <div>
                  <span>Targets</span>
                  <strong>
                    {Object.entries(selectedItem.targets)
                      .map(([target, status]) => `${target}: ${status}`)
                      .join(" · ")}
                  </strong>
                </div>
                <div>
                  <span>Agent guidance</span>
                  <strong>{selectedItem.agentNotes[0]}</strong>
                </div>
              </div>
            )}
            <a
              className="inspector-source"
              href="https://github.com/nifrajs/nifra-ui"
              target="_blank"
              rel="noreferrer"
            >
              Open source on GitHub <Arrow />
            </a>
          </aside>
        </div>
      </section>
    </main>
  )
}

function DocsPage({ setSection }: { setSection: (section: Section) => void }) {
  const packageInstall = `bun add @nifrajs/ui @stylexjs/stylex`
  const sourceInstall = `bunx @nifrajs/ui-cli add button dialog data-table --out src/nifra-ui`
  const usageCode = `import { Button } from "@nifrajs/ui"\n\nexport function SaveButton() {\n  return (\n    <Button tone="primary" size="lg" type="submit">\n      Save changes\n    </Button>\n  )\n}`
  const themeCode = `import { ThemeProvider } from "@nifrajs/ui"\nimport "@nifrajs/ui/styles.css"\n\nexport function AppRoot() {\n  return (\n    <ThemeProvider theme="light">\n      <App />\n    </ThemeProvider>\n  )\n}`
  const styleCode = `const buttonStyles = stylex.create({\n  custom: {\n    borderRadius: "var(--nui-radius-lg)",\n    letterSpacing: "-0.01em",\n  },\n})\n\n<Button xstyle={buttonStyles.custom}>\n  Your surface\n</Button>`
  const registryCode = `import { catalogByName } from "@nifrajs/ui-registry"\n\nconst button = catalogByName.Button\n\nbutton.docs.examples\nbutton.states\nbutton.accessibility\nbutton.agentNotes\nbutton.targets`
  const mcpCode = `// read-only discovery\n{\n  "tool": "inspect_component",\n  "arguments": { "name": "Checkbox" }\n}`
  return (
    <main className="page-main docs-page">
      <div className="docs-hero">
        <p className="eyebrow">Documentation / 02</p>
        <h1>
          Everything you need to <em>ship with confidence.</em>
        </h1>
        <p>
          Install the primitives, copy complete examples, and keep the source
          and contract close to the code. Nifra UI is a toolkit you can own, not
          a hosted skin you have to work around.
        </p>
      </div>
      <div className="docs-overview-grid" aria-label="Documentation sections">
        <a className="docs-overview-card" href="#installation">
          <span className="docs-card-index">01</span>
          <strong>Installation</strong>
          <span>Package imports and source-owned setup.</span>
        </a>
        <a className="docs-overview-card" href="#usage">
          <span className="docs-card-index">02</span>
          <strong>Components</strong>
          <span>Complete examples with accessible states.</span>
        </a>
        <a className="docs-overview-card" href="#theming">
          <span className="docs-card-index">03</span>
          <strong>Theming</strong>
          <span>Semantic tokens and StyleX composition.</span>
        </a>
        <a className="docs-overview-card" href="#agent">
          <span className="docs-card-index">04</span>
          <strong>Agent integration</strong>
          <span>Discovery without invented APIs.</span>
        </a>
        <a className="docs-overview-card" href="#frameworks">
          <span className="docs-card-index">05</span>
          <strong>Framework targets</strong>
          <span>React reference and native browser elements.</span>
        </a>
      </div>
      <div className="docs-layout">
        <nav className="docs-toc" aria-label="Documentation">
          <a className="active" href="#installation">
            Installation
          </a>
          <a href="#usage">Components</a>
          <a href="#theming">Theming</a>
          <a href="#cli">CLI</a>
          <a href="#registry">Registry</a>
          <a href="#agent">Agent integration</a>
          <a href="#frameworks">Framework targets</a>
        </nav>
        <div className="docs-content">
          <section id="installation" className="docs-section">
            <p className="eyebrow">01 / install</p>
            <h2>Install once. Own the surface.</h2>
            <p>
              Choose the package for shared imports or the CLI when the
              component should live inside your repository. Both paths use the
              same exports, tokens, and contract.
            </p>
            <div className="docs-split">
              <div className="docs-card">
                <div className="docs-card-heading">
                  <strong>Package install</strong>
                  <span>Shared dependency</span>
                </div>
                <p>Use the published primitives from any React application.</p>
                <CodePanel code={packageInstall} label="terminal" />
              </div>
              <div className="docs-card">
                <div className="docs-card-heading">
                  <strong>Source-owned install</strong>
                  <span>Editable source</span>
                </div>
                <p>Copy only the components your product needs into source.</p>
                <CodePanel code={sourceInstall} label="terminal" />
              </div>
            </div>
            <div className="docs-note">
              <strong>Build requirement</strong>
              <span>
                Add the StyleX Babel plugin to the consuming application. Import
                the shipped token stylesheet as{" "}
                <UI.Code>@nifrajs/ui/styles.css</UI.Code>.
              </span>
            </div>
          </section>
          <section id="frameworks" className="docs-section">
            <p className="eyebrow">07 / framework targets</p>
            <h2>One contract. Native renderers.</h2>
            <p>
              React is the full-catalogue reference. The public alpha also ships
              native Vue, Svelte, Solid, and Vanilla adapters for the first 11
              components, so teams can adopt the same interaction contract
              without shipping React into another runtime.
            </p>
            <div className="docs-detail-grid">
              {adapterManifest.map((adapter) => (
                <div key={adapter.target}>
                  <span>
                    {adapter.target === "web-components"
                      ? "Vanilla"
                      : adapter.target}
                  </span>
                  <strong>
                    {adapter.status === "reference" ? "Reference" : "Alpha"} ·{" "}
                    {adapter.components.length} core components
                  </strong>
                </div>
              ))}
            </div>
            <CodePanel
              code={`bun add @nifrajs/ui-vue @nifrajs/ui-svelte @nifrajs/ui-solid @nifrajs/ui-elements\n\n// Vue\nimport { Button } from "@nifrajs/ui-vue"\n\n// Svelte\nimport { Button } from "@nifrajs/ui-svelte"\n\n// Solid\nimport { Button } from "@nifrajs/ui-solid"\n\n// Vanilla Web Components\nimport "@nifrajs/ui-elements/styles.css"\nimport "@nifrajs/ui-elements"`}
              label="framework packages"
            />
            <p className="microcopy">
              Every adapter exposes the same core semantics. Structured table
              values use framework props, native elements receive attributes,
              and events preserve the shared vocabulary. Full screen recipes
              remain React-only until their target-specific renderers are
              verified.
            </p>
          </section>
          <section id="usage" className="docs-section">
            <p className="eyebrow">02 / components</p>
            <h2>Every example is ready to paste.</h2>
            <p>
              Each library entry includes the import, implementation shape, live
              rendering, documented states, and a complete usage example. Browse{" "}
              <button
                className="inline-link"
                type="button"
                onClick={() => setSection("components")}
              >
                the component library <Arrow />
              </button>{" "}
              to copy one.
            </p>
            <CodePanel code={usageCode} label="tsx" />
            <div className="docs-detail-grid">
              <div>
                <span>States</span>
                <strong>default · hover · focus · disabled · invalid</strong>
              </div>
              <div>
                <span>Composition</span>
                <strong>Native props plus semantic StyleX tokens</strong>
              </div>
              <div>
                <span>Accessibility</span>
                <strong>
                  Semantic HTML · keyboard reachable · visible focus
                </strong>
              </div>
            </div>
          </section>
          <section id="theming" className="docs-section">
            <p className="eyebrow">03 / theming</p>
            <h2>Tokens are the customization API.</h2>
            <p>
              Start with the neutral light or dark theme, then compose your own
              surface with semantic variables. Component APIs stay stable while
              the visual system changes underneath them.
            </p>
            <CodePanel code={themeCode} label="tsx" />
            <CodePanel code={styleCode} label="tsx" />
            <div className="docs-token-table">
              <div className="docs-token-row docs-token-head">
                <span>Token</span>
                <span>Purpose</span>
                <span>Light default</span>
              </div>
              <div className="docs-token-row">
                <code>--nui-bg</code>
                <span>Page background</span>
                <strong>#ffffff</strong>
              </div>
              <div className="docs-token-row">
                <code>--nui-accent</code>
                <span>Primary action and selection</span>
                <strong>#111111</strong>
              </div>
              <div className="docs-token-row">
                <code>--nui-border</code>
                <span>Quiet component boundaries</span>
                <strong>#e4e4e7</strong>
              </div>
            </div>
          </section>
          <section id="cli" className="docs-section">
            <p className="eyebrow">04 / cli</p>
            <h2>Source-owned from the first command.</h2>
            <p>
              The CLI is deliberately small: discover the vocabulary, inspect
              the contract, copy source, then validate the local bundle.
            </p>
            <div className="docs-command-table">
              <div className="docs-command-row docs-command-head">
                <span>Command</span>
                <span>What it does</span>
              </div>
              <div className="docs-command-row">
                <code>list</code>
                <span>Browse every contract and category.</span>
              </div>
              <div className="docs-command-row">
                <code>inspect button</code>
                <span>Read install, usage, states, and accessibility.</span>
              </div>
              <div className="docs-command-row">
                <code>add button</code>
                <span>Copy the editable source bundle into your project.</span>
              </div>
              <div className="docs-command-row">
                <code>validate</code>
                <span>Check the installed source and manifest.</span>
              </div>
            </div>
          </section>
          <section id="registry" className="docs-section">
            <p className="eyebrow">05 / registry</p>
            <h2>Machine-readable without losing the human view.</h2>
            <p>
              The registry carries the same information the inspector shows:
              install commands, imports, examples, dependencies, variants,
              preview status, states, and agent notes.
            </p>
            <CodePanel code={registryCode} label="tsx" />
            <button
              className="button-primary"
              type="button"
              onClick={() => setSection("directory")}
            >
              Open registry directory <Arrow />
            </button>
          </section>
          <section id="agent" className="docs-section">
            <p className="eyebrow">06 / agents</p>
            <h2>Give agents a verified vocabulary.</h2>
            <p>
              Use the read-only MCP server to discover existing components and
              validate composition before code is generated. Approval, tool
              calls, citations, streaming, and run timelines use the same
              source-owned system as the standard base.
            </p>
            <CodePanel code={mcpCode} label="json" />
            <div className="docs-command-table">
              <div className="docs-command-row docs-command-head">
                <span>Tool</span>
                <span>Use it for</span>
              </div>
              <div className="docs-command-row">
                <code>list_components</code>
                <span>Discover the available component vocabulary.</span>
              </div>
              <div className="docs-command-row">
                <code>inspect_component</code>
                <span>Read the API, states, source, and guidance.</span>
              </div>
              <div className="docs-command-row">
                <code>validate_contract</code>
                <span>Reject invented names before composition.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function BuildPage() {
  const [accent, setAccent] = useState("ink")
  const [radius, setRadius] = useState("10px")
  const [density, setDensity] = useState("comfortable")
  const accentValues: Record<string, string> = {
    ink: "#111111",
    mint: "#65d0a4",
    amber: "#f0b05c",
    blue: "#7eb7f1",
    coral: "#ff8d7e",
  }
  const radiusLg =
    radius === "6px" ? "10px" : radius === "10px" ? "16px" : "22px"
  const customStyle = {
    "--nui-accent": accentValues[accent],
    "--nui-accent-strong": accentValues[accent],
    "--nui-radius-md": radius,
    "--nui-radius-lg": radiusLg,
  } as CSSProperties & Record<string, string>
  const exportCode = `:root {\n  --nui-accent: ${accentValues[accent]};\n  --nui-radius-md: ${radius};\n  --nui-radius-lg: ${radiusLg};\n  --nui-density: ${density};\n}`
  return (
    <main className="page-main build-page">
      <div className="build-hero">
        <div>
          <p className="eyebrow">Build your own / 03</p>
          <h1>
            Make the system <em>recognizably yours.</em>
          </h1>
          <p>
            Change the tokens, see the component respond, and export the exact
            StyleX-compatible values.
          </p>
        </div>
        <div className="builder-status">
          <span className="live-dot" /> Live token preview
        </div>
      </div>
      <div className="builder-layout">
        <aside className="builder-controls">
          <div className="control-group">
            <div className="control-label">
              <span>Accent</span>
              <strong>{accent}</strong>
            </div>
            <div className="swatch-row">
              {Object.keys(accentValues).map((name) => (
                <button
                  type="button"
                  key={name}
                  aria-label={`Use ${name} accent`}
                  className={`swatch ${accent === name ? "active" : ""}`}
                  style={{ backgroundColor: accentValues[name] }}
                  onClick={() => setAccent(name)}
                />
              ))}
            </div>
          </div>
          <div className="control-group">
            <div className="control-label">
              <span>Radius</span>
              <strong>{radius}</strong>
            </div>
            <div className="segmented-control">
              {["6px", "10px", "16px"].map((value) => (
                <button
                  type="button"
                  className={radius === value ? "active" : ""}
                  key={value}
                  onClick={() => setRadius(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <div className="control-label">
              <span>Density</span>
              <strong>{density}</strong>
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={density === "compact" ? "active" : ""}
                onClick={() => setDensity("compact")}
              >
                Compact
              </button>
              <button
                type="button"
                className={density === "comfortable" ? "active" : ""}
                onClick={() => setDensity("comfortable")}
              >
                Comfortable
              </button>
            </div>
          </div>
          <div className="builder-export">
            <div className="panel-label">Export tokens</div>
            <CodePanel code={exportCode} label="css" />
          </div>
        </aside>
        <div className="builder-canvas" style={customStyle}>
          <div className="canvas-toolbar">
            <span>Preview canvas</span>
            <UI.Badge tone="accent">
              {accent} / {radius}
            </UI.Badge>
          </div>
          <div className="canvas-grid">
            <div className="canvas-column">
              <UI.Typography as="h2" variant="display">
                Build with intent.
              </UI.Typography>
              <UI.Typography variant="muted">
                The same component responds to your tokens.
              </UI.Typography>
              <div className="canvas-actions">
                <UI.Button tone="primary">
                  Continue <Arrow />
                </UI.Button>
                <UI.Button>Secondary</UI.Button>
              </div>
              <UI.Field label="Project name" htmlFor="builder-name">
                <UI.Input id="builder-name" defaultValue="Northstar" />
              </UI.Field>
            </div>
            <div className="canvas-column">
              <UI.Card>
                <UI.CardHeader>
                  <UI.Inline wrap={false}>
                    <UI.Avatar name="Nifra" size={30} />
                    <UI.Stack gap={2}>
                      <strong>Proposal ready</strong>
                      <UI.Description>2 minutes ago</UI.Description>
                    </UI.Stack>
                  </UI.Inline>
                </UI.CardHeader>
                <UI.CardBody>
                  <UI.Stack gap={12}>
                    <UI.Progress value={72} label="Contract coverage" />
                    <UI.ButtonGroup>
                      <UI.Button size="sm" tone="primary">
                        Approve
                      </UI.Button>
                      <UI.Button size="sm">Review</UI.Button>
                    </UI.ButtonGroup>
                  </UI.Stack>
                </UI.CardBody>
              </UI.Card>
            </div>
          </div>
          <VanillaElementsSpecimen />
        </div>
      </div>
    </main>
  )
}

function VanillaElementsSpecimen() {
  useEffect(() => {
    const table = document.querySelector("#vanilla-elements-table") as
      | (HTMLElement & {
          columns?: Array<{
            key: string
            header: string
            width?: string
            sortable?: boolean
            render?: (
              value: unknown,
              row: Record<string, unknown>,
            ) => Node | string | null
          }>
          data?: Record<string, unknown>[]
          selectedKeys?: Array<string | number>
        })
      | null
    if (!table) return
    table.columns = [
      { key: "name", header: "Run", width: "48%", sortable: true },
      {
        key: "status",
        header: "Status",
        width: "24%",
        render: (value) => {
          const badge = document.createElement("nui-badge")
          badge.setAttribute("size", "sm")
          badge.setAttribute("tone", value === "Ready" ? "accent" : "neutral")
          badge.textContent = String(value)
          return badge
        },
      },
      { key: "owner", header: "Owner", width: "28%" },
    ]
    table.data = [
      {
        id: "run-042",
        name: "Route audit",
        status: "Ready",
        owner: "Maya Chen",
      },
      {
        id: "run-041",
        name: "Schema check",
        status: "Review",
        owner: "Sam Lee",
      },
    ]
    table.selectedKeys = ["run-042"]
  }, [])

  return (
    <section className="vanilla-specimen" aria-label="Vanilla adapter preview">
      <div className="vanilla-specimen-heading">
        <div>
          <span className="eyebrow">Framework-free target</span>
          <strong>Native elements, same contract.</strong>
        </div>
        <UI.Code>no React runtime</UI.Code>
      </div>
      <div className="vanilla-specimen-actions">
        {createElement(
          "nui-button",
          { tone: "primary", size: "sm" },
          "Approve & apply",
        )}
        {createElement("nui-badge", { tone: "accent", size: "sm" }, "Ready")}
      </div>
      {createElement("nui-data-table", {
        id: "vanilla-elements-table",
        caption: "Native recent runs",
        responsive: "auto",
        selectable: true,
      })}
      <p>
        `@nifrajs/ui-elements` uses attributes for simple values, properties for
        data, and `nui-change` / `nui-selection-change` events for state.
      </p>
    </section>
  )
}

function DirectoryPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")
  const normalizedQuery = query.trim().toLowerCase()
  const entries = catalog.filter((item) => {
    const matchesCategory = category === "all" || item.category === category
    const haystack =
      `${item.name} ${item.description} ${item.kind}`.toLowerCase()
    return matchesCategory && haystack.includes(normalizedQuery)
  })
  const groupKeys = categoryOrder.filter(
    (key): key is Exclude<CategoryFilter, "all"> =>
      key !== "all" && entries.some((item) => item.category === key),
  )
  const kindLabel = (kind: ComponentMeta["kind"]) =>
    kind === "standard" ? "Core" : kind[0].toUpperCase() + kind.slice(1)

  return (
    <main className="page-main directory-page">
      <div className="directory-hero">
        <p className="eyebrow">Registry directory / 04</p>
        <h1>
          A component index built for <em>people and agents.</em>
        </h1>
        <p>
          Browse the complete source-owned catalogue by category. Every entry
          exposes its live specimen, install command, source contract, states,
          and accessibility guidance.
        </p>
        <div className="directory-stats">
          <span>
            <strong>{catalog.length}</strong> contracts
          </span>
          <span>
            <strong>{coreNames.length}</strong> core
          </span>
          <span>
            <strong>100%</strong> live preview
          </span>
        </div>
      </div>
      <div className="directory-toolbar">
        <div className="directory-toolbar-copy">
          <span className="eyebrow">Browse the registry</span>
          <strong>
            {entries.length} result{entries.length === 1 ? "" : "s"}
          </strong>
        </div>
        <label className="search-field">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or intent"
            aria-label="Search registry"
          />
        </label>
      </div>
      <div
        className="directory-filters"
        role="tablist"
        aria-label="Registry categories"
      >
        {categoryOrder.map((key) => {
          const count =
            key === "all"
              ? catalog.length
              : catalog.filter((item) => item.category === key).length
          return (
            <button
              type="button"
              role="tab"
              aria-selected={category === key}
              className={category === key ? "active" : ""}
              key={key}
              onClick={() => setCategory(key)}
            >
              <span>{categoryShortNames[key]}</span>
              <small>{count}</small>
            </button>
          )
        })}
      </div>
      <div className="directory-groups">
        {groupKeys.map((key) => {
          const items = entries.filter((item) => item.category === key)
          return (
            <section className="directory-group" key={key}>
              <div className="directory-group-heading">
                <div>
                  <p className="eyebrow">{categoryShortNames[key]}</p>
                  <h2>{categoryShortNames[key]}</h2>
                </div>
                <span>
                  {items.length} component{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="directory-grid">
                {items.map((item) => (
                  <article
                    className="directory-card"
                    data-component={item.name}
                    key={item.name}
                  >
                    <div className="directory-card-preview">
                      <ComponentPreview item={item} compact />
                    </div>
                    <div className="directory-card-body">
                      <div className="directory-card-heading">
                        <h3>{item.name}</h3>
                        <UI.Badge
                          tone={item.kind === "standard" ? "accent" : "neutral"}
                        >
                          {kindLabel(item.kind)}
                        </UI.Badge>
                      </div>
                      <p>{item.description}</p>
                      <div className="directory-card-footer">
                        <code>{item.installCommand}</code>
                        <span className="directory-live">
                          <span className="live-dot" /> live
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
        {entries.length === 0 && (
          <div className="no-results">
            <strong>No matching contracts.</strong>
            <span>Try a different name, intent, or category.</span>
          </div>
        )}
      </div>
    </main>
  )
}

const screenExampleCode: Record<string, string> = {
  "review-workbench": `import {
  ReviewWorkbench,
  exampleReviewFiles,
  exampleReviewRun,
} from "@nifrajs/ui-screens"

export function ReviewRoute() {
  return (
    <ReviewWorkbench
      run={exampleReviewRun}
      files={exampleReviewFiles}
      onApprove={() => approveRun(exampleReviewRun.id)}
      onReject={() => rejectRun(exampleReviewRun.id)}
    />
  )
}`,
  "run-history": `import { RunHistoryScreen, exampleRunHistory } from "@nifrajs/ui-screens"

export function HistoryRoute() {
  return <RunHistoryScreen runs={exampleRunHistory} />
}`,
  "approval-inbox": `import {
  ApprovalInboxScreen,
  exampleApprovalRequests,
} from "@nifrajs/ui-screens"

export function ApprovalRoute() {
  return (
    <ApprovalInboxScreen
      requests={exampleApprovalRequests}
      onReview={(request) => openReview(request.id)}
      onApprove={(request) => approveRequest(request.id)}
    />
  )
}`,
  "workspace-settings": `import {
  WorkspaceSettingsScreen,
  exampleWorkspaceSettings,
} from "@nifrajs/ui-screens"

export function SettingsRoute() {
  return (
    <WorkspaceSettingsScreen
      settings={exampleWorkspaceSettings}
      onSave={(next) => saveWorkspaceSettings(next)}
    />
  )
}`,
  "onboarding-recovery": `import { OnboardingRecoveryScreen } from "@nifrajs/ui-screens"

export function FirstRunRoute() {
  return (
    <OnboardingRecoveryScreen
      onContinue={() => continueSetup()}
      onRetry={() => retrySetup()}
    />
  )
}`,
}

function ScreensPage() {
  const [selectedId, setSelectedId] = useState(screenManifests[0]?.id ?? "")
  const selected =
    screenManifests.find((screen) => screen.id === selectedId) ??
    screenManifests[0]!
  const renderScreen = () => {
    switch (selected.id) {
      case "review-workbench":
        return (
          <ReviewWorkbench
            run={exampleReviewRun}
            files={exampleReviewFiles}
            onApprove={() => undefined}
            onReject={() => undefined}
            onOpenFile={() => undefined}
          />
        )
      case "run-history":
        return <RunHistoryScreen runs={exampleRunHistory} />
      case "approval-inbox":
        return (
          <ApprovalInboxScreen
            requests={exampleApprovalRequests}
            onReview={() => undefined}
            onApprove={() => undefined}
          />
        )
      case "workspace-settings":
        return (
          <WorkspaceSettingsScreen
            settings={exampleWorkspaceSettings}
            onSave={() => undefined}
          />
        )
      case "onboarding-recovery":
        return (
          <OnboardingRecoveryScreen
            onContinue={() => undefined}
            onRetry={() => undefined}
          />
        )
      default:
        return null
    }
  }
  return (
    <main className="page-main screens-page">
      <div className="screens-hero">
        <p className="eyebrow">Free screens / 03</p>
        <h1>
          Real product surfaces, <em>ready to own.</em>
        </h1>
        <p>
          Original MIT recipes for agentic workflows. Start with a complete
          React reference, replace the fixtures with your data, and keep every
          decision at your application boundary.
        </p>
        <div className="screens-targets" aria-label="Screen targets">
          {(["react", "vue", "svelte", "solid", "web-components"] as const).map(
            (target) => (
              <span
                className={`screen-target ${target === "react" ? "reference" : "planned"}`}
                key={target}
              >
                <span className="screen-target-dot" />
                {target === "web-components" ? "Vanilla elements" : target}
                <small>{target === "react" ? "reference" : "planned"}</small>
              </span>
            ),
          )}
        </div>
      </div>
      <div className="screens-layout">
        <aside className="screens-sidebar" aria-label="Free screen recipes">
          <div className="screens-sidebar-heading">
            <span className="eyebrow">Recipes</span>
            <strong>{screenManifests.length}</strong>
          </div>
          <div className="screens-nav">
            {screenManifests.map((screen, index) => (
              <button
                type="button"
                className={selected.id === screen.id ? "active" : ""}
                aria-pressed={selected.id === screen.id}
                key={screen.id}
                onClick={() => setSelectedId(screen.id)}
              >
                <span className="screens-nav-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{screen.title}</strong>
                  <small>{screen.intent}</small>
                </span>
                <Arrow />
              </button>
            ))}
          </div>
          <div className="screens-sidebar-note">
            <span className="live-dot" />
            <span>
              Fixtures are fictional. Swap them at the route boundary.
            </span>
          </div>
        </aside>
        <section
          className="screen-showcase"
          aria-label={`${selected.title} preview`}
        >
          <div className="screen-showcase-heading">
            <div>
              <p className="eyebrow">Live recipe / {selected.id}</p>
              <h2>{selected.title}</h2>
            </div>
            <UI.Badge tone="accent">React reference</UI.Badge>
          </div>
          <div className="screen-showcase-stage">{renderScreen()}</div>
          <div className="screen-showcase-contract">
            <div>
              <span>Regions</span>
              <strong>{selected.regions.join(" · ")}</strong>
            </div>
            <div>
              <span>Primitives</span>
              <strong>{selected.primitives.join(" · ")}</strong>
            </div>
            <div>
              <span>States</span>
              <strong>{selected.states.join(" · ")}</strong>
            </div>
          </div>
          <CodePanel code={screenExampleCode[selected.id] ?? ""} label="tsx" />
        </section>
      </div>
    </main>
  )
}

function App() {
  const [theme, setTheme] = useState<ThemeName>("light")
  const [section, setSection] = useState<Section>("components")
  const cycleTheme = () =>
    setTheme(
      theme === "light" ? "dark" : theme === "dark" ? "high-contrast" : "light",
    )
  return (
    <UI.ThemeProvider theme={theme}>
      <div className="docs-shell">
        <header className="site-header">
          <div className="header-inner">
            <button
              className="wordmark"
              type="button"
              onClick={() => setSection("components")}
            >
              <Mark />
              <span>Nifra UI</span>
            </button>
            <nav className="site-nav" aria-label="Primary navigation">
              {(
                [
                  "components",
                  "docs",
                  "build",
                  "screens",
                  "directory",
                ] as Section[]
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={section === item ? "active" : ""}
                  onClick={() => setSection(item)}
                >
                  {item === "build" ? (
                    <>
                      <span className="nav-wide-label">Build your own</span>
                      <span className="nav-short-label">Build</span>
                    </>
                  ) : (
                    item[0].toUpperCase() + item.slice(1)
                  )}
                </button>
              ))}
              <a
                href="https://github.com/nifrajs/nifra-ui"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow />
              </a>
            </nav>
            <div className="header-actions">
              <button
                className="header-command"
                type="button"
                onClick={() => setSection("components")}
              >
                <span>⌕</span> Search <kbd>⌘ K</kbd>
              </button>
              <button
                className="theme-button"
                type="button"
                onClick={cycleTheme}
                aria-label={`Theme: ${theme}`}
              >
                {theme === "dark" ? "☾" : theme === "light" ? "◐" : "◒"}
              </button>
            </div>
          </div>
        </header>
        <div className="section-view">
          {section === "components" && (
            <ComponentsPage theme={theme} setSection={setSection} />
          )}
          {section === "docs" && <DocsPage setSection={setSection} />}
          {section === "build" && <BuildPage />}
          {section === "screens" && <ScreensPage />}
          {section === "directory" && <DirectoryPage />}
        </div>
        <footer className="site-footer">
          <button
            className="wordmark"
            type="button"
            onClick={() => setSection("components")}
          >
            <Mark />
            <span>Nifra UI</span>
          </button>
          <span>StyleX · source-owned · MIT</span>
          <a
            href="https://github.com/nifrajs/nifra-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
        </footer>
      </div>
    </UI.ThemeProvider>
  )
}

import { createRoot } from "react-dom/client"

const docsWindow = window as Window & {
  __nifraUiRoot?: ReturnType<typeof createRoot>
}
const docsRoot =
  docsWindow.__nifraUiRoot ??
  (docsWindow.__nifraUiRoot = createRoot(document.getElementById("root")!))
docsRoot.render(<App />)
