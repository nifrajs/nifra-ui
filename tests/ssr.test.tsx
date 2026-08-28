import { describe, expect, mock, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

// Bun runs this contract test without the StyleX Babel transform. The mock keeps
// the test focused on semantic SSR output; the production build is verified with
// the real StyleX transform in Vite.
mock.module("@stylexjs/stylex", () => ({
  create: (styles: Record<string, unknown>) => styles,
  props: (...items: unknown[]) => ({
    className: items.length ? "stylex-test" : undefined,
  }),
}))

describe("component primitives", () => {
  test("render stable accessible HTML on the server", async () => {
    const {
      ApprovalCard,
      Button,
      Conversation,
      Message,
      ThemeProvider,
      ToolCall,
    } = await import("@nifrajs/ui")
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <Button aria-label="Save draft" tone="primary">
          Save draft
        </Button>
        <ApprovalCard
          title="Approve deployment"
          description="The change is reversible."
        />
        <Conversation>
          <Message role="agent">Ready for review.</Message>
        </Conversation>
        <ToolCall name="validate_contract" status="succeeded" />
      </ThemeProvider>,
    )
    expect(html).toContain("Save draft")
    expect(html).toContain('aria-label="Save draft"')
    expect(html).toContain("HUMAN GATE")
    expect(html).toContain("Approve deployment")
    expect(html).toContain("validate_contract")
  })

  test("keep core control semantics visible in server markup", async () => {
    const { AlertDialog, Checkbox, DatePicker, Switch, Tabs } = await import(
      "@nifrajs/ui"
    )
    const html = renderToStaticMarkup(
      <>
        <Checkbox checked="indeterminate" label="Select related files" />
        <Switch defaultChecked label="Pause before apply" />
        <DatePicker defaultValue="2026-08-27" defaultOpen name="reviewDate" />
        <AlertDialog
          defaultOpen
          title="Remove draft?"
          description="This action cannot be undone."
        >
          Confirm the removal.
        </AlertDialog>
        <Tabs items={[{ value: "preview", label: "Preview" }]}>
          <p>Preview content</p>
        </Tabs>
      </>,
    )
    expect(html).toContain('aria-checked="mixed"')
    expect(html).toContain('class="stylex-test"><input')
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-checked="true"')
    expect(html).toContain('role="alertdialog"')
    expect(html).toContain("aria-describedby=")
    expect(html).toContain('name="reviewDate"')
    expect(html).toContain('role="tablist"')
    expect(html).toContain('role="tabpanel"')
  })

  test("render table identity, custom cells, and empty state semantics", async () => {
    const { Badge, DataTable, Table } = await import("@nifrajs/ui")
    const html = renderToStaticMarkup(
      <>
        <Table caption="Project members" aria-label="Project members">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sarah Chen</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </Table>
        <DataTable
          caption="Recent runs"
          data={[{ id: "run-1", name: "Route audit", status: "Ready" }]}
          rowKey="id"
          columns={[
            { key: "name", header: "Run" },
            {
              key: "status",
              header: "Status",
              render: (value) => (
                <Badge size="sm" tone="accent">
                  {String(value)}
                </Badge>
              ),
            },
          ]}
        />
        <DataTable<{ id: string; name: string }>
          caption="Empty runs"
          data={[]}
          columns={[{ key: "name", header: "Run" }]}
          emptyState="No runs have been recorded."
        />
        <DataTable
          caption="Selectable runs"
          data={[{ id: "run-2", name: "Schema check" }]}
          rowKey="id"
          selection={{ defaultSelectedKeys: ["run-2"] }}
          sort={{
            key: "name",
            direction: "asc",
            onChange: () => undefined,
          }}
          columns={[{ key: "name", header: "Run", sortable: true }]}
        />
        <DataTable
          caption="Loading runs"
          data={[]}
          loading
          loadingState="Loading run history."
          columns={[{ key: "name", header: "Run" }]}
        />
      </>,
    )
    expect(html).toContain('aria-label="Project members"')
    expect(html).toContain('scope="col"')
    expect(html).toContain('data-row-key="run-1"')
    expect(html).toContain('style="table-layout:fixed"')
    expect(html).toContain("nui-badge")
    expect(html).toContain("Ready")
    expect(html).toContain("No runs have been recorded.")
    expect(html).toContain('aria-label="Select all rows"')
    expect(html).toContain('aria-label="Select row run-2"')
    expect(html).toContain('data-state="selected"')
    expect(html).toContain('aria-sort="ascending"')
    expect(html).toContain('aria-label="Sort by Run, currently ascending"')
    expect(html).toContain('data-label="Run"')
    expect(html).toContain('data-label="Status"')
    expect(html).toContain('data-responsive="scroll"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain("Loading run history.")
  })
})
