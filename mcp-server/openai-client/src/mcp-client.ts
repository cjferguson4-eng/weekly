import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// This is a simple client that mimics calling the MCP server
// In a real setup, this would communicate with the actual MCP server process
// For now, we'll import the data source managers directly

import { SlackManager } from "../../dist/sources/slack.js";
import { ZoomManager } from "../../dist/sources/zoom.js";
import { ChorusManager } from "../../dist/sources/chorus.js";
import { SheetsManager } from "../../dist/sources/sheets.js";

interface DataSource {
  type: string;
  name: string;
  connected: boolean;
  lastSync?: Date;
}

export class MCPClient {
  private dataSources: Map<string, DataSource>;
  private slackManager: SlackManager;
  private zoomManager: ZoomManager;
  private chorusManager: ChorusManager;
  private sheetsManager: SheetsManager;

  constructor() {
    this.dataSources = new Map([
      ["slack", { type: "slack", name: "Slack", connected: false }],
      ["zoom", { type: "zoom", name: "Zoom", connected: false }],
      ["chorus", { type: "chorus", name: "Chorus.ai", connected: false }],
      ["sheets", { type: "sheets", name: "Google Sheets", connected: false }],
    ]);

    this.slackManager = new SlackManager();
    this.zoomManager = new ZoomManager();
    this.chorusManager = new ChorusManager();
    this.sheetsManager = new SheetsManager();
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "connect_data_source":
        return await this.connectDataSource(args.source);

      case "list_data_sources":
        return this.listDataSources();

      case "get_slack_conversations":
        return await this.getSlackConversations(args);

      case "get_zoom_meetings":
        return await this.getZoomMeetings(args);

      case "get_google_sheets":
        return await this.getGoogleSheets(args);

      case "read_sheet_data":
        return await this.readSheetData(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async connectDataSource(source: string) {
    const dataSource = this.dataSources.get(source);

    if (!dataSource) {
      return {
        success: false,
        error: `Invalid data source: ${source}`,
      };
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
        return {
          success: false,
          error: `Unsupported data source: ${source}`,
        };
    }

    if (result.success) {
      dataSource.connected = true;
      dataSource.lastSync = new Date();
    }

    return {
      success: result.success,
      source: dataSource.name,
      message: result.message,
      connected: dataSource.connected,
    };
  }

  private listDataSources() {
    const sources = Array.from(this.dataSources.values());

    return {
      success: true,
      dataSources: sources,
      connectedCount: sources.filter((s) => s.connected).length,
      totalCount: sources.length,
    };
  }

  private async getSlackConversations(args: any) {
    if (!this.dataSources.get("slack")?.connected) {
      return {
        success: false,
        error: "Slack is not connected. Please connect to Slack first.",
      };
    }

    try {
      const conversations = await this.slackManager.getConversations(
        args?.limit || 20,
        args?.types || "public_channel,private_channel"
      );

      return {
        success: true,
        conversations,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async getZoomMeetings(args: any) {
    if (!this.dataSources.get("zoom")?.connected) {
      return {
        success: false,
        error: "Zoom is not connected. Please connect to Zoom first.",
      };
    }

    try {
      const meetings = await this.zoomManager.getMeetings(
        args?.from,
        args?.to,
        args?.limit || 30
      );

      return {
        success: true,
        meetings,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async getGoogleSheets(args: any) {
    if (!this.dataSources.get("sheets")?.connected) {
      return {
        success: false,
        error: "Google Sheets is not connected. Please connect to Google Sheets first.",
      };
    }

    try {
      const sheets = await this.sheetsManager.listSheets(args?.limit || 10);

      return {
        success: true,
        sheets,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async readSheetData(args: any) {
    if (!this.dataSources.get("sheets")?.connected) {
      return {
        success: false,
        error: "Google Sheets is not connected. Please connect to Google Sheets first.",
      };
    }

    try {
      const data = await this.sheetsManager.readSheet(
        args.spreadsheetId,
        args.range
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

