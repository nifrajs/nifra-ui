import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DataTable,
  type DataTableColumn,
  Empty,
  EmptyState,
  ErrorState,
  Field,
  Input,
  MessageScroller,
  Progress,
  RadioGroup,
  Result,
  Stack,
  Stepper,
  Switch,
  Tabs,
  Toast,
} from "@nifrajs/ui"
import * as stylex from "@stylexjs/stylex"
import { type ReactNode, useState } from "react"

const tokens = {
  surface: "var(--nui-surface)",
  surfaceRaised: "var(--nui-surface-raised)",
  text: "var(--nui-text)",
  textMuted: "var(--nui-text-muted)",
  border: "var(--nui-border)",
  borderStrong: "var(--nui-border-strong)",
  accent: "var(--nui-accent)",
  accentSoft: "var(--nui-accent-soft)",
  danger: "var(--nui-danger)",
  radiusMd: "var(--nui-radius-md)",
  fontMono: "var(--nui-font-mono)",
} as const

const styles = stylex.create({
  screen: {
    display: "grid",
    gap: 18,
    width: "100%",
    maxWidth: 1240,
    marginInline: "auto",
    padding: "32px 24px 56px",
    color: tokens.text,
  },
  screenHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  headerCopy: { display: "grid", gap: 8, minWidth: 0 },
  eyebrow: {
    color: tokens.textMuted,
    fontFamily: tokens.fontMono,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 48px)",
    letterSpacing: "-0.06em",
    lineHeight: 1,
  },
  lead: {
    maxWidth: 620,
    margin: 0,
    color: tokens.textMuted,
    fontSize: 15,
    lineHeight: 1.55,
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
    alignItems: "start",
    gap: 18,
  },
  panel: { minWidth: 0, overflow: "hidden" },
  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  panelTitle: { display: "grid", gap: 4, minWidth: 0 },
  panelTitleStrong: { fontSize: 15, letterSpacing: "-0.02em" },
  panelHint: { color: tokens.textMuted, fontSize: 12, lineHeight: 1.45 },
  tableBody: { padding: 0 },
  tableCell: { display: "grid", gap: 2, minWidth: 0 },
  tablePrimary: {
    overflow: "hidden",
    fontSize: 13,
    fontWeight: 750,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tableSecondary: {
    overflow: "hidden",
    color: tokens.textMuted,
    fontFamily: tokens.fontMono,
    fontSize: 10,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tableAction: { justifyContent: "flex-start" },
  panelFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  footerMeta: { color: tokens.textMuted, fontSize: 12, lineHeight: 1.45 },
  decisionRail: { display: "grid", gap: 14 },
  decisionHeader: { display: "flex", alignItems: "center", gap: 10 },
  decisionIdentity: { display: "grid", gap: 2, minWidth: 0 },
  decisionName: { fontSize: 14, fontWeight: 800 },
  decisionRole: { color: tokens.textMuted, fontSize: 11 },
  railRule: { height: 1, backgroundColor: tokens.border },
  railNote: { color: tokens.textMuted, fontSize: 12, lineHeight: 1.55 },
  conversation: { minWidth: 0 },
  history: { display: "grid", gap: 18 },
  historyToolbar: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 18,
  },
  historySearch: { width: "min(100%, 340px)" },
  historySummary: { color: tokens.textMuted, fontSize: 12 },
  empty: { padding: "28px 18px" },
  inboxGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    alignItems: "start",
    gap: 14,
  },
  inboxList: { display: "grid", gap: 0 },
  inboxRow: {
    display: "grid",
    gap: 12,
    padding: "18px 20px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  inboxRowLast: { borderBottomWidth: 0 },
  inboxRowHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  inboxIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  inboxIdentityCopy: { display: "grid", gap: 2, minWidth: 0 },
  inboxTitle: {
    overflow: "hidden",
    fontSize: 14,
    fontWeight: 800,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  inboxMeta: { color: tokens.textMuted, fontSize: 11 },
  inboxSummary: {
    margin: 0,
    color: tokens.textMuted,
    fontSize: 13,
    lineHeight: 1.5,
  },
  inboxRowFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  settingsShell: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    alignItems: "start",
    gap: 18,
  },
  settingsNav: { display: "grid", gap: 4 },
  settingsNavItem: {
    display: "grid",
    gap: 4,
    padding: 14,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surface,
  },
  settingsNavItemActive: {
    borderColor: tokens.borderStrong,
    backgroundColor: tokens.surfaceRaised,
    boxShadow: "inset 3px 0 0 var(--nui-accent)",
  },
  settingsNavLabel: { fontSize: 13, fontWeight: 800 },
  settingsNavHint: { color: tokens.textMuted, fontSize: 11, lineHeight: 1.4 },
  settingsBody: { minWidth: 0 },
  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    paddingBlock: 14,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  settingCopy: { display: "grid", gap: 4, minWidth: 0, flex: "1 1 240px" },
  settingTitle: { fontSize: 13, fontWeight: 800 },
  settingDescription: {
    color: tokens.textMuted,
    fontSize: 12,
    lineHeight: 1.45,
  },
  settingsFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  settingsSaved: { color: tokens.textMuted, fontSize: 12 },
  recoveryGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 420px)",
    alignItems: "start",
    gap: 18,
  },
  recoveryCopy: { display: "grid", gap: 16, minWidth: 0 },
  recoveryStep: { display: "grid", gap: 6, paddingTop: 4 },
  recoveryStepTitle: { fontSize: 16, fontWeight: 800 },
  recoveryStepDescription: {
    color: tokens.textMuted,
    fontSize: 13,
    lineHeight: 1.5,
  },
  recoveryActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  recoveryAside: { display: "grid", gap: 14, minWidth: 0 },
})

