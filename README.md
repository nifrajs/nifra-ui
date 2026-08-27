# Nifra UI

Source-owned, StyleX-powered UI for humans and coding agents.

Nifra UI treats a component as more than pixels: every component has a typed API, semantic tokens, accessible behavior, SSR-safe output, and a machine-readable registry entry that an agent can inspect before composing it.

```bash
bunx @nifrajs/ui-cli add button dialog data-table
```

The repository is intentionally independent from the Nifra framework repository. It consumes public Nifra packages in fixtures, but ships its own components, registry, CLI, docs, and demos.

## What is here

- `@nifrajs/ui`: 120 React primitives, semantic tokens, theme support, and agent-native surfaces such as approvals, tool calls, citations, and run timelines.
- `@nifrajs/ui-registry`: deterministic JSON contracts that describe every export, its states, accessibility expectations, and agent guidance.
- `@nifrajs/ui-cli`: `list`, `inspect`, `add`, `validate`, and `doctor` commands. `add` copies editable source into the consuming app.
- `@nifrajs/ui-mcp`: a dependency-light MCP stdio server with discovery, inspection, suggestions, and composition validation tools.
- `apps/docs`: an interactive showcase that makes the human-gate and agent-observability thesis tangible.

## Development

```bash
bun install
bun run dev
bun run check
```

Open the local docs app to explore the component catalogue and the agent control-room demo.

Useful release checks:

```bash
bun run registry:check
bun run lint
bun run typecheck
bun test
bun run build
```

## Agent discovery

Run the MCP server over stdio:

```bash
bunx @nifrajs/ui-mcp
```

The server exposes only public, deterministic contracts. It does not persist prompts, payloads, credentials, telemetry, tenant state, or product intelligence.

## Source-owned installation

```bash
bunx @nifrajs/ui-cli list --category agent
bunx @nifrajs/ui-cli inspect approval-card
bunx @nifrajs/ui-cli add prompt-composer approval-card --out src/nifra-ui
bunx @nifrajs/ui-cli validate
bunx @nifrajs/ui-cli doctor
```

The installer writes a readable `nifra-ui.json` manifest and the component/token source under `src/nifra-ui`. It refuses to overwrite changed files unless `--force` is explicit. Add the StyleX Babel plugin to the consuming app's build pipeline so styles compile to CSS.

## Design contract

- StyleX is the styling source of truth; Tailwind is not a runtime dependency.
- Components are source-owned and editable after installation.
- Semantic HTML, keyboard support, reduced motion, and high contrast are release gates.
- Runtime state is local to the consuming app; the base library has no hosted data path.
- The registry is deterministic JSON, suitable for humans, CLIs, and agents.

See [docs/architecture.md](docs/architecture.md) for the public/private boundary and [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor loop.
