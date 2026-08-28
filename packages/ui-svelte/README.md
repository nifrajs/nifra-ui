# @nifrajs/ui-svelte

Svelte adapter for the cross-framework Nifra UI core. The adapter installs
`@nifrajs/ui-elements`, renders native custom elements, and forwards their
semantic DOM events; it does not require React or hide a React tree inside a
Svelte component.

## Install

```bash
bun add svelte @nifrajs/ui-svelte
```

Import the adapter stylesheet once:

```ts
import "@nifrajs/ui-svelte/styles.css"
```

## Example

```svelte
<script lang="ts">
  import { Button, DataTable, Tabs } from "@nifrajs/ui-svelte"

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
  data={rows}
  {columns}
  responsive="auto"
  selectable
  rowKey="id"
  on:selection-change={(event) => console.log(event.detail)}
/>

<Tabs
  items={[
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ]}
  panels={[
    { value: "overview", content: "Contract verified." },
    { value: "activity", content: "No new activity." },
  ]}
  on:change={(event) => console.log(event.detail)}
/>
```

The alpha covers `Badge`, `Button`, `Card`, `Checkbox`, `DataTable`, `Dialog`,
`Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`. The larger React catalog
is not falsely advertised as Svelte-complete yet.