const sx = (
  ...items: Array<stylex.StyleXStyles | null | undefined | false>
): string | undefined => stylex.props(...(items as never[])).className

const cx = (
  ...items: Array<string | null | undefined | false>
): string | undefined => items.filter(Boolean).join(" ") || undefined

export type ReviewFile = {
  path: string
  change: "Added" | "Modified" | "Removed"
  detail: string
  lines: number
  [key: string]: unknown
}

export type ReviewRun = {
  id: string
  title: string
  summary: string
  owner: string
  status: "Ready" | "Review" | "Blocked" | "Approved" | "Rejected"
  updated: string
  coverage: number
  [key: string]: unknown
}

export type ReviewMessage = {
  role: "human" | "agent"
  children: ReactNode
}

export type ReviewWorkbenchProps = {
  run: ReviewRun
  files: ReviewFile[]
  messages?: ReviewMessage[]
  onApprove?: () => void
  onReject?: () => void
  onOpenFile?: (file: ReviewFile) => void
}

const statusTone = (
  status: ReviewRun["status"],
): "neutral" | "accent" | "danger" =>
  status === "Blocked" || status === "Rejected"
    ? "danger"
    : status === "Ready" || status === "Approved"
      ? "accent"
      : "neutral"

const fileColumns = (
  onOpenFile?: (file: ReviewFile) => void,
): Array<DataTableColumn<ReviewFile>> => [
  {
    key: "path",
    header: "File",
    width: "38%",
    render: (value, row) => (
      <span className={sx(styles.tableCell)}>
        <strong className={sx(styles.tablePrimary)}>{String(value)}</strong>
        <small className={sx(styles.tableSecondary)}>{row.detail}</small>
      </span>
    ),
  },
  {
    key: "change",
    header: "Change",
    width: "18%",
    render: (value) => <Badge size="sm">{String(value)}</Badge>,
  },
  {
    key: "lines",
    header: "Lines",
    width: "14%",
    align: "right",
  },
  {
    key: "detail",
    header: "Action",
    width: "30%",
    align: "right",
    render: (_value, row) => (
      <Button
        size="sm"
        tone="ghost"
        className={sx(styles.tableAction)}
        onClick={() => onOpenFile?.(row)}
        disabled={!onOpenFile}
      >
        Open
      </Button>
    ),
  },
]

