# @nifrajs/ui-mcp

An intentionally small, dependency-light MCP server exposing the public Nifra UI registry over JSON-RPC stdio. It gives coding agents a safe discovery path before they compose or install UI.

```json
{
  "mcpServers": {
    "nifra-ui": {
      "command": "bunx",
      "args": ["@nifrajs/ui-mcp"]
    }
  }
}
```

Tools: `list_components`, `inspect_component`, `suggest_components`, and `validate_contract`. The server exposes no credentials, hosted state, telemetry, or private product metadata.
