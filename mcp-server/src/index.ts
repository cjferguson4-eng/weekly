#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import data source managers
import { SlackManager } from "./sources/slack.js";
import { ZoomManager } from "./sources/zoom.js";
import { ChorusManager } from "./sources/chorus.js";
import { SheetsManager } from "./sources/sheets.js";

interface DataSource {
  type: string;
  name: string;
  connected: boolean;
  lastSync?: Date;
}

class WeeklyUpdateMCPServer {
  private server: Server;
  private dataSources: Map<string, DataSource>;
  private slackManager: SlackManager;
  private zoomManager: ZoomManager;
  private chorusManager: ChorusManager;
  private sheetsManager: SheetsManager;

  constructor() {
    this.server = new Server(
      {
        name: "weekly-update-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Initialize data sources
    this.dataSources = new Map([
      ["slack", { type: "slack", name: "Slack", connected: false }],
      ["zoom", { type: "zoom", name: "Zoom", connected: false }],
      ["chorus", { type: "chorus", name: "Chorus.ai", connected: false }],
      ["sheets", { type: "sheets", name: "Google Sheets", connected: false }],
    ]);

    // Initialize managers
    this.slackManager = new SlackManager();
    this.zoomManager = new ZoomManager();
    this.chorusManager = new ChorusManager();
    this.sheetsManager = new SheetsManager();

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "connect_data_source",
          description: "Connect to a data source (slack, zoom, chorus, sheets)",
          inputSchema: {
            type: "object",
            properties: {
              source: {
                type: "string",
                enum: ["slack", "zoom", "chorus", "sheets"],
                description: "The data source to connect",
              },
            },
            required: ["source"],
          },
        },
        {
          name: "disconnect_data_source",
          description: "Disconnect from a data source",
          inputSchema: {
            type: "object",
            properties: {
              source: {
                type: "string",
                enum: ["slack", "zoom", "chorus", "sheets"],
                description: "The data source to disconnect",
              },
            },
            required: ["source"],
          },
        },
        {
          name: "list_data_sources",
          description: "List all available data sources and their connection status",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_slack_conversations",
          description: "Fetch Slack conversations from connected workspace",
          inputSchema: {
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
        {
          name: "get_zoom_meetings",
          description: "Fetch Zoom meetings from connected account",
          inputSchema: {
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
        {
          name: "get_chorus_recordings",
          description: "Fetch Chorus.ai call recordings",
          inputSchema: {
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
                description: "Maximum number of recordings to fetch (default: 20)",
              },
            },
          },
        },
        {
          name: "get_google_sheets",
          description: "List accessible Google Sheets",
          inputSchema: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Maximum number of sheets to fetch (default: 10)",
              },
            },
          },
        },
        {
          name: "read_sheet_data",
          description: "Read data from a specific Google Sheet",
          inputSchema: {
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
        {
          name: "sync_all_sources",
          description: "Sync data from all connected sources",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: "datasources://status",
          name: "Data Sources Status",
          description: "Current status of all data source connections",
          mimeType: "application/json",
        },
        {
          uri: "datasources://slack/conversations",
          name: "Slack Conversations",
          description: "List of Slack conversations",
          mimeType: "application/json",
        },
        {
          uri: "datasources://zoom/meetings",
          name: "Zoom Meetings",
          description: "List of Zoom meetings",
          mimeType: "application/json",
        },
        {
          uri: "datasources://chorus/recordings",
          name: "Chorus Recordings",
          description: "List of Chorus.ai call recordings",
          mimeType: "application/json",
        },
        {
          uri: "datasources://sheets/list",
          name: "Google Sheets List",
          description: "List of accessible Google Sheets",
          mimeType: "application/json",
        },
      ],
    }));

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      if (uri === "datasources://status") {
        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(
                Array.from(this.dataSources.values()),
                null,
                2
              ),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "connect_data_source":
            return await this.handleConnectDataSource(args as { source: string });

          case "disconnect_data_source":
            return await this.handleDisconnectDataSource(args as { source: string });

          case "list_data_sources":
            return await this.handleListDataSources();

          case "get_slack_conversations":
            return await this.handleGetSlackConversations(args as any);

          case "get_zoom_meetings":
            return await this.handleGetZoomMeetings(args as any);

          case "get_chorus_recordings":
            return await this.handleGetChorusRecordings(args as any);

          case "get_google_sheets":
            return await this.handleGetGoogleSheets(args as any);

          case "read_sheet_data":
            return await this.handleReadSheetData(args as any);

          case "sync_all_sources":
            return await this.handleSyncAllSources();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: errorMessage,
              }),
            },
          ],
        };
      }
    });
  }

  private async handleConnectDataSource(args: { source: string }) {
    const { source } = args;
    const dataSource = this.dataSources.get(source);

    if (!dataSource) {
      throw new Error(`Invalid data source: ${source}`);
    }

    let result;
    switch (source) {
      case "slack":
        result = await this.slackManager.connect();
        break;
      case "zoom":
        result = await this.zoomManager.connect();
        break;
      case "chorus":
        result = await this.chorusManager.connect();
        break;
      case "sheets":
        result = await this.sheetsManager.connect();
        break;
      default:
        throw new Error(`Unsupported data source: ${source}`);
    }

    if (result.success) {
      dataSource.connected = true;
      dataSource.lastSync = new Date();
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: result.success,
            source: dataSource.name,
            message: result.message,
            connected: dataSource.connected,
          }),
        },
      ],
    };
  }

  private async handleDisconnectDataSource(args: { source: string }) {
    const { source } = args;
    const dataSource = this.dataSources.get(source);

    if (!dataSource) {
      throw new Error(`Invalid data source: ${source}`);
    }

    dataSource.connected = false;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            source: dataSource.name,
            message: `Disconnected from ${dataSource.name}`,
            connected: false,
          }),
        },
      ],
    };
  }

  private async handleListDataSources() {
    const sources = Array.from(this.dataSources.values());

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            dataSources: sources,
            connectedCount: sources.filter((s) => s.connected).length,
            totalCount: sources.length,
          }),
        },
      ],
    };
  }

  private async handleGetSlackConversations(args: any) {
    if (!this.dataSources.get("slack")?.connected) {
      throw new Error("Slack is not connected");
    }

    const conversations = await this.slackManager.getConversations(
      args?.limit || 20,
      args?.types || "public_channel,private_channel"
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            conversations,
          }),
        },
      ],
    };
  }

  private async handleGetZoomMeetings(args: any) {
    if (!this.dataSources.get("zoom")?.connected) {
      throw new Error("Zoom is not connected");
    }

    const meetings = await this.zoomManager.getMeetings(
      args?.from,
      args?.to,
      args?.limit || 30
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            meetings,
          }),
        },
      ],
    };
  }

  private async handleGetChorusRecordings(args: any) {
    if (!this.dataSources.get("chorus")?.connected) {
      throw new Error("Chorus.ai is not connected");
    }

    const recordings = await this.chorusManager.getRecordings(
      args?.from,
      args?.to,
      args?.limit || 20
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            recordings,
          }),
        },
      ],
    };
  }

  private async handleGetGoogleSheets(args: any) {
    if (!this.dataSources.get("sheets")?.connected) {
      throw new Error("Google Sheets is not connected");
    }

    const sheets = await this.sheetsManager.listSheets(args?.limit || 10);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            sheets,
          }),
        },
      ],
    };
  }

  private async handleReadSheetData(args: any) {
    if (!this.dataSources.get("sheets")?.connected) {
      throw new Error("Google Sheets is not connected");
    }

    const data = await this.sheetsManager.readSheet(
      args.spreadsheetId,
      args.range
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            data,
          }),
        },
      ],
    };
  }

  private async handleSyncAllSources() {
    const results = [];

    for (const [key, source] of this.dataSources.entries()) {
      if (source.connected) {
        source.lastSync = new Date();
        results.push({
          source: source.name,
          synced: true,
          lastSync: source.lastSync,
        });
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Synced ${results.length} data sources`,
            results,
          }),
        },
      ],
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Weekly Update MCP Server running on stdio");
  }
}

// Start the server
const server = new WeeklyUpdateMCPServer();
server.run().catch(console.error);

