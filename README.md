# LangChain MCP Adapters

A Node.js adapter for integrating Model Context Protocol (MCP) servers with LangChain applications.

## Overview

This project provides a simple and efficient way to connect MCP servers to LangChain, allowing you to use MCP tools seamlessly within your LangChain workflows.

## Installation

```bash
npm install
```

## Dependencies

This project uses the latest versions of:

- `@modelcontextprotocol/sdk` (^1.22.0) - MCP SDK for client connections
- `@langchain/langgraph` (^1.0.2) - LangGraph for workflow orchestration
- `@langchain/mcp-adapters` (^1.0.0) - Official LangChain MCP adapters
- `@langchain/openai` (^1.1.2) - OpenAI integration for LangChain

## Usage

### Basic Example

```javascript
const { LangChainMCPAdapter } = require("./index.js");

async function main() {
  const adapter = new LangChainMCPAdapter();

  // Connect to an MCP server
  await adapter.connect("npx", ["-y", "@modelcontextprotocol/server-memory"]);

  // Get LangChain-compatible tools
  const tools = await adapter.getLangChainTools();

  // Get a model with tools bound
  const model = await adapter.getModelWithTools({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  // Use the model
  const response = await model.invoke("Your query here");
  console.log(response.content);

  // Clean up
  await adapter.close();
}

main().catch(console.error);
```

### Running the Example

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Run the example:

```bash
node example.js
```

## API Reference

### `LangChainMCPAdapter`

Main class for connecting to MCP servers and converting tools to LangChain format.

#### Methods

##### `connect(command, args)`

Connect to an MCP server.

- **Parameters:**
  - `command` (string): The command to run the MCP server
  - `args` (string[]): Arguments for the command
- **Returns:** Promise<void>

##### `listTools()`

List all available tools from the MCP server.

- **Returns:** Promise<Array> - Array of MCP tool definitions

##### `getLangChainTools()`

Convert MCP tools to LangChain-compatible tools.

- **Returns:** Promise<Array> - Array of LangChain tools

##### `getModelWithTools(config)`

Get a ChatOpenAI instance with MCP tools bound.

- **Parameters:**
  - `config` (Object): OpenAI configuration
    - `model` (string): Model name (default: "gpt-4o-mini")
    - `temperature` (number): Temperature setting (default: 0)
- **Returns:** Promise<ChatOpenAI> - ChatOpenAI instance with tools

##### `close()`

Close the connection to the MCP server.

- **Returns:** Promise<void>

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for using ChatOpenAI)

## Example MCP Servers

You can connect to various MCP servers:

- **Memory Server**: `npx -y @modelcontextprotocol/server-memory`
- **Filesystem Server**: `npx -y @modelcontextprotocol/server-filesystem /path/to/directory`
- **SQLite Server**: `npx -y @modelcontextprotocol/server-sqlite /path/to/database.db`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [LangChain Documentation](https://js.langchain.com)
- [LangChain MCP Adapters](https://js.langchain.com/docs/integrations/tools/mcp)
