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
})
