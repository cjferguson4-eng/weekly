# Weekly Update MCP Server

An MCP (Model Context Protocol) server for managing data source connections and retrieving data from Slack, Zoom, Chorus.ai, and Google Sheets for automated weekly update generation.

## Features

- 🔌 **Connect/Disconnect Data Sources**: Manage connections to multiple services
- 💬 **Slack Integration**: Fetch conversations and message history
- 📹 **Zoom Integration**: Retrieve meeting information and recordings
- 🎤 **Chorus.ai Integration**: Access call recordings and transcripts
- 📊 **Google Sheets Integration**: List and read spreadsheet data
- 🔄 **Sync Management**: Synchronize data from all connected sources
- 🤖 **Agent-Ready**: Designed for AI agent interaction via MCP

## Installation

### Prerequisites

- Node.js 18 or higher
- Access to the data sources you want to connect (Slack, Zoom, etc.)
- API credentials for each service

### Setup

1. **Install dependencies:**

```bash
cd mcp-server
npm install
```

2. **Configure environment variables:**

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your API credentials:

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-PLACEHOLDER-YOUR-SLACK-BOT-TOKEN-HERE
SLACK_USER_TOKEN=xoxp-PLACEHOLDER-YOUR-SLACK-USER-TOKEN-HERE
SLACK_SIGNING_SECRET=PLACEHOLDER-YOUR-SLACK-SIGNING-SECRET-HERE

# Google Sheets Configuration
GOOGLE_CLIENT_ID=PLACEHOLDER-YOUR-GOOGLE-CLIENT-ID-HERE
GOOGLE_CLIENT_SECRET=PLACEHOLDER-YOUR-GOOGLE-CLIENT-SECRET-HERE
GOOGLE_REFRESH_TOKEN=PLACEHOLDER-YOUR-GOOGLE-REFRESH-TOKEN-HERE

# Zoom Configuration
ZOOM_CLIENT_ID=PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE
ZOOM_CLIENT_SECRET=PLACEHOLDER-YOUR-ZOOM-CLIENT-SECRET-HERE
ZOOM_ACCOUNT_ID=PLACEHOLDER-YOUR-ZOOM-ACCOUNT-ID-HERE

# Chorus.ai Configuration
CHORUS_API_KEY=PLACEHOLDER-YOUR-CHORUS-API-KEY-HERE
CHORUS_API_BASE_URL=https://api.chorus.ai/v1
```

3. **Build the server:**

```bash
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

Or for development with watch mode:

```bash
npm run dev
```

### Configuring with Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "weekly-update": {
      "command": "node",
      "args": ["/path/to/weekly-update-automation/mcp-server/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-PLACEHOLDER-YOUR-SLACK-TOKEN-HERE",
        "GOOGLE_CLIENT_ID": "PLACEHOLDER-YOUR-GOOGLE-CLIENT-ID-HERE",
        "ZOOM_CLIENT_ID": "PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE",
        "CHORUS_API_KEY": "PLACEHOLDER-YOUR-CHORUS-API-KEY-HERE"
      }
    }
  }
}
```

## Available Tools

### Connection Management

#### `connect_data_source`
Connect to a data source.

**Parameters:**
- `source` (string): One of "slack", "zoom", "chorus", "sheets"

**Example:**
```json
{
  "source": "slack"
}
```

#### `disconnect_data_source`
Disconnect from a data source.

**Parameters:**
- `source` (string): One of "slack", "zoom", "chorus", "sheets"

#### `list_data_sources`
List all data sources and their connection status.

**Returns:**
```json
{
  "success": true,
  "dataSources": [
    {
      "type": "slack",
      "name": "Slack",
      "connected": true,
      "lastSync": "2024-01-15T10:30:00Z"
    }
  ],
  "connectedCount": 2,
  "totalCount": 4
}
```

### Data Retrieval

#### `get_slack_conversations`
Fetch Slack conversations.

**Parameters:**
- `limit` (number, optional): Maximum conversations to fetch (default: 20)
- `types` (string, optional): Conversation types (default: "public_channel,private_channel")

#### `get_zoom_meetings`
Fetch Zoom meetings.

**Parameters:**
- `from` (string, optional): Start date (YYYY-MM-DD)
- `to` (string, optional): End date (YYYY-MM-DD)
- `limit` (number, optional): Maximum meetings to fetch (default: 30)

#### `get_chorus_recordings`
Fetch Chorus.ai call recordings.

**Parameters:**
- `from` (string, optional): Start date (YYYY-MM-DD)
- `to` (string, optional): End date (YYYY-MM-DD)
- `limit` (number, optional): Maximum recordings to fetch (default: 20)

#### `get_google_sheets`
List accessible Google Sheets.

**Parameters:**
- `limit` (number, optional): Maximum sheets to fetch (default: 10)

#### `read_sheet_data`
Read data from a specific Google Sheet.

**Parameters:**
- `spreadsheetId` (string, required): The ID of the Google Sheet
- `range` (string, required): The A1 notation range (e.g., "Sheet1!A1:D10")

#### `sync_all_sources`
Synchronize data from all connected sources.

## Available Resources

### `datasources://status`
Get current status of all data source connections.

### `datasources://slack/conversations`
List of Slack conversations.

### `datasources://zoom/meetings`
List of Zoom meetings.

### `datasources://chorus/recordings`
List of Chorus.ai call recordings.

### `datasources://sheets/list`
List of accessible Google Sheets.

## Getting API Credentials

### Slack
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app or select existing
3. Add OAuth scopes: `channels:read`, `groups:read`, `im:read`, `mpim:read`
4. Install to workspace
5. Copy the Bot User OAuth Token

### Google Sheets
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project and enable Google Sheets API
3. Create OAuth 2.0 credentials
4. Generate a refresh token using OAuth flow

### Zoom
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Create a Server-to-Server OAuth app
3. Copy Client ID, Client Secret, and Account ID

### Chorus.ai
1. Contact your Chorus.ai administrator
2. Request API access and API key
3. Get the API base URL from documentation

## Architecture

```
mcp-server/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   └── sources/          # Data source managers
│       ├── slack.ts      # Slack integration
│       ├── zoom.ts       # Zoom integration
│       ├── chorus.ts     # Chorus.ai integration
│       └── sheets.ts     # Google Sheets integration
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Debugging

```bash
npm run inspect
```

Then attach a debugger to the Node.js process.

## Error Handling

All tools return a consistent response format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Security Notes

- Store API credentials securely in environment variables
- Never commit `.env` files to version control
- Use the principle of least privilege for API tokens
- Regularly rotate API credentials
- Monitor API usage and quotas

## Troubleshooting

### Connection Issues

If you can't connect to a service:

1. Verify credentials in `.env`
2. Check API token permissions/scopes
3. Ensure services are not rate-limited
4. Check network connectivity

### Build Issues

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: See ARCHITECTURE.md in parent directory

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Support for Slack, Zoom, Chorus.ai, and Google Sheets
- Full MCP protocol implementation
- Connection management tools
- Data retrieval capabilities

