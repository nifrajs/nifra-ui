export type ScreenTarget =
  | "react"
  | "vue"
  | "svelte"
  | "solid"
  | "web-components"

export type ScreenManifest = {
  id: string
  title: string
  intent: string
  regions: string[]
  primitives: string[]
  states: string[]
  targets: Record<ScreenTarget, "planned" | "reference">
}

export const screenManifests: ScreenManifest[] = [
  {
    id: "review-workbench",
    title: "Review Workbench",
    intent: "Inspect an agent proposal and make a visible approval decision.",
    regions: ["proposal", "file table", "decision rail", "conversation"],
    primitives: [
      "Card",
      "DataTable",
      "Badge",
      "Progress",
      "MessageScroller",
      "ButtonGroup",
    ],
    states: ["ready", "blocked", "approved", "rejected", "empty"],
    targets: {
      react: "reference",
      vue: "planned",
      svelte: "planned",
      solid: "planned",
      "web-components": "planned",
    },
  },
  {
    id: "run-history",
    title: "Run History",
    intent: "Filter and scan prior agent runs with an explicit empty state.",
    regions: ["filter", "run table", "result summary"],
    primitives: ["Field", "Input", "DataTable", "Badge", "Empty"],
    states: ["populated", "filtered", "empty"],
    targets: {
      react: "reference",
      vue: "planned",
      svelte: "planned",
      solid: "planned",
      "web-components": "planned",
    },
  },
  {
    id: "approval-inbox",
    title: "Approval Inbox",
    intent:
      "Process several human gates quickly without hiding the proposal context.",
    regions: ["queue header", "approval list", "inbox health"],
    primitives: [
      "Card",
      "Avatar",
      "Badge",
      "ButtonGroup",
      "Progress",
      "EmptyState",
    ],
    states: ["pending", "approved", "blocked", "empty"],
    targets: {
      react: "reference",
      vue: "planned",
      svelte: "planned",
      solid: "planned",
      "web-components": "planned",
    },
  },
  {
    id: "workspace-settings",
    title: "Workspace Settings",
    intent:
      "Configure review policy and local notification preferences in one place.",
    regions: ["settings navigation", "policy form", "save feedback"],
    primitives: [
      "Card",
      "Tabs",
      "Field",
      "Input",
      "RadioGroup",
      "Switch",
      "Checkbox",
      "Result",
      "Toast",
    ],
    states: ["default", "editing", "unsaved", "saved"],
    targets: {
      react: "reference",
      vue: "planned",
      svelte: "planned",
      solid: "planned",
      "web-components": "planned",
    },
  },
  {
    id: "onboarding-recovery",
    title: "Onboarding / Recovery",
    intent:
      "Guide a first run and make a failed setup step recoverable without losing context.",
    regions: [
      "step header",
      "current step",
      "recovery message",
      "progress rail",
    ],
    primitives: [
      "Card",
      "Stepper",
      "Field",
      "Input",
      "ErrorState",
      "Result",
      "Progress",
    ],
    states: ["onboarding", "recovery", "retrying", "complete"],
    targets: {
      react: "reference",
      vue: "planned",
      svelte: "planned",
      solid: "planned",
      "web-components": "planned",
    },
  },
]

export const screenManifestById = Object.fromEntries(
  screenManifests.map((screen) => [screen.id, screen]),
) as Record<string, ScreenManifest>
