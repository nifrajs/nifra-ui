import { access, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"
import {
  type ComponentMeta,
  catalog,
  catalogByName,
  categoryLabels,
} from "@nifrajs/ui-registry"

type CliOptions = {
  cwd: string
  json: boolean
  force: boolean
  dryRun: boolean
  out?: string
  category?: string
}

export type CliResult = { code: number; stdout: string; stderr: string }

type InstallManifest = {
  schemaVersion: "1.0"
  packageName: "@nifrajs/ui"
  components: string[]
  outDir: string
  files: string[]
}

const sourceFiles = [
  "components/components.tsx",
  "tokens/tokens.stylex.ts",
  "tokens/global.css",
  "index.ts",
] as const

function kebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
}

function resolveComponent(value: string): ComponentMeta | undefined {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "")
  return catalog.find(
    (item) =>
      item.name.toLowerCase() === normalized ||
      kebab(item.name).replaceAll("-", "") === normalized,
  )
}

function parseArgs(
  args: string[],
  cwd: string,
): {
  command: string
  positionals: string[]
  options: CliOptions
  error?: string
} {
  const positionals: string[] = []
  const options: CliOptions = { cwd, json: false, force: false, dryRun: false }
  let command = "help"
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (index === 0 && !arg.startsWith("-")) {
      command = arg
      continue
    }
    if (arg === "--json") options.json = true
    else if (arg === "--force") options.force = true
    else if (arg === "--dry-run") options.dryRun = true
    else if (arg === "--cwd") options.cwd = resolve(cwd, args[++index] ?? "")
    else if (arg === "--out") options.out = args[++index]
    else if (arg === "--category") options.category = args[++index]
    else if (arg === "--help" || arg === "-h") command = "help"
    else if (arg.startsWith("-"))
      return { command, positionals, options, error: `unknown option: ${arg}` }
    else positionals.push(arg)
  }
  return { command, positionals, options }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function findPackageRoot(start: string): Promise<string | undefined> {
  let current = resolve(start)
  while (true) {
    if (await exists(resolve(current, "package.json"))) return current
    const parent = dirname(current)
    if (parent === current) return undefined
    current = parent
  }
}

async function readJson<T>(path: string): Promise<T | undefined> {
  if (!(await exists(path))) return undefined
  try {
    return JSON.parse(await readFile(path, "utf8")) as T
  } catch {
    return undefined
  }
}

async function sourceRoot(): Promise<string | undefined> {
  const candidates = [
    process.env.NIFRA_UI_SOURCE_ROOT,
    resolve(import.meta.dir, "../../ui/src"),
    resolve(import.meta.dir, "../../node_modules/@nifrajs/ui/src"),
  ].filter((value): value is string => Boolean(value))
  for (const candidate of candidates) {
    if (await exists(resolve(candidate, "components/components.tsx")))
      return candidate
  }
  return undefined
}

