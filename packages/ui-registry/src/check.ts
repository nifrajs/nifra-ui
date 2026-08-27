import { resolve } from "node:path"
import { catalog, registry } from "./index"

const names = new Set<string>()
const componentSource = await Bun.file(
  resolve(import.meta.dir, "../../ui/src/components/components.tsx"),
).text()
for (const item of catalog) {
  if (names.has(item.name)) throw new Error(`duplicate component: ${item.name}`)
  names.add(item.name)
  if (
    !item.description ||
    item.sourceFiles.length === 0 ||
    !item.exportName ||
    item.accessibility.length === 0
  ) {
    throw new Error(`incomplete registry entry: ${item.name}`)
  }
  if (
    item.status === "implemented" &&
    !Bun.file(resolve(import.meta.dir, "../../ui", item.sourceFiles[0])).size
  ) {
    throw new Error(`missing source file: ${item.sourceFiles[0]}`)
  }
  if (
    item.status === "implemented" &&
    !new RegExp(`export (?:function|const|class) ${item.exportName}\\b`).test(
      componentSource,
    )
  ) {
    throw new Error(`missing source export: ${item.exportName}`)
  }
}

const generatedPath = resolve(import.meta.dir, "../registry.json")
const generated = (await Bun.file(generatedPath)
  .json()
  .catch(() => null)) as typeof registry | null
if (!generated || JSON.stringify(generated) !== JSON.stringify(registry)) {
  throw new Error(
    `generated registry is stale: run bun run registry:generate (${generatedPath})`,
  )
}

console.log(`registry ok: ${catalog.length} components`)