export function ReviewWorkbench({
  run,
  files,
  messages = [],
  onApprove,
  onReject,
  onOpenFile,
}: ReviewWorkbenchProps) {
  return (
    <section className={sx(styles.screen)} aria-label="Review workbench">
      <header className={sx(styles.screenHeader)}>
        <div className={sx(styles.headerCopy)}>
          <span className={sx(styles.eyebrow)}>Human gate / {run.id}</span>
          <h1 className={sx(styles.title)}>{run.title}</h1>
          <p className={sx(styles.lead)}>{run.summary}</p>
        </div>
        <Badge size="sm" tone={statusTone(run.status)}>
          {run.status}
        </Badge>
      </header>

      <div className={sx(styles.shell)}>
        <Card className={sx(styles.panel)}>
          <CardHeader xstyle={styles.panelHeader}>
            <div className={sx(styles.panelTitle)}>
              <strong className={sx(styles.panelTitleStrong)}>
                Proposed changes
              </strong>
              <span className={sx(styles.panelHint)}>
                Review the exact source boundary before anything is applied.
              </span>
            </div>
            <Badge size="sm">{files.length} files</Badge>
          </CardHeader>
          <CardBody xstyle={styles.tableBody}>
            {files.length > 0 ? (
              <DataTable
                caption="Proposed files"
                data={files}
                columns={fileColumns(onOpenFile)}
                rowKey="path"
                layout="fixed"
                minWidth="100%"
                responsive="auto"
                emptyState="No files are in this proposal."
                density="compact"
              />
            ) : (
              <Empty
                title="No files in this proposal"
                description="The agent did not produce a source change."
                xstyle={styles.empty}
              />
            )}
          </CardBody>
          <CardFooter xstyle={styles.panelFooter}>
            <span className={sx(styles.footerMeta)}>
              Updated {run.updated} · {run.coverage}% contract coverage
            </span>
            <ButtonGroup>
              <Button size="sm" tone="ghost" onClick={onReject}>
                Reject
              </Button>
              <Button size="sm" tone="primary" onClick={onApprove}>
                Approve
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>

        <aside className={sx(styles.decisionRail)} aria-label="Decision rail">
          <Card className={sx(styles.panel)}>
            <CardHeader>
              <div className={sx(styles.decisionHeader)}>
                <Avatar name={run.owner} size={34} />
                <div className={sx(styles.decisionIdentity)}>
                  <span className={sx(styles.decisionName)}>{run.owner}</span>
                  <span className={sx(styles.decisionRole)}>
                    Proposal owner
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Stack gap={14}>
                <Progress value={run.coverage} label="Contract coverage" />
                <div className={sx(styles.railRule)} />
                <span className={sx(styles.railNote)}>
                  Approval is a visible boundary. The recipe never applies a
                  change on its own.
                </span>
              </Stack>
            </CardBody>
          </Card>
        </aside>
      </div>

      <Card className={sx(styles.conversation)}>
        <CardHeader>
          <div className={sx(styles.panelTitle)}>
            <strong className={sx(styles.panelTitleStrong)}>
              Conversation
            </strong>
            <span className={sx(styles.panelHint)}>
              Keep the reasoning beside the decision, not behind a separate
              page.
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <MessageScroller
            messages={
              messages.length > 0
                ? messages
                : [
                    {
                      role: "agent",
                      children: "I prepared a reversible proposal for review.",
                    },
                    {
                      role: "human",
                      children: "Show the exact files before applying it.",
                    },
                  ]
            }
            maxHeight={210}
          />
        </CardBody>
      </Card>
    </section>
  )
}

export type RunHistoryRecord = {
  id: string
  title: string
  owner: string
  status: "Ready" | "Review" | "Blocked" | "Approved"
  updated: string
  [key: string]: unknown
}

export type RunHistoryScreenProps = {
  runs: RunHistoryRecord[]
}

export function RunHistoryScreen({ runs }: RunHistoryScreenProps) {
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()
  const filtered = runs.filter((run) =>
    [run.id, run.title, run.owner, run.status].some((value) =>
      value.toLowerCase().includes(normalized),
    ),
  )
  const columns: Array<DataTableColumn<RunHistoryRecord>> = [
    { key: "title", header: "Run", width: "42%" },
    { key: "owner", header: "Owner", width: "22%" },
    {
      key: "status",
      header: "Status",
      width: "20%",
      render: (value) => (
        <Badge size="sm" tone={statusTone(value as ReviewRun["status"])}>
          {String(value)}
        </Badge>
      ),
    },
    { key: "updated", header: "Updated", width: "16%", align: "right" },
  ]
  return (
    <section
      className={sx(styles.screen, styles.history)}
      aria-label="Run history"
    >
      <header className={sx(styles.screenHeader)}>
        <div className={sx(styles.headerCopy)}>
          <span className={sx(styles.eyebrow)}>Operations / history</span>
          <h1 className={sx(styles.title)}>Run history</h1>
          <p className={sx(styles.lead)}>
            A calm scan surface for finding what an agent did and what still
            needs a human decision.
          </p>
        </div>
        <span className={sx(styles.historySummary)}>
          {filtered.length} of {runs.length} runs
        </span>
      </header>
      <div className={sx(styles.historyToolbar)}>
        <Field
          label="Filter runs"
          htmlFor="nifra-screen-run-filter"
          xstyle={styles.historySearch}
        >
          <Input
            id="nifra-screen-run-filter"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, owner, or status"
          />
        </Field>
      </div>
      <Card className={sx(styles.panel)}>
        <CardBody xstyle={styles.tableBody}>
          {filtered.length > 0 ? (
            <DataTable
              caption="Run history"
              data={filtered}
              columns={columns}
              rowKey="id"
              layout="fixed"
              minWidth="100%"
              responsive="auto"
              emptyState="No runs match this filter."
            />
          ) : (
            <Empty
              title="No matching runs"
              description="Try a different name, owner, or status."
              xstyle={styles.empty}
            />
          )}
        </CardBody>
      </Card>
    </section>
  )
}

