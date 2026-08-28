export type AdapterTarget =
  | "react"
  | "vue"
  | "svelte"
  | "solid"
  | "web-components"

export type AdapterStatus = "reference" | "alpha" | "planned"

/**
 * The first cross-framework slice is intentionally small and useful. These
 * components have native browser semantics, so each renderer can preserve
 * their behavior without pretending that React markup is portable.
 */
export const crossFrameworkComponents = [
  "Badge",
  "Button",
  "Card",
  "Checkbox",
  "DataTable",
  "Dialog",
  "Input",
  "RadioGroup",
  "Switch",
  "Table",
  "Tabs",
] as const

export type CrossFrameworkComponent = (typeof crossFrameworkComponents)[number]

export const crossFrameworkComponentTags = {
  Badge: "nui-badge",
  Button: "nui-button",
  Card: "nui-card",
  Checkbox: "nui-checkbox",
  DataTable: "nui-data-table",
  Dialog: "nui-dialog",
  Input: "nui-input",
  RadioGroup: "nui-radio-group",
  Switch: "nui-switch",
  Table: "nui-table",
  Tabs: "nui-tabs",
} as const satisfies Record<CrossFrameworkComponent, string>

export type AdapterManifest = {
  target: AdapterTarget
  packageName: string
  status: AdapterStatus
  components: readonly CrossFrameworkComponent[]
  renderer: string
}

export const adapterManifest = [
  {
    target: "react",
    packageName: "@nifrajs/ui",
    status: "reference",
    components: crossFrameworkComponents,
    renderer: "React components with StyleX source",
  },
  {
    target: "vue",
    packageName: "@nifrajs/ui-vue",
    status: "alpha",
    components: crossFrameworkComponents,
    renderer: "Vue 3 components backed by native custom elements",
  },
  {
    target: "svelte",
    packageName: "@nifrajs/ui-svelte",
    status: "alpha",
    components: crossFrameworkComponents,
    renderer: "Svelte components backed by native custom elements",
  },
  {
    target: "solid",
    packageName: "@nifrajs/ui-solid",
    status: "alpha",
    components: crossFrameworkComponents,
    renderer: "Solid components backed by native custom elements",
  },
  {
    target: "web-components",
    packageName: "@nifrajs/ui-elements",
    status: "alpha",
    components: crossFrameworkComponents,
    renderer: "Native custom elements with DOM events",
  },
] as const satisfies readonly AdapterManifest[]

export const adapterByTarget = Object.fromEntries(
  adapterManifest.map((adapter) => [adapter.target, adapter]),
) as unknown as Record<AdapterTarget, AdapterManifest>
