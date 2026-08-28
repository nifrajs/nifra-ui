# @nifrajs/ui-vue

Vue 3 adapter for the cross-framework Nifra UI core. It uses native custom
elements underneath, so it does not mount a hidden React tree or require
React. Vue owns the component API and event surface; the shared native
renderer owns semantic HTML, keyboard behavior, and responsive table rules.

## Install

```bash
bun add vue @nifrajs/ui-vue
```

The adapter installs `@nifrajs/ui-elements` as its native renderer. Import the
adapter stylesheet once:

```ts
import "@nifrajs/ui-vue/styles.css"
```

## Example

```vue
<script setup lang="ts">
import { Button, DataTable, Tabs } from "@nifrajs/ui-vue"

const rows = [
  { id: "run-042", name: "Route audit", status: "Ready" },
  { id: "run-041", name: "Schema check", status: "Review" },
]
const columns = [
  { key: "name", header: "Run", width: "60%", sortable: true },
  { key: "status", header: "Status", width: "40%" },
]
</script>

<Button tone="primary">Approve &amp; apply</Button>
<DataTable
  caption="Recent runs"
  :data="rows"
  :columns="columns"
  responsive="auto"
  selectable
  row-key="id"
  @selection-change="({ selectedKeys }) => console.log(selectedKeys)"
/>

<Tabs
  :items="[
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity' },
  ]"
  :panels="[
    { value: 'overview', content: 'Contract verified.' },
    { value: 'activity', content: 'No new activity.' },
  ]"
  @change="({ value }) => console.log(value)"
/>
```

The alpha covers `Badge`, `Button`, `Card`, `Checkbox`, `DataTable`, `Dialog`,
`Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`. Structured table values
are assigned as DOM properties; simple values map to attributes. The larger
React catalog is not falsely advertised as Vue-complete yet.
