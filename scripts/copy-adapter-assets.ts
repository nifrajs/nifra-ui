import { cp, mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const workspace = resolve(import.meta.dir, "..")
const packagePath = Bun.argv[2]
if (!packagePath) throw new Error("expected an adapter package path")

const packageRoot = resolve(workspace, packagePath)
const output = resolve(packageRoot, "dist")
await mkdir(output, { recursive: true })

const sharedTokens = await Bun.file(
  resolve(workspace, "packages/ui/src/tokens/global.css"),
).text()
const elementStyles = await Bun.file(
  resolve(workspace, "packages/ui-elements/src/styles.css"),
).text()
await Bun.write(
  resolve(output, "styles.css"),
  `${sharedTokens}\n${elementStyles}`,
)

if (packagePath === "packages/ui-svelte") {
  const source = resolve(packageRoot, "src")
  const files = new Bun.Glob("*.svelte")
  for await (const file of files.scan({ cwd: source })) {
    await cp(resolve(source, file), resolve(output, file))
  }
}

console.log(`copied adapter assets for ${packagePath}`)
