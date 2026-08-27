# Architecture

Nifra UI is a public, moat-neutral interface layer. Its memorable idea is simple: an agent should be able to inspect the same contract a human uses before composing or applying a UI change.

## Package map

```text
@nifrajs/ui             React + StyleX source and semantic tokens
        │
        ├── @nifrajs/ui-registry   typed + generated component contracts
        ├── @nifrajs/ui-cli        source installer and local checks
        └── @nifrajs/ui-mcp        JSON-RPC stdio discovery for agents
                         │
                         └── apps/docs  visual proof of the system
```

The UI source is intentionally readable and source-owned. The registry points at the shared source module and records the exact named export, rather than pretending every export is a separate file. This keeps installation honest and lets a consumer edit the copied source.

## StyleX contract

StyleX is the styling source of truth. Tokens are semantic CSS custom properties, so light, dark, and high-contrast themes can change without changing component APIs. The docs Vite plugin compiles StyleX rules and emits a virtual stylesheet. The package also ships the global token stylesheet for consuming applications.

Consumers need the StyleX Babel plugin in their build pipeline. The components do not silently fall back to Tailwind classes or a runtime CSS-in-JS system.

## Agent contract

The registry and MCP server are read-only public discovery surfaces:

- `list_components` gives the available vocabulary.
- `inspect_component` gives states, accessibility notes, source location, and composition guidance.
- `suggest_components` ranks existing vocabulary for an intent.
- `validate_contract` rejects invented component names before code generation.

The CLI is the local mutation seam. It copies source into the consumer's repository, records the selected exports in `nifra-ui.json`, and validates files locally. There is no hosted registry write path.

## Public boundary

Public: primitives, tokens, typed contracts, accessibility behavior, source installation, and a small in-memory/discovery reference implementation.

Out of scope: operated durable state, identity or tenancy, credentials, pricing, private telemetry, prompt/evaluation data, connector integrations, and any private product implementation.

That boundary is a feature: anyone can adopt the substrate, while any operated depth remains outside this repository.
