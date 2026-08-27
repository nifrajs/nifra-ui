import * as UI from "@nifrajs/ui"
import { catalog, categoryLabels } from "@nifrajs/ui-registry"
import { type ReactNode, useState } from "react"
import "./docs.css"

type MessageItem = { role: "human" | "agent"; text: string }

const rows = [
  { surface: "Command palette", owner: "Agent runtime", state: "Ready" },
  { surface: "Approval flow", owner: "Human gate", state: "Review" },
  { surface: "Token contract", owner: "Design system", state: "Stable" },
]

const columns = [
  { key: "surface" as const, header: "Surface" },
  { key: "owner" as const, header: "Owner" },
  {
    key: "state" as const,
    header: "State",
    render: (value: unknown) => (
      <UI.Badge tone={value === "Review" ? "danger" : "accent"}>
        {String(value)}
      </UI.Badge>
    ),
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

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{number} / catalogue</div>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  )
}

function DemoCard({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="demo-card">
      <div className="demo-label">
        <span>{name}</span>
        <span>StyleX</span>
      </div>
      <UI.Card>
        <UI.CardBody>
          <div data-demo>{children}</div>
        </UI.CardBody>
      </UI.Card>
    </div>
  )
}

function App() {
  type ThemeName = UI.ThemeName
  const [theme, setTheme] = useState<ThemeName>("light")
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      role: "human",
      text: "Keep the review flow reversible and make the next action obvious.",
    },
    {
      role: "agent",
      text: "I found the approval surface. I’ll prepare a draft and stop before applying it.",
    },
  ])
  const [toastOpen, setToastOpen] = useState(true)
  const [approved, setApproved] = useState(false)
  const [model, setModel] = useState("Nifra Scout")

  const cycleTheme = () =>
    setTheme(
      theme === "light" ? "dark" : theme === "dark" ? "high-contrast" : "light",
    )
  const submitPrompt = (text: string) =>
    setMessages((items) => [
      ...items,
      { role: "human", text },
      {
        role: "agent",
        text: "Drafted. The proposal is visible below and is waiting for your approval.",
      },
    ])

  return (
    <UI.ThemeProvider theme={theme}>
      <div className="docs-shell">
        <header className="docs-nav">
          <a className="wordmark" href="#top">
            <Mark />
            <span>Nifra UI</span>
          </a>
          <div className="nav-actions">
            <UI.Badge tone="accent">StyleX · agent-ready</UI.Badge>
            <UI.Button size="sm" tone="ghost" onClick={cycleTheme}>
              Theme: {theme}
            </UI.Button>
            <UI.Link href="https://github.com/nifrajs">GitHub ↗</UI.Link>
          </div>
        </header>

        <section className="hero" id="top">
          <div>
            <div className="eyebrow">
              A public design system for the agentic era
            </div>
            <h1>
              Build the interface.
              <br />
              <em>Keep the intent.</em>
            </h1>
            <p className="hero-copy">
              Nifra UI is source-owned, StyleX-powered interface infrastructure
              for people and the agents working beside them. Every component
              ships with a typed API, semantic tokens, accessible behavior, and
              a contract an agent can inspect.
            </p>
            <UI.Inline style={{ marginTop: 28 }}>
              <UI.LinkButton href="#agent">See the agent layer ↗</UI.LinkButton>
              <UI.Button
                tone="ghost"
                onClick={() =>
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse components
              </UI.Button>
            </UI.Inline>
          </div>
          <div className="hero-note">
            <strong>Design contract / 01</strong>
            <p>
              Components are not black boxes. They are readable source,
              deterministic styles, explicit states, and a safe next action.
            </p>
            <UI.Inline style={{ marginTop: 18 }}>
              <UI.Kbd>⌘</UI.Kbd>
              <UI.Kbd>K</UI.Kbd>
              <span className="hero-note-label">open the registry</span>
            </UI.Inline>
          </div>
        </section>

        <main className="docs-main">
          <nav className="side-index" aria-label="Page sections">
            <a href="#core">01 Core language</a>
            <a href="#forms">02 Trust surfaces</a>
            <a href="#agent">03 Agent layer</a>
            <a href="#catalog">04 Full catalogue</a>
          </nav>
          <div className="showcase">
            <section id="core">
              <SectionHeading
                number="01"
                title="A quiet, sharp core"
                description="A compact visual language: warm paper, graphite type, signal green, and enough edge to make state visible."
              />
              <div className="demo-grid">
                <DemoCard name="Actions">
                  <UI.Stack gap={14}>
                    <UI.Inline>
                      <UI.Button tone="primary">Commit change</UI.Button>
                      <UI.Button>Inspect</UI.Button>
                      <UI.IconButton label="More actions" tone="ghost">
                        ···
                      </UI.IconButton>
                    </UI.Inline>
                    <UI.Inline>
                      <UI.Badge tone="accent">stable</UI.Badge>
                      <UI.Badge>source-owned</UI.Badge>
                      <UI.Badge tone="danger">needs review</UI.Badge>
                    </UI.Inline>
                  </UI.Stack>
                </DemoCard>
                <DemoCard name="Tokens">
                  <UI.Stack gap={12}>
                    <UI.Stat
                      label="StyleX rules"
                      value="042"
                      detail="emitted only when used"
                    />
                    <UI.Progress value={72} label="Contract coverage" />
                  </UI.Stack>
                </DemoCard>
                <DemoCard name="Navigation">
                  <UI.Tabs
                    items={[
                      { value: "overview", label: "Overview" },
                      { value: "states", label: "States" },
                      { value: "agent", label: "Agent notes" },
                    ]}
                  >
                    <UI.Stack gap={10}>
                      <UI.Description>
                        Each tab is a typed decision surface with visible focus
                        and deterministic styles.
                      </UI.Description>
                      <UI.CodeBlock
                        code={'<Button tone="primary">Commit change</Button>'}
                      />
                    </UI.Stack>
                  </UI.Tabs>
                </DemoCard>
                <DemoCard name="Command">
                  <UI.Command
                    items={[
                      {
                        value: "inspect",
                        label: "Inspect component",
                        hint: "I",
                      },
                      { value: "add", label: "Add to project", hint: "A" },
                      {
                        value: "validate",
                        label: "Validate contract",
                        hint: "V",
                      },
                    ]}
                  />
                </DemoCard>
              </div>
            </section>

            <section id="forms">
              <SectionHeading
                number="02"
                title="Trust surfaces"
                description="Inputs, approvals, and feedback are designed around the moment where the system needs a human decision."
              />
              <div className="demo-grid">
                <DemoCard name="Field system">
                  <UI.Form onSubmit={(event) => event.preventDefault()}>
                    <UI.Field
                      label="Workspace name"
                      description="This is visible to the people reviewing your next change."
                      htmlFor="workspace"
                    >
                      <UI.Input
                        id="workspace"
                        defaultValue="Northstar workspace"
                      />
                    </UI.Field>
                    <UI.Checkbox
                      label="Require a human approval before apply"
                      defaultChecked
                    />
                    <UI.Button type="submit" tone="primary">
                      Save policy
                    </UI.Button>
                  </UI.Form>
                </DemoCard>
                <DemoCard name="Overlay">
                  <UI.Dialog
                    title="Review the proposal"
                    description="The agent has prepared a reversible change."
                    trigger={<UI.Button tone="primary">Open review</UI.Button>}
                    footer={
                      <>
                        <UI.Button tone="ghost">Ask for revision</UI.Button>
                        <UI.Button tone="primary">Approve draft</UI.Button>
                      </>
                    }
                  >
                    <UI.Stack gap={12}>
                      <UI.Alert title="One decision is waiting">
                        This change affects the navigation contract and will
                        update three screens.
                      </UI.Alert>
                      <UI.DescriptionList
                        items={[
                          { label: "Files", value: "3" },
                          {
                            label: "Risk",
                            value: (
                              <UI.Badge tone="accent">
                                Low · reversible
                              </UI.Badge>
                            ),
                          },
                          { label: "Owner", value: "You" },
                        ]}
                      />
                    </UI.Stack>
                  </UI.Dialog>
                </DemoCard>
                <DemoCard name="Data display">
                  <UI.DataTable data={rows} columns={columns} />
                </DemoCard>
                <DemoCard name="States">
                  <UI.Stack gap={12}>
                    <UI.Alert title="A small, legible warning" tone="danger">
                      Unknown dynamic values stay visible for manual review.
                    </UI.Alert>
                    <UI.EmptyState
                      title="No unresolved calls"
                      description="The agent has no pending work in this scope."
                      action={<UI.Button size="sm">Inspect registry</UI.Button>}
                    />
                  </UI.Stack>
                </DemoCard>
              </div>
            </section>

            <section id="agent">
              <SectionHeading
                number="03"
                title="The agent layer"
                description="The differentiator: the same design system makes agent work visible, bounded, and easy to approve."
              />
              <div className="agent-demo">
                <div className="agent-demo-card">
                  <UI.Card>
                    <UI.CardHeader>
                      <UI.Inline
                        style={{ justifyContent: "space-between" }}
                        wrap={false}
                      >
                        <div>
                          <div className="eyebrow">Live conversation</div>
                          <h3 style={{ margin: "8px 0 0" }}>
                            A change with a clear next step
                          </h3>
                        </div>
                        <UI.ModelPicker
                          models={[
                            "Nifra Scout",
                            "Codex review",
                            "Local verifier",
                          ]}
                          value={model}
                          onValueChange={setModel}
                        />
                      </UI.Inline>
                    </UI.CardHeader>
                    <UI.CardBody>
                      <UI.Conversation>
                        {messages.map((message, index) => (
                          <UI.Message key={index} role={message.role}>
                            {message.text}
                          </UI.Message>
                        ))}
                      </UI.Conversation>
                      <UI.PromptComposer onSubmit={submitPrompt} />
                    </UI.CardBody>
                  </UI.Card>
                </div>
                <div className="agent-demo-card">
                  <UI.Stack gap={16}>
                    <UI.ApprovalCard
                      title={
                        approved
                          ? "Applied with approval"
                          : "A human decision is required"
                      }
                      description={
                        approved
                          ? "The agent recorded the decision and the run is complete."
                          : "The agent can prepare the change, but it cannot apply it silently."
                      }
                      approveLabel={approved ? "Approved" : "Approve & apply"}
                      onApprove={() => setApproved(true)}
                      onReject={() => setApproved(false)}
                    />
                    <UI.ToolCall
                      name="nifra.validate_contract"
                      status="succeeded"
                      input="{ scope: 'navigation' }"
                      output={
                        <UI.Description>
                          3 routes checked · 0 drift · 1 approval gate
                        </UI.Description>
                      }
                    />
                    <UI.RunTimeline
                      runs={[
                        { title: "Read design contract", status: "succeeded" },
                        {
                          title: "Prepare reversible patch",
                          status: "succeeded",
                        },
                        {
                          title: "Human approval",
                          status: approved ? "succeeded" : "running",
                        },
                      ]}
                    />
                    {toastOpen && (
                      <UI.Toaster>
                        <UI.Toast
                          title="Registry synced"
                          description="The agent has the latest component contracts."
                          onOpenChange={setToastOpen}
                        />
                      </UI.Toaster>
                    )}
                  </UI.Stack>
                </div>
              </div>
            </section>

            <section id="catalog">
              <SectionHeading
                number="04"
                title="The full catalogue"
                description={`${catalog.length} components, one contract. Every entry is discoverable by humans, the CLI, and agents.`}
              />
              <div className="catalog">
                {catalog.map((item) => (
                  <div className="catalog-item" key={item.name}>
                    <strong>{item.name}</strong>
                    <span>
                      {categoryLabels[item.category]} · {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
        <footer className="footer">
          <span>
            <Mark /> Nifra UI / 2026
          </span>
          <span>Source-owned · StyleX-powered · agent-readable</span>
          <span>MIT</span>
        </footer>
      </div>
    </UI.ThemeProvider>
  )
}

import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(<App />)
