const { LangChainMCPAdapter } = require("./index.js");

/**
 * Example: Using LangChain MCP Adapter
 *
 * This example demonstrates how to:
 * 1. Connect to an MCP server
 * 2. List available tools
 * 3. Convert MCP tools to LangChain tools
 * 4. Use tools with a ChatOpenAI model
 */

async function main() {
  const adapter = new LangChainMCPAdapter();

  try {
    // Connect to an MCP server
    // Example: npx -y @modelcontextprotocol/server-memory
    // Replace with your MCP server command
    console.log("Connecting to MCP server...");
    await adapter.connect("npx", ["-y", "@modelcontextprotocol/server-memory"]);

    // List available tools
    console.log("\nAvailable MCP Tools:");
    const mcpTools = await adapter.listTools();
    mcpTools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    // Get LangChain-compatible tools
    console.log("\nConverting to LangChain tools...");
    const langchainTools = await adapter.getLangChainTools();
    console.log(`Converted ${langchainTools.length} tools`);

    // Get a model with tools bound
    console.log("\nInitializing ChatOpenAI with tools...");
    const model = await adapter.getModelWithTools({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    // Example usage: Invoke the model with a query
    console.log("\nInvoking model...");
    const response = await model.invoke(
      "Store the fact that the user's favorite color is blue"
    );
    console.log("\nModel Response:");
    console.log(response.content);

    // Query the stored information
    console.log("\nQuerying stored information...");
    const queryResponse = await model.invoke(
      "What is my favorite color?"
    );
    console.log("\nQuery Response:");
    console.log(queryResponse.content);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    // Clean up
    await adapter.close();
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
