# Screens and framework adapters

Nifra UI can ship free, reusable screens without becoming a copy of shadcn or
Chakra. The screen layer should be an original set of source-owned recipes
that demonstrates how the primitives compose around an agentic product
workflow.

The five targets for the first adapter milestone are:

1. React
2. Vue
3. Svelte
4. Solid
5. Vanilla Web Components (custom elements)

“Vanilla” means native custom elements with attributes, properties, slots, and
DOM events. It does not mean mounting a hidden React tree inside a web
component.

## Public package boundaries

```text
shared contracts
├── component manifests
├── screen manifests
├── semantic tokens and generated CSS
├── state / event vocabulary
└── accessibility and responsive requirements

native runtime packages
├── @nifrajs/ui              React + StyleX reference
├── @nifrajs/ui-elements     native Web Components / vanilla alpha
├── @nifrajs/ui-vue          Vue 3 alpha adapter
├── @nifrajs/ui-svelte       Svelte alpha adapter
├── @nifrajs/ui-solid        Solid alpha adapter
└── @nifrajs/ui-adapters     shared target and core-component contract

recipes
└── @nifrajs/ui-screens      original MIT-licensed screens and blocks
```

The current React package remains the reference runtime while the four native
alpha adapters cover the first cross-framework core slice. The registry, CLI,
MCP discovery, tokens, and screen manifests remain framework-neutral. A
consumer can inspect a component, choose a target, and copy editable source
rather than download an opaque application.

The cross-framework alpha slice is `Badge`, `Button`, `Card`, `Checkbox`,
`DataTable`, `Dialog`, `Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`.
It is intentionally smaller than the complete React catalog so each target
can share real keyboard, responsive, and event behavior.

## Screen contract

Every free screen should include:

- a `screen.manifest.json` describing intent, regions, required primitives,
  states, actions, responsive behavior, and supported targets;
- fixture data that is clearly marked as example data and can be replaced by
  application data;
- complete source for the first target, with no private Nifra services,
  credentials, telemetry, or hosted state;
- loading, empty, error, disabled, and success states where the screen needs
  them;
- keyboard and screen-reader behavior notes;
- light, dark, and high-contrast token coverage;
- a copyable install command and a minimal integration example; and
- visual and interaction tests at mobile and desktop widths.

The screen contract describes regions and behavior, not JSX. That is the seam
the other four renderers implement.

## Original free screen set

The initial set should be small and useful rather than a large gallery of
interchangeable dashboards:

| Screen | Primary job | Important primitives |
| --- | --- | --- |
| Review Workbench | inspect an agent proposal and approve or reject it | Card, DataTable, DiffViewer, MessageScroller, ApprovalCard |
| Run History | scan, filter, and inspect past runs | DataTable, Badge, Pagination, Empty, Drawer |
| Approval Inbox | process several human gates quickly | List, Status, Avatar, Dialog, Toast |
| Workspace Settings | configure review policy and notifications | Form, Field, Checkbox, RadioGroup, Switch, Tabs |
| Onboarding / Recovery | guide a first run and make failure recoverable | Stepper, Form, Progress, ErrorState, Result |

These are recipes, not product pages. They should use a neutral content model,
ship with realistic but fictional fixtures, and avoid copying any reference
library’s layout, copy, or visual treatment.

## Adapter rules

Native adapters share the contract but own their runtime behavior:

- React uses the existing StyleX source and controlled/uncontrolled props.
- Vue maps props and `emit` events to Vue idioms while preserving the same
  semantic states and DOM roles.
- Svelte uses component props and dispatched events; it must not require a
  React runtime.
- Solid uses signals and native JSX without importing React.
- Web Components expose attributes for simple values, properties for objects,
  slots for content, and `CustomEvent`s for actions.

The adapters should not promise byte-for-byte identical markup. They should
promise the same contract: meaning, keyboard behavior, state transitions,
tokens, and responsive requirements. A visual parity fixture and an
accessibility scenario are required before an adapter is marked stable.

## Delivery order

1. Keep the core React components and previews honest and stable.
2. Ship the first `@nifrajs/ui-screens` recipes in React with their manifests
   and fixture contracts.
3. Use `@nifrajs/ui-adapters` as the shared contract and token seam so native
   renderers do not inherit React-only assumptions.
4. Ship the 11-component native alpha adapters for Web Components, Vue,
   Svelte, and Solid. The larger React catalog and screen recipes remain
   explicitly React-only until they have native parity.
5. Add target-specific visual, keyboard, responsive, and SSR/hydration (where
   applicable) evidence before promoting any alpha target to stable.

This keeps the public project moat-neutral: the repository owns primitives,
contracts, source recipes, and reference implementations. Operated product
logic and private platform depth stay outside the package.
