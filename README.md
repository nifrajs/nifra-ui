# Nifra UI

Source-owned UI components and native framework adapters for agentic products.

Nifra UI gives teams a practical component foundation with three properties that
are usually split across different tools:

- a complete, accessible base component set;
- editable StyleX source instead of a runtime theme dependency; and
- deterministic contracts that people, CLIs, and coding agents can inspect.

The repository is intentionally independent from the Nifra framework. It ships
the UI source, registry, installer, MCP discovery server, and documentation as
one public workspace.

## What ships here

| Package | Purpose |
| --- | --- |
| `@nifrajs/ui` | React primitives, semantic tokens, themes, and agent-native surfaces. |
| `@nifrajs/ui-registry` | Typed and generated component contracts. |
| `@nifrajs/ui-cli` | List, inspect, add, validate, and doctor commands. |
| `@nifrajs/ui-mcp` | Read-only JSON-RPC discovery for coding agents. |
| `@nifrajs/ui-adapters` | Framework-neutral target and cross-framework core contracts. |
| `@nifrajs/ui-screens` | Original MIT screen recipes with neutral manifests. |
| `@nifrajs/ui-elements` | Framework-free custom elements for native browser use. |
| `@nifrajs/ui-vue` | Vue 3 adapter for the cross-framework core. |
| `@nifrajs/ui-svelte` | Svelte adapter for the cross-framework core. |
| `@nifrajs/ui-solid` | Solid adapter for the cross-framework core. |
| `apps/docs` | Interactive component catalogue and token builder. |

The current catalogue contains 65 core components and 137 total registry
contracts. Every catalogue entry includes a live preview, install command,
complete usage examples, source location, states, and accessibility guidance.

## Quick start

Install a component as editable source:

```bash
bunx @nifrajs/ui-cli add button dialog data-table --out src/nifra-ui
```

Or use the package directly:

```bash
bun add @nifrajs/ui @stylexjs/stylex
```

```tsx
import { Button } from "@nifrajs/ui"

export function SaveButton() {
  return <Button tone="primary">Save changes</Button>
}
```

Add the StyleX Babel plugin to the consuming application's build pipeline. The
CLI installer writes readable source and a `nifra-ui.json` manifest; it refuses
to overwrite changed files unless `--force` is explicit.

## Framework support

The public alpha has five targets with one explicit contract:

- React + StyleX is the reference implementation for the full catalogue.
- Vue 3, Svelte, Solid, and Vanilla Web Components are native adapters for the
  first 11-component core slice: `Badge`, `Button`, `Card`, `Checkbox`,
  `DataTable`, `Dialog`, `Input`, `RadioGroup`, `Switch`, `Table`, and `Tabs`.
- The adapters do not mount React behind another framework. They reuse native
  custom-element semantics, properties, slots, and DOM events.
- The remaining React catalogue and the five screen recipes stay explicitly
  React-only until their target-specific render, keyboard, responsive, and
  SSR/hydration evidence is complete.

The semantic tokens, registry, CLI, MCP discovery, and screen manifests remain
framework-neutral.

## Documentation

Run the docs locally to browse previews, full source examples, install steps,
contracts, the registry directory, and the theme builder:

```bash
bun install
bun run dev
```

The docs app is designed around a simple workflow: choose a component, verify
the rendered behavior, copy the complete example, then inspect the contract.

## Agent discovery

Start the read-only MCP server over stdio:

```bash
bunx @nifrajs/ui-mcp
```

The public server exposes deterministic discovery and validation tools. It does
not persist prompts, payloads, credentials, telemetry, tenant state, or product
intelligence.

Useful CLI commands:

```bash
bunx @nifrajs/ui-cli list --category form
bunx @nifrajs/ui-cli inspect checkbox
bunx @nifrajs/ui-cli validate
bunx @nifrajs/ui-cli doctor
```

## Development

```bash
bun install
bun run dev
bun run check
```

The full check runs formatting/lint validation, registry consistency, alpha
release metadata checks, TypeScript, tests, every adapter build, and the
production docs build.
Individual commands are also available:

```bash
bun run lint
bun run registry:check
bun run typecheck
bun test
bun run build
```

## Design principles

- StyleX is the styling source of truth; Tailwind is not a runtime dependency.
- Components are source-owned and remain editable after installation.
- Semantic HTML, keyboard behavior, reduced motion, and high contrast are part
  of the component contract.
- Runtime state belongs to the consuming application.
- The registry is deterministic JSON for both humans and agents.

See [docs/architecture.md](docs/architecture.md) for the package boundary,
[docs/screens-and-adapters.md](docs/screens-and-adapters.md) for the free-screen
contract and target coverage, and the `Screens` tab in the docs for live React
recipes. See
[docs/releasing.md](docs/releasing.md) for the alpha release checklist, and
[CONTRIBUTING.md](CONTRIBUTING.md) for the contributor workflow.

## License

MIT
