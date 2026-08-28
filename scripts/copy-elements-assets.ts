import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const output = resolve(import.meta.dir, "../packages/ui-elements/dist")
await mkdir(resolve(output, "tokens"), { recursive: true })
const sharedTokens = await Bun.file(
  resolve(import.meta.dir, "../packages/ui/src/tokens/global.css"),
).text()
const elementStyles = await Bun.file(
  resolve(import.meta.dir, "../packages/ui-elements/src/styles.css"),
).text()
await Bun.write(
  resolve(output, "styles.css"),
  `${sharedTokens}\n${elementStyles}`,
)
console.log(`copied ${resolve(output, "styles.css")}`)
