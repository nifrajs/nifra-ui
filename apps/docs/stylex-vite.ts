import { transformAsync } from "@babel/core"
import syntaxFlow from "@babel/plugin-syntax-flow"
import syntaxJsx from "@babel/plugin-syntax-jsx"
import syntaxTypescript from "@babel/plugin-syntax-typescript"
import stylexPlugin from "@stylexjs/babel-plugin"

const virtualCss = "virtual:nifra-ui-stylex.css"

export function stylexVite() {
  const rules: unknown[] = []
  return {
    name: "nifra-ui-stylex",
    async transform(source: string, id: string) {
      if (
        /node_modules/.test(id) ||
        !/\.[cm]?[jt]sx?$/.test(id) ||
        !source.includes("stylex")
      )
        return
      const result = await transformAsync(source, {
        babelrc: false,
        configFile: false,
        filename: id,
        plugins: [
          [syntaxFlow, { all: true }],
          [syntaxTypescript, { isTSX: true }],
          syntaxJsx,
          stylexPlugin.withOptions({
            dev: true,
            runtimeInjection: false,
            treeshakeCompensation: true,
            unstable_moduleResolution: {
              type: "commonJS",
              rootDir: process.cwd(),
            },
          }),
        ],
      })
      const metadata = result?.metadata as { stylex?: unknown[] } | undefined
      if (metadata?.stylex) rules.push(...metadata.stylex)
      if (!result?.code) return
      return `${result.code}\nimport ${JSON.stringify(virtualCss)}`
    },
    resolveId(id: string) {
      return id === virtualCss ? `\0${virtualCss}` : undefined
    },
    load(id: string) {
      if (id !== `\0${virtualCss}`) return undefined
      return stylexPlugin.processStylexRules(rules as never[], {
        useLayers: true,
      })
    },
  }
}
