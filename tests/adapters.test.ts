import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import {
  adapterManifest,
  crossFrameworkComponents,
  crossFrameworkComponentTags,
} from "@nifrajs/ui-adapters"

const workspace = resolve(import.meta.dir, "..")

async function read(relativePath: string) {
  return readFile(resolve(workspace, relativePath), "utf8")
}

describe("framework adapters", () => {
  test("exposes one honest alpha contract for all five targets", () => {
    expect(adapterManifest.map((adapter) => adapter.target)).toEqual([
      "react",
      "vue",
      "svelte",
      "solid",
      "web-components",
    ])
    expect(
      adapterManifest.slice(1).every((adapter) => adapter.status === "alpha"),
    ).toBe(true)
    expect(
      adapterManifest.every(
        (adapter) =>
          adapter.components.length === crossFrameworkComponents.length,
      ),
    ).toBe(true)
  })

  test("keeps adapter runtimes free of React imports", async () => {
    const sources = await Promise.all([
      read("packages/ui-vue/src/index.ts"),
      read("packages/ui-svelte/src/NifraElement.svelte"),
      read("packages/ui-solid/src/index.tsx"),
    ])
    for (const source of sources) {
      expect(source).not.toMatch(/from ["']react["']/)
      expect(source).not.toContain('@nifrajs/ui"')
    }
  })

  test("maps the same native core tags in Vue, Svelte, and Solid", async () => {
    const vue = await read("packages/ui-vue/src/index.ts")
    const solid = await read("packages/ui-solid/src/index.tsx")
    const svelteFiles = await Promise.all(
      crossFrameworkComponents.map(async (name) => {
        const file = resolve(
          workspace,
          "packages/ui-svelte/src",
          `${name}.svelte`,
        )
        return readFile(file, "utf8")
      }),
    )

    for (const name of crossFrameworkComponents) {
      expect(vue).toContain(`crossFrameworkComponentTags.${name}`)
      expect(solid).toContain(`crossFrameworkComponentTags.${name}`)
      expect(svelteFiles[crossFrameworkComponents.indexOf(name)]).toContain(
        `tag="${crossFrameworkComponentTags[name]}"`,
      )
    }
  })

  test("documents package-local install surfaces", async () => {
    for (const packageName of ["ui-vue", "ui-svelte", "ui-solid"]) {
      const readme = await read(`packages/${packageName}/README.md`)
      expect(readme).toContain("## Install")
      expect(readme).toContain("@nifrajs/ui-elements")
      for (const component of crossFrameworkComponents)
        expect(readme).toContain(`\`${component}\``)
    }
  })
})
