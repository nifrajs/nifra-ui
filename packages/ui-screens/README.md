# @nifrajs/ui-screens

Original MIT-licensed screen recipes built from `@nifrajs/ui`. The reference
renderer is React; the screen manifests record neutral regions, states,
primitives, and target coverage. The component adapters are cross-framework
alpha, while these full screen recipes remain React-only until their native
renderers receive parity evidence.

## Install

```bash
bun add @nifrajs/ui @nifrajs/ui-screens @stylexjs/stylex
```

Use the same StyleX build setup as `@nifrajs/ui` and import the token stylesheet
once in the application:

```tsx
import "@nifrajs/ui/styles.css"
import {
  ApprovalInboxScreen,
  ReviewWorkbench,
  exampleReviewFiles,
  exampleReviewRun,
} from "@nifrajs/ui-screens"

export function ReviewRoute() {
  return (
    <ReviewWorkbench
      run={exampleReviewRun}
      files={exampleReviewFiles}
      onApprove={() => console.log("replace with your approval action")}
      onReject={() => console.log("replace with your rejection action")}
    />
  )
}
```

The exported fixtures are fictional examples. Replace them with application
data and keep the callbacks at the application boundary.

## Included recipes

- `ReviewWorkbench`: file-by-file proposal review with a decision rail and
  conversation context.
- `RunHistoryScreen`: filterable run history with populated and empty states.
- `ApprovalInboxScreen`: a human-gate queue with pending, approved, blocked,
  and empty states.
- `WorkspaceSettingsScreen`: a local policy and notification settings form
  with save feedback.
- `OnboardingRecoveryScreen`: a first-run flow with an explicit recoverable
  failure state.

The recipes are source-owned and intentionally editable. They do not call a
hosted Nifra service or assume identity, tenancy, credentials, telemetry, or
private platform state.

Every recipe is a React reference renderer today. The manifests deliberately
mark Vue, Svelte, Solid, and Web Components as planned until each screen has a
native renderer with install, render, keyboard, responsive, and (where
applicable) SSR/hydration evidence.