function jsonLine(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function renderHelp(): string {
  return `Nifra UI CLI — source-owned StyleX components for people and agents.

Commands:
  list [--json] [--category <category>]     List the component registry
  inspect <component> [--json]             Inspect a component contract
  add <component...> [--out <dir>]         Copy source into the current project
  validate [--json]                        Validate an installed source bundle
  doctor [--json]                          Check project and StyleX prerequisites

Examples:
  bunx @nifrajs/ui-cli list --category agent
  bunx @nifrajs/ui-cli inspect approval-card
  bunx @nifrajs/ui-cli add button prompt-composer approval-card
`
}

async function listCommand(
  positionals: string[],
  options: CliOptions,
): Promise<CliResult> {
  const category = options.category ?? positionals[0]
  const items = category
    ? catalog.filter((item) => item.category === category)
    : catalog
  if (category && items.length === 0)
    return { code: 2, stdout: "", stderr: `unknown category: ${category}` }
  if (options.json)
    return { code: 0, stdout: `${jsonLine(items)}\n`, stderr: "" }
  const lines = Object.entries(categoryLabels).flatMap(([key, label]) => {
    const group = items.filter((item) => item.category === key)
    return group.length
      ? [
          `${label}`,
          ...group.map(
            (item) => `  ${kebab(item.name).padEnd(24)} ${item.description}`,
          ),
        ]
      : []
  })
  return { code: 0, stdout: `${lines.join("\n")}\n`, stderr: "" }
}

async function inspectCommand(
  positionals: string[],
  options: CliOptions,
): Promise<CliResult> {
  const item = positionals[0] ? resolveComponent(positionals[0]) : undefined
  if (!item)
    return {
      code: 2,
      stdout: "",
      stderr: `unknown component: ${positionals[0] ?? "(missing)"}`,
    }
  if (options.json)
    return { code: 0, stdout: `${jsonLine(item)}\n`, stderr: "" }
  return {
    code: 0,
    stdout: `${item.name}\n${item.description}\n\nCategory: ${categoryLabels[item.category]}\nSource: ${item.sourceFiles.join(", ")}\nExport: ${item.exportName}\nStates: ${item.states.join(", ")}\nAccessibility: ${item.accessibility.join("; ")}\nAgent notes: ${item.agentNotes.join(" ")}\n`,
    stderr: "",
  }
}

async function addCommand(
  positionals: string[],
  options: CliOptions,
): Promise<CliResult> {
  const requested =
    positionals.length === 1 && positionals[0].toLowerCase() === "all"
      ? catalog
      : positionals.map(resolveComponent)
  if (requested.some((item) => !item)) {
    const invalid = positionals.find((value) => !resolveComponent(value))
    return {
      code: 2,
      stdout: "",
      stderr: `unknown component: ${invalid ?? "(missing)"}`,
    }
  }
  const components = requested as ComponentMeta[]
  const root = await sourceRoot()
  if (!root)
    return {
      code: 1,
      stdout: "",
      stderr: "could not locate @nifrajs/ui source files",
    }
  const outDir = resolve(options.cwd, options.out ?? "src/nifra-ui")
  const manifestPath = resolve(options.cwd, "nifra-ui.json")
  const existing = await readJson<InstallManifest>(manifestPath)
  const selected = [
    ...new Set([
      ...(existing?.components ?? []),
      ...components.map((item) => item.name),
    ]),
  ].sort()
  const files = sourceFiles.map((file) =>
    relative(options.cwd, resolve(outDir, file)),
  )
  const manifest: InstallManifest = {
    schemaVersion: "1.0",
    packageName: "@nifrajs/ui",
    components: selected,
    outDir: relative(options.cwd, outDir) || ".",
    files,
  }
  if (options.dryRun) {
    return options.json
      ? {
          code: 0,
          stdout: `${jsonLine({ outDir, files, components: selected })}\n`,
          stderr: "",
        }
      : {
          code: 0,
          stdout: `Would install ${components.length} component(s) to ${outDir}\n${files.map((file) => `  ${file}`).join("\n")}\n`,
          stderr: "",
        }
  }
  const conflicts: string[] = []
  for (const file of sourceFiles) {
    const target = resolve(outDir, file)
    if ((await exists(target)) && !options.force) {
      const [before, after] = await Promise.all([
        readFile(target, "utf8"),
        readFile(resolve(root, file), "utf8"),
      ])
      if (before !== after) conflicts.push(relative(options.cwd, target))
    }
  }
  if (conflicts.length)
    return {
      code: 2,
      stdout: "",
      stderr: `refusing to overwrite existing files (use --force):\n${conflicts.join("\n")}`,
    }
  for (const file of sourceFiles) {
    const target = resolve(outDir, file)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, await readFile(resolve(root, file), "utf8"))
  }
  await writeFile(manifestPath, `${jsonLine(manifest)}\n`)
  const packagePath = resolve(options.cwd, "package.json")
  const packageJson = await readJson<Record<string, unknown>>(packagePath)
  if (packageJson) {
    const devDependencies = {
      ...(packageJson.devDependencies as Record<string, string> | undefined),
    }
    if (
      !devDependencies["@stylexjs/stylex"] &&
      !(packageJson.dependencies as Record<string, string> | undefined)?.[
        "@stylexjs/stylex"
      ]
    ) {
      devDependencies["@stylexjs/stylex"] = "^0.19.0"
      packageJson.devDependencies = Object.fromEntries(
        Object.entries(devDependencies).sort(([a], [b]) => a.localeCompare(b)),
      )
      await writeFile(packagePath, `${jsonLine(packageJson)}\n`)
    }
  }
  if (options.json)
    return {
      code: 0,
      stdout: `${jsonLine({ outDir, files, components: selected })}\n`,
      stderr: "",
    }
  return {
    code: 0,
    stdout: `Installed ${components.length} component(s) to ${outDir}\nManifest: ${manifestPath}\n`,
    stderr: "",
  }
}

