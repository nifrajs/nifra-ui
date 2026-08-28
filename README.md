<p align="center">
  <a href="https://nifrajs.github.io/nifra-ui/"><strong>NIFRA / UI</strong></a>
</p>

<h1 align="center">Nifra UI</h1>

<p align="center">
  <strong>The StyleX-native UI system for agentic products.</strong><br>
  Source-owned components, semantic tokens, native framework adapters, and<br>
  deterministic contracts for interfaces shared by people and agents.
</p>

<p align="center">
  <a href="https://nifrajs.github.io/nifra-ui/">Documentation</a> ·
  <a href="https://github.com/nifrajs/nifra-ui/releases">Releases</a> ·
  <a href="https://github.com/nifrajs/nifra-ui/issues">Issues</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://github.com/nifrajs/nifra-ui/actions/workflows/ci.yml"><img src="https://github.com/nifrajs/nifra-ui/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/nifrajs/nifra-ui/releases/tag/v0.1.0-alpha.1"><img src="https://img.shields.io/github/v/release/nifrajs/nifra-ui?include_prereleases=true&label=alpha" alt="Latest alpha release"></a>
  <img src="https://img.shields.io/badge/StyleX-native-111827" alt="StyleX native">
  <img src="https://img.shields.io/badge/frameworks-React%20%7C%20Vue%20%7C%20Svelte%20%7C%20Solid%20%7C%20Vanilla-111827" alt="Framework support">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111827" alt="MIT license"></a>
</p>

---

Nifra UI is built for teams shipping products where a human and an agent use the
same interface. It combines a high-quality component foundation with the
styling model and source ownership needed to keep that interface fast,
inspectable, and yours.

## The central decision: StyleX is native

StyleX is not an optional theme or a cosmetic integration in Nifra UI. It is the
styling source of truth.

- **Compiled styling.** StyleX declarations are compiled into deterministic CSS
  rather than assembled from ad-hoc class strings at runtime.
- **Source ownership.** The CLI can install readable component source into your
  repository. Your team can inspect, edit, and version the implementation.
- **Semantic tokens.** Components use a stable token layer for surfaces,
  content, borders, focus, spacing, motion, and density across themes.
- **Predictable composition.** StyleX styles compose through typed component
  APIs, so customization does not depend on discovering undocumented selectors.
- **Portable contracts.** The component contract, registry, and adapter boundary
  stay usable by React applications, native browser code, and coding agents.

This is the difference between adding a UI skin to an application and owning a
UI system that can evolve with the product. Nifra UI does not require Tailwind
classes or a runtime theme engine.

## What ships in the alpha

| Surface | What it gives you |
| --- | --- |
| **StyleX-native React** | The reference implementation, semantic tokens, themes, and the full React catalogue. |
| **Native adapters** | Vue 3, Svelte, Solid, and Vanilla Web Components for the shared core slice. |
| **Source installer** | A CLI that copies editable source and records the installation manifest. |
| **Machine-readable registry** | Typed contracts, states, accessibility notes, dependencies, and source locations. |
| **Agent discovery** | Read-only MCP tools for listing, inspecting, suggesting, and validating components. |
| **Screen recipes** | Original MIT React screens built from the same primitives and token system. |
| **Interactive docs** | Live specimens, complete copyable examples, install instructions, and a token builder. |

The current catalogue contains **65 core components** and **137 registry
contracts**. Every catalogue entry is designed to answer four practical
questions: what does it render, how do I install it, how do I customize it, and
what contract should an agent use before composing it?

## One source. Every delivery surface.

~~~text
StyleX source + semantic tokens
          │
          ├── React reference catalogue
          ├── Native element semantics
          │     ├── Vue 3 adapter
          │     ├── Svelte adapter
          │     ├── Solid adapter
          │     └── Vanilla Web Components
          ├── Registry ── CLI installer
          ├── Registry ── MCP discovery
          └── Docs ────── live visual and interaction proof
~~~

The implementation boundary is intentionally explicit. React is the reference
target for the complete catalogue. The other four targets share one honest
alpha contract instead of claiming parity before their native render,
keyboard, responsive, and accessibility behavior is verified.


## Start with the visual system

### Explore the live catalogue

