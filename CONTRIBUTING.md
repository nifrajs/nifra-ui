# Contributing

Nifra UI favors small, inspectable changes.

1. Add or update the component in `packages/ui/src/components/components.tsx`.
2. Add the export to `packages/ui/src/index.ts` only when it is part of the public surface.
3. Update the registry metadata in `packages/ui-registry/src/index.ts` and regenerate `packages/ui-registry/registry.json`.
4. Add a server-rendering or contract test under `tests/`.
5. Run the full gate:

```bash
bun run registry:generate
bun run lint
bun run typecheck
bun test
bun run build
```

Keep component APIs semantic and explicit. Prefer `tone`, `size`, `status`, and typed data props over arbitrary styling strings. Preserve keyboard access, visible focus, reduced-motion behavior, and high-contrast token coverage.
