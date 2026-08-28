import { crossFrameworkComponents } from "@nifrajs/ui-adapters"
import "@nifrajs/ui-elements"

export const adapterTarget = "svelte" as const
export const supportedComponents = crossFrameworkComponents

export { default as Badge } from "./Badge.svelte"
export { default as Button } from "./Button.svelte"
export { default as Card } from "./Card.svelte"
export { default as Checkbox } from "./Checkbox.svelte"
export { default as DataTable } from "./DataTable.svelte"
export { default as Dialog } from "./Dialog.svelte"
export { default as Input } from "./Input.svelte"
export { default as NifraElement } from "./NifraElement.svelte"
export { default as RadioGroup } from "./RadioGroup.svelte"
export { default as Switch } from "./Switch.svelte"
export { default as Table } from "./Table.svelte"
export { default as Tabs } from "./Tabs.svelte"