Open the [Nifra UI documentation](https://nifrajs.github.io/nifra-ui/) to see
the components render with real specimen data. Each component page includes its
states, full usage example, install command, source location, accessibility
guidance, and registry contract.

### Run the repository locally

~~~bash
git clone https://github.com/nifrajs/nifra-ui.git
cd nifra-ui
bun install
bun run dev
~~~

The first public alpha is tagged as <code>v0.1.0-alpha.1</code>. The package
commands below assume the alpha packages are available from npm; the repository
checkout is the source-first path while that publication completes.

### Use the StyleX-native React package

Once the alpha packages are available from npm:

~~~bash
bun add @nifrajs/ui @stylexjs/stylex
~~~

~~~tsx
import { Button } from "@nifrajs/ui"

export function SaveButton() {
  return <Button tone="primary">Save changes</Button>
}
~~~

Add the <code>@stylexjs/babel-plugin</code> to the consuming application's build
pipeline. The [architecture guide](docs/architecture.md) explains the
StyleX compilation boundary, token stylesheet, and package contracts.

### Install editable source with the CLI

The source-first workflow is the core Nifra UI experience:

~~~bash
bunx @nifrajs/ui-cli add button dialog data-table --out src/nifra-ui
~~~

The installer writes readable source and a <code>nifra-ui.json</code> manifest. It refuses
to overwrite changed files unless <code>--force</code> is explicit, so an upgrade remains
reviewable in your own repository.

## Framework support

Nifra UI separates reference coverage from native adapter coverage:

| Target | Alpha status | Coverage |
| --- | --- | --- |
| React + StyleX | Reference | Full React catalogue |
| Vue 3 | Native alpha | 11-component shared core |
| Svelte | Native alpha | 11-component shared core |
| Solid | Native alpha | 11-component shared core |
| Vanilla Web Components | Native alpha | 11-component shared core |

The shared core is:

<code>Badge</code> · <code>Button</code> · <code>Card</code> · <code>Checkbox</code> · <code>DataTable</code> · <code>Dialog</code> · <code>Input</code> ·
<code>RadioGroup</code> · <code>Switch</code> · <code>Table</code> · <code>Tabs</code>

The adapters do not mount React behind another framework. They use native
custom-element semantics, properties, slots, and DOM events. The registry,
semantic tokens, CLI, MCP discovery, and screen manifests remain
framework-neutral.

## Built for people and agents

Nifra UI makes the human path and the machine path inspect the same source of
truth.

### For product teams

- Source you can review and change instead of a closed component runtime.
- Accessible semantics, keyboard behavior, reduced motion, and high-contrast
  expectations recorded beside the component contract.
- A semantic token layer for light, dark, high-contrast, density, and brand
  decisions without rewriting component APIs.
- Free, original screen recipes that demonstrate complete product surfaces,
  not only isolated controls.

### For coding agents

- A deterministic registry that exposes the available vocabulary before code is
  generated.
- A CLI that installs source locally and validates the resulting manifest.
- An MCP server that can list, inspect, suggest, and validate components without
  inventing names or writing to a hosted state store.

~~~bash
bunx @nifrajs/ui-cli list --category form
bunx @nifrajs/ui-cli inspect checkbox
bunx @nifrajs/ui-cli validate
bunx @nifrajs/ui-cli doctor
~~~

Start the discovery server over stdio when connecting a coding agent:

~~~bash
bunx @nifrajs/ui-mcp
~~~

## Package map

| Package | Role |
| --- | --- |
| [<code>@nifrajs/ui</code>](packages/ui) | React + StyleX reference components and tokens. |
| [<code>@nifrajs/ui-adapters</code>](packages/ui-adapters) | Framework-neutral target and shared-core contracts. |
| [<code>@nifrajs/ui-elements</code>](packages/ui-elements) | Native custom elements for framework-free browser use. |
| [<code>@nifrajs/ui-vue</code>](packages/ui-vue) | Vue 3 native adapter. |
| [<code>@nifrajs/ui-svelte</code>](packages/ui-svelte) | Svelte native adapter. |
| [<code>@nifrajs/ui-solid</code>](packages/ui-solid) | Solid native adapter. |
| [<code>@nifrajs/ui-screens</code>](packages/ui-screens) | MIT React screen recipes and manifests. |
| [<code>@nifrajs/ui-registry</code>](packages/ui-registry) | Generated component contracts and JSON schema. |
| [<code>@nifrajs/ui-cli</code>](packages/ui-cli) | Source installer and local validation tools. |
| [<code>@nifrajs/ui-mcp</code>](packages/ui-mcp) | Read-only MCP discovery server. |

## Quality and release discipline

The repository treats a component as more than a screenshot. The release gate
covers:

- registry/source consistency;
- StyleX and TypeScript compilation;
- native adapter boundaries and cross-framework contracts;
- server-rendered component semantics;
- interaction and accessibility-oriented tests;
- package contents and release metadata; and
- production docs generation.

Run the full gate locally:

~~~bash
bun run check
~~~

Read the [architecture guide](docs/architecture.md), [screen and adapter
contract](docs/screens-and-adapters.md), and [alpha release checklist](docs/releasing.md)
for the implementation boundaries and verification requirements.

## Project status

Nifra UI is currently a public alpha. The React + StyleX implementation is the
reference surface. Vue, Svelte, Solid, and Vanilla support is deliberately
limited to the shared core until each additional component has target-specific
render, keyboard, responsive, SSR/hydration, and accessibility evidence.

That restraint is part of the contract: adopt the stable seam today, and expand
coverage as the evidence lands.

## Contributing

~~~bash
bun install
bun run check
~~~

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Feature
work should include the source component, registry contract, live documentation
specimen, and the relevant behavior tests.

## License

MIT. See [LICENSE](LICENSE).