export type ApprovalRequest = {
  id: string
  title: string
  summary: string
  owner: string
  status: "Pending" | "Approved" | "Blocked"
  updated: string
  [key: string]: unknown
}

export type ApprovalInboxScreenProps = {
  requests: ApprovalRequest[]
  onReview?: (request: ApprovalRequest) => void
  onApprove?: (request: ApprovalRequest) => void
  onCreateRequest?: () => void
}

const approvalTone = (
  status: ApprovalRequest["status"],
): "neutral" | "accent" | "danger" =>
  status === "Blocked" ? "danger" : status === "Approved" ? "accent" : "neutral"

export function ApprovalInboxScreen({
  requests,
  onReview,
  onApprove,
  onCreateRequest,
}: ApprovalInboxScreenProps) {
  const pendingCount = requests.filter(
    (request) => request.status === "Pending",
  ).length
  return (
    <section className={sx(styles.screen)} aria-label="Approval inbox">
      <header className={sx(styles.screenHeader)}>
        <div className={sx(styles.headerCopy)}>
          <span className={sx(styles.eyebrow)}>Human gates / inbox</span>
          <h1 className={sx(styles.title)}>Approval inbox</h1>
          <p className={sx(styles.lead)}>
            Process the decisions that need a person, with enough context to act
            without opening every run.
          </p>
        </div>
        <Badge size="sm" tone={pendingCount > 0 ? "accent" : "neutral"}>
          {pendingCount} pending
        </Badge>
      </header>

      <div className={sx(styles.inboxGrid)}>
        <Card className={sx(styles.panel)}>
          <CardHeader xstyle={styles.panelHeader}>
            <div className={sx(styles.panelTitle)}>
              <strong className={sx(styles.panelTitleStrong)}>
                Decisions waiting
              </strong>
              <span className={sx(styles.panelHint)}>
                Each action remains explicit and reversible.
              </span>
            </div>
            <Badge size="sm">{requests.length} total</Badge>
          </CardHeader>
          <CardBody xstyle={styles.inboxList}>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <article
                  className={sx(
                    styles.inboxRow,
                    index === requests.length - 1 ? styles.inboxRowLast : null,
                  )}
                  key={request.id}
                >
                  <div className={sx(styles.inboxRowHeader)}>
                    <div className={sx(styles.inboxIdentity)}>
                      <Avatar name={request.owner} size={32} />
                      <div className={sx(styles.inboxIdentityCopy)}>
                        <strong className={sx(styles.inboxTitle)}>
                          {request.title}
                        </strong>
                        <span className={sx(styles.inboxMeta)}>
                          {request.owner} · {request.id}
                        </span>
                      </div>
                    </div>
                    <Badge size="sm" tone={approvalTone(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className={sx(styles.inboxSummary)}>{request.summary}</p>
                  <div className={sx(styles.inboxRowFooter)}>
                    <span className={sx(styles.inboxMeta)}>
                      Updated {request.updated}
                    </span>
                    <ButtonGroup>
                      <Button
                        size="sm"
                        tone="ghost"
                        disabled={!onReview}
                        onClick={() => onReview?.(request)}
                      >
                        Review
                      </Button>
                      {request.status === "Pending" && (
                        <Button
                          size="sm"
                          tone="primary"
                          disabled={!onApprove}
                          onClick={() => onApprove?.(request)}
                        >
                          Approve
                        </Button>
                      )}
                    </ButtonGroup>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                title="No approvals waiting"
                description="New human gates will appear here when an agent pauses."
                action={
                  <Button size="sm" onClick={onCreateRequest}>
                    Create a request
                  </Button>
                }
              />
            )}
          </CardBody>
        </Card>

        <Card className={sx(styles.panel)}>
          <CardHeader>
            <div className={sx(styles.panelTitle)}>
              <strong className={sx(styles.panelTitleStrong)}>
                Inbox health
              </strong>
              <span className={sx(styles.panelHint)}>
                A quick read before you start processing.
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <Stack gap={16}>
              <Progress
                value={
                  requests.length === 0
                    ? 100
                    : ((requests.length - pendingCount) / requests.length) * 100
                }
                label="Processed"
              />
              <div className={sx(styles.railRule)} />
              <span className={sx(styles.railNote)}>
                {pendingCount === 0
                  ? "Everything is resolved. The queue is clear."
                  : `${pendingCount} decision${pendingCount === 1 ? "" : "s"} still needs a human response.`}
              </span>
            </Stack>
          </CardBody>
        </Card>
      </div>
    </section>
  )
}

