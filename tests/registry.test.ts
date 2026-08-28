import { describe, expect, test } from "bun:test"
import { access, readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { catalog, registry } from "@nifrajs/ui-registry"

const registryRoot = resolve(import.meta.dir, "../packages/ui-registry")
const uiRoot = resolve(import.meta.dir, "../packages/ui")

describe("registry", () => {
  test("contains unique, source-backed component contracts", async () => {
    expect(catalog.length).toBeGreaterThanOrEqual(100)
    expect(catalog.filter((item) => item.kind === "standard")).toHaveLength(65)
    expect(new Set(catalog.map((item) => item.name)).size).toBe(catalog.length)
    const source = await readFile(
      resolve(uiRoot, "src/components/components.tsx"),
      "utf8",
    )
    for (const item of catalog) {
      expect(item.exportName).toBe(item.name)
      await access(resolve(uiRoot, item.sourceFiles[0]))
      expect(source).toMatch(
        new RegExp(`export (?:function|const|class) ${item.exportName}\\b`),
      )
      expect(item.installCommand.length).toBeGreaterThan(0)
      expect(item.importCode).toContain(item.exportName)
      expect(item.usageCode).toContain(item.exportName)
      expect(item.previewStatus).toBe("live")
      expect(item.docs.install.command).toBe(item.installCommand)
      expect(item.docs.install.manual).toContain(item.exportName)
      expect(item.docs.usageNotes.length).toBeGreaterThan(0)
      expect(item.docs.examples.length).toBeGreaterThan(0)
      for (const example of item.docs.examples) {
        expect(example.title.length).toBeGreaterThan(0)
        expect(example.description.length).toBeGreaterThan(0)
        expect(example.code).toContain("import")
        expect(example.code).toContain(item.exportName)
      }
    }
  })

  test("generated JSON stays in lockstep with the typed registry", async () => {
    const generated = JSON.parse(
      await readFile(resolve(registryRoot, "registry.json"), "utf8"),
    )
    expect(generated).toEqual(registry)
  })
})
