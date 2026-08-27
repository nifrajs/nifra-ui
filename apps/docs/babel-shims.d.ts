declare module "@babel/core" {
  export function transformAsync(
    source: string,
    options: Record<string, unknown>,
  ): Promise<{ code?: string; metadata?: Record<string, unknown> } | null>
}

declare module "@babel/plugin-syntax-flow" {
  const plugin: unknown
  export default plugin
}
declare module "@babel/plugin-syntax-jsx" {
  const plugin: unknown
  export default plugin
}
declare module "@babel/plugin-syntax-typescript" {
  const plugin: unknown
  export default plugin
}