export type WorkspaceSettings = {
  name: string
  policy: "review" | "draft" | "auto"
  pauseBeforeApply: boolean
  notifyOnCompletion: boolean
}

export type WorkspaceSettingsScreenProps = {
  settings?: Partial<WorkspaceSettings>
  onSave?: (settings: WorkspaceSettings) => void
}

export function WorkspaceSettingsScreen({
  settings,
  onSave,
}: WorkspaceSettingsScreenProps) {
  const [name, setName] = useState(settings?.name ?? "Northstar")
  const [policy, setPolicy] = useState<WorkspaceSettings["policy"]>(
    settings?.policy ?? "review",
  )
  const [pauseBeforeApply, setPauseBeforeApply] = useState(
    settings?.pauseBeforeApply ?? true,
  )
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(
    settings?.notifyOnCompletion ?? true,
  )
  const [saved, setSaved] = useState(false)
  const save = () => {
    onSave?.({ name, policy, pauseBeforeApply, notifyOnCompletion })
    setSaved(true)
  }
  return (
    <section className={sx(styles.screen)} aria-label="Workspace settings">
      <header className={sx(styles.screenHeader)}>
        <div className={sx(styles.headerCopy)}>
          <span className={sx(styles.eyebrow)}>Workspace / settings</span>
          <h1 className={sx(styles.title)}>Workspace settings</h1>
          <p className={sx(styles.lead)}>
            Keep policy, identity, and notifications in one editable source
            boundary.
          </p>
        </div>
        <Badge size="sm">Local preferences</Badge>
      </header>

      <div className={sx(styles.settingsShell)}>
        <nav className={sx(styles.settingsNav)} aria-label="Settings sections">
          <div
            className={sx(styles.settingsNavItem, styles.settingsNavItemActive)}
          >
            <strong className={sx(styles.settingsNavLabel)}>General</strong>
            <span className={sx(styles.settingsNavHint)}>
              Identity and review policy
            </span>
          </div>
          <div className={sx(styles.settingsNavItem)}>
            <strong className={sx(styles.settingsNavLabel)}>
              Notifications
            </strong>
            <span className={sx(styles.settingsNavHint)}>
              When the workspace should speak
            </span>
          </div>
          <div className={sx(styles.settingsNavItem)}>
            <strong className={sx(styles.settingsNavLabel)}>Access</strong>
            <span className={sx(styles.settingsNavHint)}>
              People and decision boundaries
            </span>
          </div>
        </nav>

        <Card className={sx(styles.settingsBody)}>
          <CardHeader>
            <div className={sx(styles.panelTitle)}>
              <strong className={sx(styles.panelTitleStrong)}>
                Workspace policy
              </strong>
              <span className={sx(styles.panelHint)}>
                Changes stay local until you save them.
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <Tabs
              items={[
                { value: "general", label: "General" },
                { value: "notifications", label: "Notifications" },
              ]}
            >
              {(value) =>
                value === "general" ? (
                  <Stack gap={18}>
                    <Field
                      label="Workspace name"
                      htmlFor="nifra-screen-workspace-name"
                      description="Use a name your team will recognize."
                    >
                      <Input
                        id="nifra-screen-workspace-name"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value)
                          setSaved(false)
                        }}
                      />
                    </Field>
                    <div className={sx(styles.settingRow)}>
                      <div className={sx(styles.settingCopy)}>
                        <strong className={sx(styles.settingTitle)}>
                          Consequential action policy
                        </strong>
                        <span className={sx(styles.settingDescription)}>
                          Choose when an agent must stop for a person.
                        </span>
                      </div>
                      <RadioGroup
                        name="nifra-screen-policy"
                        value={policy}
                        onValueChange={(next) => {
                          setPolicy(next as WorkspaceSettings["policy"])
                          setSaved(false)
                        }}
                        options={[
                          { value: "review", label: "Review before apply" },
                          { value: "draft", label: "Draft only" },
                          { value: "auto", label: "Auto apply" },
                        ]}
                      />
                    </div>
                    <div className={sx(styles.settingRow)}>
                      <div className={sx(styles.settingCopy)}>
                        <strong className={sx(styles.settingTitle)}>
                          Pause before apply
                        </strong>
                        <span className={sx(styles.settingDescription)}>
                          Keep a human gate before files or external systems
                          change.
                        </span>
                      </div>
                      <Switch
                        label={pauseBeforeApply ? "On" : "Off"}
                        checked={pauseBeforeApply}
                        onCheckedChange={(next) => {
                          setPauseBeforeApply(next)
                          setSaved(false)
                        }}
                      />
                    </div>
                  </Stack>
                ) : (
                  <Stack gap={18}>
                    <div className={sx(styles.settingRow)}>
                      <div className={sx(styles.settingCopy)}>
                        <strong className={sx(styles.settingTitle)}>
                          Completion summaries
                        </strong>
                        <span className={sx(styles.settingDescription)}>
                          Show a short result when a run reaches a terminal
                          state.
                        </span>
                      </div>
                      <Checkbox
                        label={notifyOnCompletion ? "On" : "Off"}
                        checked={notifyOnCompletion}
                        onCheckedChange={(next) => {
                          setNotifyOnCompletion(next === true)
                          setSaved(false)
                        }}
                      />
                    </div>
                    <Result
                      status="pending"
                      title="Notifications are local"
                      description="Connect your own delivery mechanism at the application boundary."
                    />
                  </Stack>
                )
              }
            </Tabs>
          </CardBody>
          <CardFooter xstyle={styles.settingsFooter}>
            <span className={sx(styles.settingsSaved)}>
              {saved ? "Saved just now" : "Unsaved changes stay in this form."}
            </span>
            <Button tone="primary" onClick={save}>
              Save settings
            </Button>
          </CardFooter>
        </Card>
      </div>
      {saved && (
        <Toast
          title="Workspace settings saved"
          description="Your local policy is ready to use."
          open
          onOpenChange={setSaved}
        />
      )}
    </section>
  )
}