async function validateCommand(options: CliOptions): Promise<CliResult> {
  const manifestPath = resolve(options.cwd, "nifra-ui.json")
  const manifest = await readJson<InstallManifest>(manifestPath)
  const issues: string[] = []
  if (!manifest) issues.push("missing or invalid nifra-ui.json")
  if (
    manifest &&
    (manifest.schemaVersion !== "1.0" || manifest.packageName !== "@nifrajs/ui")
  )
    issues.push("unsupported manifest")
  if (manifest) {
    for (const name of manifest.components)
      if (!catalogByName[name])
        issues.push(`unknown component in manifest: ${name}`)
    for (const file of manifest.files)
      if (!(await exists(resolve(options.cwd, file))))
        issues.push(`missing installed file: ${file}`)
  }
  const result = {
    valid: issues.length === 0,
    issues,
    manifest: manifest ?? null,
  }
  if (options.json)
    return {
      code: result.valid ? 0 : 1,
      stdout: `${jsonLine(result)}\n`,
      stderr: "",
    }
  return result.valid
    ? { code: 0, stdout: "nifra-ui installation is valid\n", stderr: "" }
    : {
        code: 1,
        stdout: "",
        stderr: `nifra-ui validation failed:\n${issues.map((issue) => `  ${issue}`).join("\n")}\n`,
      }
}

async function doctorCommand(options: CliOptions): Promise<CliResult> {
  const packageJson = await readJson<Record<string, unknown>>(
    resolve(options.cwd, "package.json"),
  )
  const dependencies = {
    ...(packageJson?.dependencies as Record<string, string> | undefined),
    ...(packageJson?.devDependencies as Record<string, string> | undefined),
  }
  const checks = [
    {
      name: "package.json",
      ok: Boolean(packageJson),
      detail: packageJson ? "found" : "missing",
    },
    {
      name: "react",
      ok: Boolean(dependencies.react),
      detail: dependencies.react ?? "add react >=18.3",
    },
    {
      name: "@stylexjs/stylex",
      ok: Boolean(dependencies["@stylexjs/stylex"]),
      detail: dependencies["@stylexjs/stylex"] ?? "add @stylexjs/stylex >=0.19",
    },
    {
      name: "source install",
      ok: await exists(resolve(options.cwd, "nifra-ui.json")),
      detail: "nifra-ui.json",
    },
  ]
  const result = { healthy: checks.every((check) => check.ok), checks }
  if (options.json)
    return {
      code: result.healthy ? 0 : 1,
      stdout: `${jsonLine(result)}\n`,
      stderr: "",
    }
  return {
    code: result.healthy ? 0 : 1,
    stdout: `${checks.map((check) => `${check.ok ? "✓" : "✗"} ${check.name}: ${check.detail}`).join("\n")}\n`,
    stderr: "",
  }
}

export async function runCli(
  args: string[],
  cwd = process.cwd(),
): Promise<CliResult> {
  const parsed = parseArgs(args, cwd)
  if (parsed.error) return { code: 2, stdout: "", stderr: `${parsed.error}\n` }
  switch (parsed.command) {
    case "list":
      return listCommand(parsed.positionals, parsed.options)
    case "inspect":
      return inspectCommand(parsed.positionals, parsed.options)
    case "add":
      return addCommand(parsed.positionals, parsed.options)
    case "validate":
      return validateCommand(parsed.options)
    case "doctor":
      return doctorCommand(parsed.options)
    case "help":
      return { code: 0, stdout: renderHelp(), stderr: "" }
    default:
      return {
        code: 2,
        stdout: "",
        stderr: `unknown command: ${parsed.command}\n\n${renderHelp()}`,
      }
  }
}

if (import.meta.main) {
  const result = await runCli(Bun.argv.slice(2))
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exitCode = result.code
}
