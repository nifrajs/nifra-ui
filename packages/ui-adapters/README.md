# @nifrajs/ui-adapters

Framework-neutral contracts for the Nifra UI adapter family. The package
describes the first cross-framework component slice and its native element
mapping; it does not depend on React, Vue, Svelte, or Solid.

The current alpha targets are:

- `@nifrajs/ui`: React + StyleX reference source.
- `@nifrajs/ui-vue`: Vue 3 adapter.
- `@nifrajs/ui-svelte`: Svelte adapter.
- `@nifrajs/ui-solid`: Solid adapter.
- `@nifrajs/ui-elements`: native Web Components / vanilla adapter.

The alpha contract covers `Badge`, `Button`, `Card`, `Checkbox`, `DataTable`,
`Dialog`, `Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`. The larger
React catalog remains available from `@nifrajs/ui`; a component is not marked
cross-framework until its native adapter has render, keyboard, responsive,
and package smoke-test evidence.