export type OnboardingRecoveryScreenProps = {
  mode?: "onboarding" | "recovery"
  currentStep?: number
  workspaceName?: string
  error?: ReactNode
  onContinue?: () => void
  onRetry?: () => void
}

export function OnboardingRecoveryScreen({
  mode = "onboarding",
  currentStep = 1,
  workspaceName = "Northstar",
  error,
  onContinue,
  onRetry,
}: OnboardingRecoveryScreenProps) {
  const recovering = mode === "recovery" || Boolean(error)
  const steps = [
    { label: "Workspace", description: "Name the place" },
    { label: "Policy", description: "Set the human gate" },
    { label: "Ready", description: "Run the first check" },
  ]
  return (
    <section className={sx(styles.screen)} aria-label="Onboarding and recovery">
      <header className={sx(styles.screenHeader)}>
        <div className={sx(styles.headerCopy)}>
          <span className={sx(styles.eyebrow)}>
            {recovering ? "Recovery / next step" : "Onboarding / first run"}
          </span>
          <h1 className={sx(styles.title)}>
            {recovering ? "Recover with context" : "Set up your workspace"}
          </h1>
          <p className={sx(styles.lead)}>
            {recovering
              ? "The last step did not finish. Keep the work visible, fix the boundary, and try again."
              : "A short path from an empty workspace to a reviewable first run."}
          </p>
        </div>
        <Badge size="sm" tone={recovering ? "danger" : "accent"}>
          {recovering ? "Needs attention" : "Step 2 of 3"}
        </Badge>
      </header>

      <div className={cx(sx(styles.recoveryGrid), "nui-recovery-grid")}>
        <Card className={sx(styles.recoveryCopy)}>
          <CardBody>
            <Stepper steps={steps} current={recovering ? 0 : currentStep} />
            <div className={sx(styles.recoveryStep)}>
              <span className={sx(styles.eyebrow)}>
                {recovering ? "Could not connect" : "Workspace policy"}
              </span>
              <strong className={sx(styles.recoveryStepTitle)}>
                {recovering
                  ? "The source boundary needs another attempt"
                  : `Choose how ${workspaceName} should behave`}
              </strong>
              <span className={sx(styles.recoveryStepDescription)}>
                {recovering
                  ? "No data was lost. Check the connection or credentials in your own app, then retry this step."
                  : "Start with review-before-apply. You can make the policy stricter or looser later."}
              </span>
            </div>
            {recovering ? (
              <ErrorState
                title={error ?? "The workspace could not be prepared."}
                retry={onRetry}
              />
            ) : (
              <Field
                label="Default policy"
                htmlFor="nifra-screen-onboarding-policy"
                description="This is a local example. Wire it to your own settings store."
              >
                <Input
                  id="nifra-screen-onboarding-policy"
                  value="Review before apply"
                  readOnly
                />
              </Field>
            )}
          </CardBody>
          <CardFooter xstyle={styles.recoveryActions}>
            {!recovering && (
              <Button tone="primary" onClick={onContinue}>
                Continue setup
              </Button>
            )}
            {recovering && (
              <Button tone="ghost" onClick={onContinue}>
                Return to workspace
              </Button>
            )}
          </CardFooter>
        </Card>

        <aside className={sx(styles.recoveryAside)}>
          <Card>
            <CardHeader>
              <div className={sx(styles.panelTitle)}>
                <strong className={sx(styles.panelTitleStrong)}>
                  Setup progress
                </strong>
                <span className={sx(styles.panelHint)}>
                  No hosted state is required by this recipe.
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <Stack gap={14}>
                <Progress value={recovering ? 34 : 66} label="Setup complete" />
                <Result
                  status={recovering ? "error" : "pending"}
                  title={recovering ? "Action required" : "Review gate enabled"}
                  description={
                    recovering
                      ? "Retry the failed step after the application fixes its own boundary."
                      : "The first run will pause before it changes anything."
                  }
                />
              </Stack>
            </CardBody>
          </Card>
        </aside>
      </div>
    </section>
  )
}

