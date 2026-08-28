# Releasing the public alpha

The first public release is `0.1.0-alpha.1`. It publishes ten packages from
this repository; the docs site is deployed separately through GitHub Pages.

## Before publishing

1. Make sure the repository is public and the `main` branch contains the
   reviewed release commit.
2. Configure an `NPM_TOKEN` repository secret with permission to publish the
   `@nifrajs` scope.
3. Run the release-equivalent check locally:

   ```bash
   bun install --frozen-lockfile
   bun run check
   ```

4. Review package contents without creating tarballs:

   ```bash
   npm pack --dry-run --json --workspace packages/ui
   npm pack --dry-run --json --workspace packages/ui-vue
   npm pack --dry-run --json --workspace packages/ui-svelte
   npm pack --dry-run --json --workspace packages/ui-solid
   npm pack --dry-run --json --workspace packages/ui-elements
   ```

The alpha gate checks package metadata, local licenses, public access, version
alignment, registry freshness, adapter coverage, and Svelte source compilation.
The CI workflow runs the same gate on every pull request and push to `main`.

## Publish

Open the `Publish packages` workflow from the Actions tab and set its explicit
`publish` confirmation input to `true`. The workflow runs `bun run check` again,
then publishes the packages in dependency order with public access and npm
provenance enabled.

The workflow is intentionally manual. Creating a commit, pushing a tag, or
running the workflow does not happen as part of local development.

## Package order and scope

The workflow publishes:

1. `@nifrajs/ui-adapters`
2. `@nifrajs/ui-elements`
3. `@nifrajs/ui`
4. `@nifrajs/ui-vue`
5. `@nifrajs/ui-svelte`
6. `@nifrajs/ui-solid`
7. `@nifrajs/ui-screens`
8. `@nifrajs/ui-registry`
9. `@nifrajs/ui-cli`
10. `@nifrajs/ui-mcp`

The cross-framework alpha contract is deliberately limited to 11 components:
`Badge`, `Button`, `Card`, `Checkbox`, `DataTable`, `Dialog`, `Input`,
`RadioGroup`, `Switch`, `Table`, and `Tabs`. React remains the reference
implementation for the larger catalogue. Vue, Svelte, Solid, and Vanilla are
not advertised as complete until each additional component has native render,
keyboard, responsive, and accessibility evidence.
