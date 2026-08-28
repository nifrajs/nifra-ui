import { describe, expect, mock, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

mock.module("@stylexjs/stylex", () => ({
  create: (styles: Record<string, unknown>) => styles,
  props: (...items: unknown[]) => ({
    className: items.length ? "stylex-test" : undefined,
  }),
}))

describe("free screen recipes", () => {
  test("render the reference screens with their key regions", async () => {
    const {
      ApprovalInboxScreen,
      OnboardingRecoveryScreen,
      ReviewWorkbench,
      RunHistoryScreen,
      WorkspaceSettingsScreen,
      exampleApprovalRequests,
      exampleReviewFiles,
      exampleReviewRun,
      exampleRunHistory,
      exampleWorkspaceSettings,
    } = await import("@nifrajs/ui-screens")
    const html = renderToStaticMarkup(
      <>
        <ReviewWorkbench run={exampleReviewRun} files={exampleReviewFiles} />
        <RunHistoryScreen runs={exampleRunHistory} />
        <ApprovalInboxScreen requests={exampleApprovalRequests} />
        <WorkspaceSettingsScreen settings={exampleWorkspaceSettings} />
        <OnboardingRecoveryScreen />
      </>,
    )
    expect(html).toContain('aria-label="Review workbench"')
    expect(html).toContain("Proposed changes")
    expect(html).toContain("Run history")
    expect(html).toContain("Approval inbox")
    expect(html).toContain("Workspace settings")
    expect(html).toContain("Set up your workspace")
    expect(html).toContain('aria-label="Approval inbox"')
    expect(html).toContain('aria-label="Workspace settings"')
  })

  test("render the recoverable failure state without hosted data", async () => {
    const { OnboardingRecoveryScreen } = await import("@nifrajs/ui-screens")
    const html = renderToStaticMarkup(
      <OnboardingRecoveryScreen
        mode="recovery"
        error="Connection check failed."
        onRetry={() => undefined}
      />,
    )
    expect(html).toContain("Recover with context")
    expect(html).toContain("Connection check failed.")
    expect(html).toContain("Try again")
  })
})
