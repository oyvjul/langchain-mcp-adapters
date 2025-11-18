const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const { convertMCPToolToLangChainTool } = require("@langchain/mcp-adapters");
const { ChatOpenAI } = require("@langchain/openai");

/**
 * LangChain MCP Adapter
 *
 * This module provides functionality to integrate Model Context Protocol (MCP)
 * servers with LangChain applications.
 */

class LangChainMCPAdapter {
  constructor() {
    this.client = null;
    this.tools = [];
  }

  /**
   * Connect to an MCP server
   * @param {string} command - The command to run the MCP server
   * @param {string[]} args - Arguments for the command
   * @returns {Promise<void>}
   */
  async connect(command, args = []) {
    const transport = new StdioClientTransport({
      command,
      args,
    });

    this.client = new Client(
      {
        name: "langchain-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await this.client.connect(transport);
    console.log("Connected to MCP server");
  }

  /**
   * List all available tools from the MCP server
   * @returns {Promise<Array>}
   */
  async listTools() {
    if (!this.client) {
      throw new Error("Client not connected. Call connect() first.");
    }

    const response = await this.client.listTools();
    return response.tools;
  }

  /**
   * Convert MCP tools to LangChain tools
   * @returns {Promise<Array>}
   */
  async getLangChainTools() {
    const mcpTools = await this.listTools();

    this.tools = mcpTools.map((tool) =>
      convertMCPToolToLangChainTool(tool, this.client)
    );

    return this.tools;
  }

  /**
   * Get a ChatOpenAI instance bound with MCP tools
   * @param {Object} config - OpenAI configuration
   * @returns {Promise<ChatOpenAI>}
   */
  async getModelWithTools(config = {}) {
    const tools = await this.getLangChainTools();

    const model = new ChatOpenAI({
      model: config.model || "gpt-4o-mini",
      temperature: config.temperature || 0,
      ...config,
    });

    return model.bindTools(tools);
  }

  /**
   * Close the connection to the MCP server
   */
  async close() {
    if (this.client) {
      await this.client.close();
      console.log("Disconnected from MCP server");
    }
  }
}

module.exports = {
  LangChainMCPAdapter,
  convertMCPToolToLangChainTool,
};
