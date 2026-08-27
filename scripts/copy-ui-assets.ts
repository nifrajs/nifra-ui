import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const source = resolve(import.meta.dir, "../packages/ui/src/tokens/global.css")
const target = resolve(import.meta.dir, "../packages/ui/dist/tokens/global.css")
await mkdir(resolve(target, ".."), { recursive: true })
await Bun.write(target, await Bun.file(source).text())
console.log(`copied ${target}`)
