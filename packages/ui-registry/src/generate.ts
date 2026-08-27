import { resolve } from "node:path"
import { registry } from "./index"

const output = resolve(import.meta.dir, "../registry.json")
await Bun.write(output, `${JSON.stringify(registry, null, 2)}\n`)
console.log(`wrote ${output}`)