export const exampleReviewRun: ReviewRun = {
  id: "run-042",
  title: "Route audit",
  summary:
    "The agent found a typed-client mismatch and prepared a reversible patch.",
  owner: "Maya Chen",
  status: "Review",
  updated: "2 minutes ago",
  coverage: 92,
}

export const exampleReviewFiles: ReviewFile[] = [
  {
    path: "src/routes/audit.ts",
    change: "Modified",
    detail: "Add typed route response",
    lines: 18,
  },
  {
    path: "tests/audit.test.ts",
    change: "Added",
    detail: "Cover the rejected state",
    lines: 42,
  },
]

export const exampleRunHistory: RunHistoryRecord[] = [
  {
    id: "run-042",
    title: "Route audit",
    owner: "Maya Chen",
    status: "Review",
    updated: "2m ago",
  },
  {
    id: "run-041",
    title: "Schema check",
    owner: "Sam Lee",
    status: "Approved",
    updated: "18m ago",
  },
  {
    id: "run-040",
    title: "MCP smoke test",
    owner: "Noah Kim",
    status: "Blocked",
    updated: "1h ago",
  },
]

export const exampleApprovalRequests: ApprovalRequest[] = [
  {
    id: "gate-018",
    title: "Apply typed client fix",
    summary:
      "The proposal changes two source files and adds one regression test.",
    owner: "Maya Chen",
    status: "Pending",
    updated: "4m ago",
  },
  {
    id: "gate-017",
    title: "Regenerate route contract",
    summary:
      "The generated client is out of date with the latest route schema.",
    owner: "Sam Lee",
    status: "Approved",
    updated: "28m ago",
  },
  {
    id: "gate-016",
    title: "Update deployment manifest",
    summary:
      "The target environment is missing a required capability declaration.",
    owner: "Noah Kim",
    status: "Blocked",
    updated: "1h ago",
  },
]

export const exampleWorkspaceSettings: WorkspaceSettings = {
  name: "Northstar",
  policy: "review",
  pauseBeforeApply: true,
  notifyOnCompletion: true,
}
