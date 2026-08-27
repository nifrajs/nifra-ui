import {
  type ComponentMeta,
  catalog,
  categoryLabels,
  registry,
} from "@nifrajs/ui-registry"

type JsonRpcRequest = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: Record<string, unknown>
}

const tools = [
  {
    name: "list_components",
    description:
      "List Nifra UI components from the public StyleX registry. Filter by category when useful.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", enum: Object.keys(categoryLabels) },
      },
      additionalProperties: false,
    },
  },
  {
    name: "inspect_component",
    description:
      "Inspect a component's typed, accessibility, state, source, and agent composition contract.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: { name: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "suggest_components",
    description:
      "Find likely components for a UI intent without inventing component names.",
    inputSchema: {
      type: "object",
      required: ["intent"],
      properties: {
        intent: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 10 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "validate_contract",
    description:
      "Validate a proposed component composition against the public registry.",
    inputSchema: {
      type: "object",
      required: ["components"],
      properties: { components: { type: "array", items: { type: "string" } } },
      additionalProperties: false,
    },
  },
]

function textResult(value: unknown, isError = false): Record<string, unknown> {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
    ...(isError ? { isError: true } : {}),
  }
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function findComponent(value: string): ComponentMeta | undefined {
  const key = normalize(value)
  return catalog.find((item) => normalize(item.name) === key)
}

function suggest(intent: string, limit: number): ComponentMeta[] {
  const words = intent
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2)
  const ranked = catalog
    .map((item) => {
      const haystack = normalize(
        `${item.name} ${item.category} ${item.description} ${item.agentNotes.join(" ")}`,
      )
      const score = words.reduce(
        (sum, word) => sum + (haystack.includes(normalize(word)) ? 1 : 0),
        0,
      )
      return { item, score }
    })
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
  return ranked.slice(0, limit).map(({ item }) => item)
}

export async function handleMcpRequest(
  request: JsonRpcRequest,
): Promise<Record<string, unknown> | null> {
  const id = request.id ?? null
  if (
    request.method === "notifications/initialized" ||
    request.method?.startsWith("notifications/")
  )
    return null
  if (request.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: "nifra-ui", version: "0.1.0" },
      },
    }
  }
  if (request.method === "resources/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        resources: [
          {
            uri: "nifra-ui://registry",
            name: "Nifra UI registry",
            description: "Public, deterministic StyleX component contracts.",
            mimeType: "application/json",
          },
        ],
      },
    }
  }
  if (request.method === "resources/read") {
    if (request.params?.uri !== "nifra-ui://registry")
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: "unknown resource" },
      }
    return {
      jsonrpc: "2.0",
      id,
      result: {
        contents: [
          {
            uri: "nifra-ui://registry",
            mimeType: "application/json",
            text: JSON.stringify(registry, null, 2),
          },
        ],
      },
    }
  }
  if (request.method === "tools/list")
    return { jsonrpc: "2.0", id, result: { tools } }
  if (request.method === "tools/call") {
    const name = String(request.params?.name ?? "")
    const args = (request.params?.arguments ?? {}) as Record<string, unknown>
    if (name === "list_components") {
      const category =
        typeof args.category === "string" ? args.category : undefined
      const items = category
        ? catalog.filter((item) => item.category === category)
        : catalog
      if (category && items.length === 0)
        return {
          jsonrpc: "2.0",
          id,
          result: textResult(
            {
              error: `unknown category: ${category}`,
              categories: Object.keys(categoryLabels),
            },
            true,
          ),
        }
      return {
        jsonrpc: "2.0",
        id,
        result: textResult({ count: items.length, components: items }),
      }
    }
    if (name === "inspect_component") {
      const component =
        typeof args.name === "string" ? findComponent(args.name) : undefined
      if (!component)
        return {
          jsonrpc: "2.0",
          id,
          result: textResult(
            { error: `unknown component: ${String(args.name ?? "(missing)")}` },
            true,
          ),
        }
      return { jsonrpc: "2.0", id, result: textResult(component) }
    }
    if (name === "suggest_components") {
      const intent = typeof args.intent === "string" ? args.intent : ""
      const limit =
        typeof args.limit === "number"
          ? Math.max(1, Math.min(10, Math.floor(args.limit)))
          : 5
      return {
        jsonrpc: "2.0",
        id,
        result: textResult({ intent, components: suggest(intent, limit) }),
      }
    }
    if (name === "validate_contract") {
      const proposed = Array.isArray(args.components)
        ? args.components.filter(
            (item): item is string => typeof item === "string",
          )
        : []
      const unknown = proposed.filter((item) => !findComponent(item))
      const resolved = proposed
        .map(findComponent)
        .filter((item): item is ComponentMeta => Boolean(item))
      return {
        jsonrpc: "2.0",
        id,
        result: textResult({
          valid: proposed.length > 0 && unknown.length === 0,
          requested: proposed,
          unknown,
          resolved: resolved.map((item) => item.name),
          guidance: unknown.length
            ? "Use inspect_component or list_components before composing."
            : "All requested surfaces are present in the registry.",
        }),
      }
    }
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `unknown tool: ${name}` },
    }
  }
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `unknown method: ${request.method ?? "(missing)"}`,
    },
  }
}

export async function serveMcp(
  input: AsyncIterable<string>,
  output: (line: string) => void,
): Promise<void> {
  for await (const line of input) {
    if (!line.trim()) continue
    try {
      const response = await handleMcpRequest(
        JSON.parse(line) as JsonRpcRequest,
      )
      if (response) output(JSON.stringify(response))
    } catch (error) {
      output(
        JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message:
              error instanceof Error
                ? error.message
                : "invalid JSON-RPC request",
          },
        }),
      )
    }
  }
}

if (import.meta.main) {
  const decoder = new TextDecoder()
  let buffer = ""
  const lines = (async function* () {
    for await (const chunk of Bun.stdin.stream()) {
      buffer += decoder.decode(chunk, { stream: true })
      const parts = buffer.split("\n")
      buffer = parts.pop() ?? ""
      for (const part of parts) yield part
    }
    if (buffer) yield buffer
  })()
  await serveMcp(lines, (line) => process.stdout.write(`${line}\n`))
}
