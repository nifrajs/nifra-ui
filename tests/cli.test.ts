import { describe, expect, test } from "bun:test"
import { access, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCli } from "../packages/ui-cli/src/index"

describe("ui CLI", () => {
  test("installs a source-owned bundle and validates it", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "nifra-ui-cli-"))
    await writeFile(
      join(fixture, "package.json"),
      `${JSON.stringify({ name: "fixture", devDependencies: { react: "19.0.0" } }, null, 2)}\n`,
    )
    const added = await runCli(["add", "button", "approval-card"], fixture)
    expect(added.code).toBe(0)
    await access(join(fixture, "src/nifra-ui/components/components.tsx"))
    await access(join(fixture, "src/nifra-ui/tokens/tokens.stylex.ts"))
    const manifest = JSON.parse(
      await readFile(join(fixture, "nifra-ui.json"), "utf8"),
    )
    expect(manifest.components).toEqual(["ApprovalCard", "Button"])
    const validated = await runCli(["validate", "--json"], fixture)
    expect(validated.code).toBe(0)
    expect(JSON.parse(validated.stdout).valid).toBe(true)
    const doctor = await runCli(["doctor", "--json"], fixture)
    expect(doctor.code).toBe(0)
  })

  test("supports dry runs and refuses unknown components", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "nifra-ui-cli-dry-"))
    const dry = await runCli(["add", "button", "--dry-run"], fixture)
    expect(dry.code).toBe(0)
    const invalid = await runCli(["add", "not-a-component"], fixture)
    expect(invalid.code).toBe(2)
  })
})
