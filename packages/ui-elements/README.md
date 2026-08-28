# @nifrajs/ui-elements

Framework-free Nifra UI custom elements. This is the vanilla reference
renderer for the shared Nifra UI contract: native elements, attributes for
simple values, properties for structured data, slots/light DOM for content, and
DOM events for state changes.

## Install

```bash
bun add @nifrajs/ui-elements
```

Load the stylesheet once, then import the element registration module:

```ts
import "@nifrajs/ui-elements/styles.css"
import "@nifrajs/ui-elements"
```

The package has no React dependency and registers these elements:

- `nui-button`, `nui-badge`, `nui-card`, `nui-input`
- `nui-checkbox`, `nui-switch`, `nui-radio-group`
- `nui-tabs`, `nui-dialog`
- `nui-table`, `nui-data-table`

## Example

```html
<nui-button tone="primary" size="lg">Approve &amp; apply</nui-button>

<nui-data-table
  caption="Recent runs"
  responsive="auto"
  selectable
  columns='[{"key":"name","header":"Run","width":"50%","sortable":true},{"key":"status","header":"Status","width":"25%"},{"key":"owner","header":"Owner","width":"25%"}]'
  data='[{"id":"run-042","name":"Route audit","status":"Ready","owner":"Maya Chen"},{"id":"run-041","name":"Schema check","status":"Review","owner":"Sam Lee"}]'
></nui-data-table>
```

Tabs accept structured properties for framework-free use too:

```ts
const tabs = document.querySelector("nui-tabs")!
tabs.items = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
]
tabs.panels = [
  { value: "overview", content: "Contract verified." },
  { value: "activity", content: "No new activity." },
]
tabs.addEventListener("nui-change", (event) => {
  console.log((event as CustomEvent<{ value: string }>).detail.value)
})
```

Structured values can be assigned as properties instead of JSON attributes:

```ts
const table = document.querySelector("nui-data-table")!
table.data = runs
table.columns = columns.map((column) => ({
  ...column,
  render: column.key === "status"
    ? (value) => {
        const badge = document.createElement("nui-badge")
        badge.setAttribute("tone", value === "Ready" ? "accent" : "neutral")
        badge.textContent = String(value)
        return badge
      }
    : undefined,
}))
table.selectedKeys = ["run-042"]
table.addEventListener("nui-selection-change", (event) => {
  console.log((event as CustomEvent<{ selectedKeys: string[] }>).detail)
})
```

`nui-change` is emitted by checkbox, switch, radio-group, and tabs. DataTable
emits `nui-selection-change` and `nui-sort-change`. The underlying controls
remain native and keyboard-operable; the events are additive convenience APIs.

This alpha adapter covers the same 11-component core slice as the Vue, Svelte,
and Solid packages. It is the native reference for framework-free use; the
other React-only components are not falsely advertised as available here.
