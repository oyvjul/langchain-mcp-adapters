# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js adapter library that bridges Model Context Protocol (MCP) servers with LangChain applications. The adapter enables LangChain workflows to use MCP tools by handling the connection, tool discovery, and conversion between MCP and LangChain formats.

## Core Architecture

### Key Components

**LangChainMCPAdapter Class** (index.js)
- Central adapter class managing the lifecycle of MCP server connections
- Uses `@modelcontextprotocol/sdk` Client with StdioClientTransport for stdio-based MCP server communication
- Leverages `@langchain/mcp-adapters` `convertMCPToolToLangChainTool` utility for tool format conversion
- Wraps ChatOpenAI model with `bindTools()` to integrate converted tools

### Connection Flow

1. Adapter instantiation → Client initialization
2. `connect(command, args)` → StdioClientTransport → MCP server process spawning
3. `listTools()` → Queries MCP server capabilities
4. `getLangChainTools()` → Maps MCP tools through `convertMCPToolToLangChainTool()`
5. `getModelWithTools()` → Creates ChatOpenAI instance + binds converted tools
6. `close()` → Tears down client connection

### Module Type

CommonJS module (`type: "commonjs"` in package.json). All imports/exports use `require()`/`module.exports`.

## Development Commands

### Running Examples

```bash
# Set OpenAI API key (required)
export OPENAI_API_KEY="your-key-here"

# Run the example demonstrating memory server integration
npm run example
# or
node example.js
```

### Installation

```bash
npm install
```

## Example MCP Servers for Testing

The adapter works with any MCP server that implements the stdio transport:

```bash
# Memory server (used in example.js)
npx -y @modelcontextprotocol/server-memory

# Filesystem server
npx -y @modelcontextprotocol/server-filesystem /path/to/directory

# SQLite server
npx -y @modelcontextprotocol/server-sqlite /path/to/database.db
```

## Usage Pattern

All usage follows this pattern:
1. Create adapter instance
2. Connect to MCP server via stdio command
3. Retrieve and convert tools
4. Bind tools to LangChain model
5. Invoke model with queries
6. Clean up connection

See example.js for a complete working implementation using the memory server.

## Environment Requirements

- Node.js environment
- OpenAI API key set in environment for ChatOpenAI usage
- MCP servers accessed via stdio (typically through npx commands)
