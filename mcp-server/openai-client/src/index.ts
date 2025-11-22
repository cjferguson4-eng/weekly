#!/usr/bin/env node

import OpenAI from "openai";
import * as readline from "readline";
import * as dotenv from "dotenv";
import { MCPClient } from "./mcp-client.js";

// Load environment variables
dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mcpClient = new MCPClient();

// Available MCP tools
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "connect_data_source",
      description: "Connect to a data source (slack, zoom, chorus, or sheets)",
      parameters: {
        type: "object",
        properties: {
          source: {
            type: "string",
            enum: ["slack", "zoom", "chorus", "sheets"],
            description: "The data source to connect to",
          },
        },
        required: ["source"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_data_sources",
      description: "List all available data sources and their connection status",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_slack_conversations",
      description: "Fetch Slack conversations from connected workspace",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of conversations to fetch (default: 20)",
          },
          types: {
            type: "string",
            description: "Types of conversations (public_channel,private_channel,mpim,im)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_zoom_meetings",
      description: "Fetch Zoom meetings from connected account",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Start date (YYYY-MM-DD)",
          },
          to: {
            type: "string",
            description: "End date (YYYY-MM-DD)",
          },
          limit: {
            type: "number",
            description: "Maximum number of meetings to fetch (default: 30)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_google_sheets",
      description: "List accessible Google Sheets",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of sheets to fetch (default: 10)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_sheet_data",
      description: "Read data from a specific Google Sheet",
      parameters: {
        type: "object",
        properties: {
          spreadsheetId: {
            type: "string",
            description: "The ID of the Google Sheet",
          },
          range: {
            type: "string",
            description: "The A1 notation range (e.g., 'Sheet1!A1:D10')",
          },
        },
        required: ["spreadsheetId", "range"],
      },
    },
  },
];

interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
  tool_call_id?: string;
}

class WeeklyUpdateChatbot {
  private messages: Message[] = [];
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // System prompt
    this.messages.push({
      role: "system",
      content: `You are a helpful assistant that helps users manage their weekly updates by connecting to various data sources (Slack, Zoom, Chorus.ai, Google Sheets).

You have access to tools that can:
- Connect to data sources
- List available data sources and their status
- Fetch data from connected sources (conversations, meetings, recordings, sheets)

When a user asks to work with a data source, first check if it's connected by listing sources. If not connected, connect to it first before fetching data.

Be helpful, concise, and guide users through the process of collecting their weekly update data.`,
    });
  }

  async callMCPTool(name: string, args: any): Promise<string> {
    try {
      const result = await mcpClient.callTool(name, args);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async chat(userMessage: string): Promise<string> {
    this.messages.push({
      role: "user",
      content: userMessage,
    });

    let response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: this.messages as any,
      tools: tools,
      tool_choice: "auto",
    });

    let assistantMessage = response.choices[0].message;

    // Handle tool calls
    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      this.messages.push({
        role: "assistant",
        content: assistantMessage.content || "",
        tool_calls: assistantMessage.tool_calls,
      });

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        console.log(
          `\n🔧 Calling ${functionName}(${JSON.stringify(functionArgs)})...`
        );

        const result = await this.callMCPTool(functionName, functionArgs);

        this.messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Get next response from OpenAI
      response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: this.messages as any,
        tools: tools,
        tool_choice: "auto",
      });

      assistantMessage = response.choices[0].message;
    }

    // Add final assistant message
    this.messages.push({
      role: "assistant",
      content: assistantMessage.content || "",
    });

    return assistantMessage.content || "";
  }

  async start() {
    console.log("╔═══════════════════════════════════════════════════════════╗");
    console.log("║       Weekly Update Assistant (Powered by OpenAI)        ║");
    console.log("╚═══════════════════════════════════════════════════════════╝");
    console.log("\nConnected to MCP Server ✓");
    console.log("\nType your questions or commands in natural language.");
    console.log("Examples:");
    console.log("  • 'Connect to Slack'");
    console.log("  • 'Show me my data sources'");
    console.log("  • 'Get my Zoom meetings from last week'");
    console.log("\nType 'quit' or 'exit' to end the session.\n");

    const askQuestion = () => {
      this.rl.question("\n💬 You: ", async (input) => {
        const message = input.trim();

        if (!message) {
          askQuestion();
          return;
        }

        if (message.toLowerCase() === "quit" || message.toLowerCase() === "exit") {
          console.log("\n👋 Goodbye! Thanks for using Weekly Update Assistant.\n");
          this.rl.close();
          process.exit(0);
          return;
        }

        try {
          console.log("\n🤔 Thinking...");
          const response = await this.chat(message);
          console.log(`\n🤖 Assistant: ${response}`);
        } catch (error) {
          console.error(
            "\n❌ Error:",
            error instanceof Error ? error.message : String(error)
          );
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY not found in environment variables.");
  console.error("\nPlease add your OpenAI API key to mcp-server/.env:");
  console.error("  OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE\n");
  process.exit(1);
}

// Start the chatbot
const chatbot = new WeeklyUpdateChatbot();
chatbot.start().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

