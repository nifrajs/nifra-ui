# @nifrajs/ui-solid

Solid adapter for the cross-framework Nifra UI core. It installs
`@nifrajs/ui-elements`, uses native custom elements and Solid's reactive props,
and does not import React or mount a React tree behind the Solid component API.

## Install

```bash
bun add solid-js @nifrajs/ui-solid
```

Import the adapter stylesheet once:

```ts
import "@nifrajs/ui-solid/styles.css"
```

## Example

```tsx
import { Button, DataTable, Tabs } from "@nifrajs/ui-solid"

const rows = [
  { id: "run-042", name: "Route audit", status: "Ready" },
  { id: "run-041", name: "Schema check", status: "Review" },
]
const columns = [
  { key: "name", header: "Run", width: "60%", sortable: true },
  { key: "status", header: "Status", width: "40%" },
]

export function RunPreview() {
  return (
    <>
      <Button tone="primary">Approve &amp; apply</Button>
      <DataTable
        caption="Recent runs"
        data={rows}
        columns={columns}
        responsive="auto"
        selectable
        rowKey="id"
        onSelectionChange={(detail) => console.log(detail)}
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
        onChange={(detail) => console.log(detail)}
      />
    </>
  )
}
```

The alpha covers `Badge`, `Button`, `Card`, `Checkbox`, `DataTable`, `Dialog`,
`Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`. The larger React catalog
is not falsely advertised as Solid-complete yet.
