import { describe, expect, test } from "bun:test"

describe("vanilla element adapter", () => {
  test("is safe to inspect outside a browser and exposes the native target set", async () => {
    const { defineNifraElements, elementDefinitions } = await import(
      "@nifrajs/ui-elements"
    )
    expect(elementDefinitions.map(([name]) => name)).toEqual([
      "nui-button",
      "nui-badge",
      "nui-card",
      "nui-input",
      "nui-checkbox",
      "nui-switch",
      "nui-radio-group",
      "nui-tabs",
      "nui-dialog",
      "nui-table",
      "nui-data-table",
    ])
    expect(() => defineNifraElements()).not.toThrow()
  })

  test("does not redefine an element in an existing registry", async () => {
    const { defineNifraElements, elementDefinitions } = await import(
      "@nifrajs/ui-elements"
    )
    const defined = new Set<string>()
    const registry = {
      get: (name: string) =>
        defined.has(name) ? elementDefinitions[0][1] : undefined,
      define: (name: string) => defined.add(name),
    } as unknown as CustomElementRegistry
    defineNifraElements(registry)
    defineNifraElements(registry)
    expect(defined.size).toBe(elementDefinitions.length)
  })

  test("supports structured radio and tabs properties", async () => {
    const { NifraRadioGroup, NifraTabs } = await import("@nifrajs/ui-elements")
    expect(
      typeof Object.getOwnPropertyDescriptor(
        NifraRadioGroup.prototype,
        "options",
      )?.set,
    ).toBe("function")
    expect(
      typeof Object.getOwnPropertyDescriptor(NifraTabs.prototype, "items")?.set,
    ).toBe("function")
    expect(
      typeof Object.getOwnPropertyDescriptor(NifraTabs.prototype, "panels")
        ?.set,
    ).toBe("function")
  })
})
