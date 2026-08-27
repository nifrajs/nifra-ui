import { describe, expect, test } from "bun:test"
import { handleMcpRequest } from "../packages/ui-mcp/src/index"

describe("MCP contract server", () => {
  test("supports initialization and tool discovery", async () => {
    const initialized = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
    })
    expect(initialized?.result).toBeDefined()
    const listed = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
    })
    const names = (
      listed?.result as { tools: Array<{ name: string }> }
    ).tools.map((tool) => tool.name)
    expect(names).toEqual([
      "list_components",
      "inspect_component",
      "suggest_components",
      "validate_contract",
    ])
  })

  test("keeps agents inside the registry", async () => {
    const response = await handleMcpRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "validate_contract",
        arguments: { components: ["Button", "not-real"] },
      },
    })
    const structured = (
      response?.result as {
        structuredContent: { valid: boolean; unknown: string[] }
      }
    ).structuredContent
    expect(structured.valid).toBe(false)
    expect(structured.unknown).toEqual(["not-real"])
  })
})
