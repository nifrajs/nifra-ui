import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { catalog } from "@nifrajs/ui-registry"

const docsSourcePath = resolve(import.meta.dir, "../apps/docs/main.tsx")

describe("docs preview coverage", () => {
  test("every core component has an explicit live specimen", async () => {
    const source = await readFile(docsSourcePath, "utf8")
    const specimenNames = new Set(
      [...source.matchAll(/case "([^"]+)":/g)].map((match) => match[1]),
    )

    for (const item of catalog.filter((entry) => entry.kind === "standard")) {
      expect(specimenNames.has(item.name)).toBe(true)
      expect(item.previewStatus).toBe("live")
      expect(item.status).toBe("implemented")
    }
  })

  test("the table specimens keep their readable responsive contract", async () => {
    const source = await readFile(docsSourcePath, "utf8")
    expect(source).toContain('responsive={compact ? "scroll" : "auto"}')
    expect(source).toContain('className="table-primary-cell"')
    expect(source).toContain("fictional fixture data")
  })
})
