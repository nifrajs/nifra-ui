import { resolve } from "node:path"
import {
  adapterManifest,
  crossFrameworkComponents,
} from "../packages/ui-adapters/src/index.ts"
import { catalog } from "../packages/ui-registry/src/index.ts"

const workspace = resolve(import.meta.dir, "..")
const alphaVersion = "0.1.0-alpha.1"
const packageDirectories = [
  "ui",
  "ui-adapters",
  "ui-elements",
  "ui-vue",
  "ui-svelte",
  "ui-solid",
  "ui-screens",
  "ui-registry",
  "ui-cli",
  "ui-mcp",
]

function fail(message: string): never {
  throw new Error(`alpha release check failed: ${message}`)
}

for (const directory of packageDirectories) {
  const packageRoot = resolve(workspace, "packages", directory)
  const packageFile = resolve(packageRoot, "package.json")
  const manifest = JSON.parse(await Bun.file(packageFile).text()) as {
    name: string
    version: string
    license?: string
    repository?: { url?: string }
    publishConfig?: { access?: string }
    files?: string[]
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
  }

  if (manifest.version !== alphaVersion)
    fail(`${manifest.name} is ${manifest.version}, expected ${alphaVersion}`)
  if (manifest.license !== "MIT")
    fail(`${manifest.name} is missing MIT license`)
  if (manifest.repository?.url !== "https://github.com/nifrajs/nifra-ui.git")
    fail(`${manifest.name} is missing the public repository URL`)
  if (manifest.publishConfig?.access !== "public")
    fail(`${manifest.name} is not marked public in publishConfig`)
  for (const file of ["dist", "README.md", "LICENSE"])
    if (!manifest.files?.includes(file))
      fail(`${manifest.name} does not include ${file} in its package files`)
  if (!(await Bun.file(resolve(packageRoot, "LICENSE")).exists()))
    fail(`${manifest.name} has no package-local LICENSE file`)
  for (const dependencies of [manifest.dependencies, manifest.peerDependencies])
    for (const [name, version] of Object.entries(dependencies ?? {}))
      if (version.startsWith("workspace:"))
        fail(`${manifest.name} still publishes a workspace dependency: ${name}`)
}

const adapters = new Map(
  adapterManifest.map((adapter) => [adapter.target, adapter]),
)
for (const target of ["vue", "svelte", "solid"] as const) {
  const adapter = adapters.get(target)
  if (!adapter || adapter.status !== "alpha")
    fail(`${target} adapter is not marked alpha`)
  if (adapter.components.length !== crossFrameworkComponents.length)
    fail(`${target} adapter has incomplete core coverage`)
}

const { compile: compileSvelte } = await import("svelte/compiler")
const svelteFiles = new Bun.Glob("*.svelte").scan({
  cwd: resolve(workspace, "packages/ui-svelte/src"),
})
for await (const file of svelteFiles) {
  const sourcePath = resolve(workspace, "packages/ui-svelte/src", file)
  try {
    compileSvelte(await Bun.file(sourcePath).text(), {
      filename: file,
      generate: false,
    })
  } catch (error) {
    fail(`Svelte adapter source does not compile: ${file} (${String(error)})`)
  }
}

const coreNames = new Set<string>(crossFrameworkComponents)
for (const item of catalog) {
  const isCore = coreNames.has(item.name)
  for (const target of ["vue", "svelte", "solid", "web-components"] as const) {
    const status = item.targets[target]
    if (isCore && status !== "alpha")
      fail(`${item.name} should be alpha for ${target}`)
    if (!isCore && status !== "planned")
      fail(`${item.name} is marked ${target} without an adapter`)
  }
}

for (const [directory, forbidden] of [
  ["ui-vue", /from ["']react["']|@nifrajs\/ui["']/],
  ["ui-svelte", /from ["']react["']|@nifrajs\/ui["']/],
  ["ui-solid", /from ["']react["']|@nifrajs\/ui["']/],
] as const) {
  const sourceRoot = resolve(workspace, "packages", directory, "src")
  const sourceFiles = new Bun.Glob("*").scan({ cwd: sourceRoot })
  for await (const file of sourceFiles) {
    const source = await Bun.file(resolve(sourceRoot, file)).text()
    if (forbidden.test(source)) fail(`${directory}/${file} imports React`)
  }
}

console.log(
  `alpha release ok: ${packageDirectories.length} packages, ${crossFrameworkComponents.length} cross-framework components`,
)
