# MCP Server Integration Guide

## Overview

The Weekly project now includes a fully functional **MCP (Model Context Protocol) server** that enables AI agents to programmatically interact with and manage your connected data sources.

## What is MCP?

Model Context Protocol (MCP) is an open protocol developed by Anthropic that standardizes how AI assistants connect to external data sources and tools. It allows AI agents like Claude to:

- Access data from multiple services
- Execute actions on your behalf
- Maintain context across interactions
- Operate autonomously with proper permissions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Agent (Claude)                        │
│                  via MCP Protocol                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Weekly Update MCP Server                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Connection │  │     Data     │  │      Sync       │  │
│  │  Management  │  │  Retrieval   │  │   Management    │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└───────┬──────────┬──────────┬──────────┬──────────────────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
    │ Slack  │ │  Zoom  │ │Chorus │ │  Google  │
    │  API   │ │  API   │ │  API  │ │ Sheets   │
    └────────┘ └────────┘ └────────┘ └──────────┘
```

## Features Implemented

### ✅ Connection Management
- **connect_data_source**: Authenticate and connect to services
- **disconnect_data_source**: Gracefully disconnect from services
- **list_data_sources**: View all sources and their connection status

### ✅ Data Source Integrations

#### Slack Integration
- Fetch conversations/channels with filters
- Retrieve message history from specific channels
- Support for public and private channels
- OAuth token authentication

#### Zoom Integration
- List scheduled and past meetings
- Filter by date range
- Retrieve participant counts
- Server-to-Server OAuth authentication

#### Chorus.ai Integration
- Access call recordings and transcripts
- Filter by date range
- Retrieve call insights and participants
- API key authentication

#### Google Sheets Integration
- List accessible spreadsheets
- Read data from specific ranges
- Retrieve sheet metadata
- OAuth 2.0 with refresh tokens

### ✅ Batch Operations
- **sync_all_sources**: Synchronize data from all connected sources
- Efficient parallel processing
- Error handling for individual failures

### ✅ Resource Access
- `datasources://status` - Connection status for all sources
- `datasources://slack/conversations` - Slack conversations list
- `datasources://zoom/meetings` - Zoom meetings list
- `datasources://chorus/recordings` - Chorus recordings list
- `datasources://sheets/list` - Google Sheets list

## Quick Setup

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Configure Credentials

Create a `.env` file from the template:

```bash
cp env.template .env
```

Edit `.env` with your API credentials:

```bash
# Slack - Get from https://api.slack.com/apps
SLACK_BOT_TOKEN=xoxb-PLACEHOLDER-YOUR-SLACK-BOT-TOKEN-HERE

# Google Sheets - From Google Cloud Console
GOOGLE_CLIENT_ID=PLACEHOLDER-YOUR-GOOGLE-CLIENT-ID-HERE
GOOGLE_CLIENT_SECRET=PLACEHOLDER-YOUR-GOOGLE-CLIENT-SECRET-HERE
GOOGLE_REFRESH_TOKEN=PLACEHOLDER-YOUR-GOOGLE-REFRESH-TOKEN-HERE

# Zoom - From https://marketplace.zoom.us
ZOOM_CLIENT_ID=PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE
ZOOM_CLIENT_SECRET=PLACEHOLDER-YOUR-ZOOM-CLIENT-SECRET-HERE
ZOOM_ACCOUNT_ID=PLACEHOLDER-YOUR-ZOOM-ACCOUNT-ID-HERE

# Chorus.ai - Contact your admin
CHORUS_API_KEY=PLACEHOLDER-YOUR-CHORUS-API-KEY-HERE
```

### 3. Build and Run

```bash
npm run build
npm start
```

## Integration with Claude Desktop

### Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "weekly-update": {
      "command": "node",
      "args": ["/absolute/path/to/weekly-update-automation/mcp-server/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-PLACEHOLDER-YOUR-SLACK-TOKEN-HERE",
        "GOOGLE_CLIENT_ID": "PLACEHOLDER-YOUR-GOOGLE-CLIENT-ID-HERE",
        "GOOGLE_CLIENT_SECRET": "PLACEHOLDER-YOUR-GOOGLE-CLIENT-SECRET-HERE",
        "GOOGLE_REFRESH_TOKEN": "PLACEHOLDER-YOUR-GOOGLE-REFRESH-TOKEN-HERE",
        "ZOOM_CLIENT_ID": "PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE",
        "ZOOM_CLIENT_SECRET": "PLACEHOLDER-YOUR-ZOOM-CLIENT-SECRET-HERE",
        "ZOOM_ACCOUNT_ID": "PLACEHOLDER-YOUR-ZOOM-ACCOUNT-ID-HERE",
        "CHORUS_API_KEY": "PLACEHOLDER-YOUR-CHORUS-API-KEY-HERE"
      }
    }
  }
}
```

### Usage Examples

Once configured, you can interact with Claude naturally:

**Example 1: Connect and Explore**
```
You: "Connect to my Slack workspace and show me all channels"

Claude will:
1. Call connect_data_source(source: "slack")
2. Call get_slack_conversations(limit: 100)
3. Present a formatted list of channels
```

**Example 2: Generate Weekly Update**
```
You: "Get all my meetings from last week and create a summary"

Claude will:
1. Connect to Zoom if not already connected
2. Calculate last week's date range
3. Fetch meetings using get_zoom_meetings()
4. Analyze and summarize the meetings
```

**Example 3: Multi-Source Data**
```
You: "Prepare my weekly update using data from Slack, Zoom, and Sheets"

Claude will:
1. Connect to all three sources
2. Fetch relevant conversations, meetings, and metrics
3. Synthesize information across sources
4. Generate a structured weekly update
```

## Available Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `connect_data_source` | Authenticate to a service | source: slack/zoom/chorus/sheets |
| `disconnect_data_source` | Close connection | source: slack/zoom/chorus/sheets |
| `list_data_sources` | View all connection statuses | - |
| `get_slack_conversations` | Fetch Slack channels | limit, types |
| `get_zoom_meetings` | Retrieve Zoom meetings | from, to, limit |
| `get_chorus_recordings` | Get Chorus call recordings | from, to, limit |
| `get_google_sheets` | List available spreadsheets | limit |
| `read_sheet_data` | Read specific sheet data | spreadsheetId, range |
| `sync_all_sources` | Sync all connected sources | - |

## API Credentials Setup

### Slack
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create app or select existing
3. Required scopes:
   - `channels:read`
   - `groups:read`
   - `im:read`
   - `mpim:read`
   - `channels:history`
4. Install to workspace
5. Copy Bot User OAuth Token → `SLACK_BOT_TOKEN`

### Google Sheets
1. Visit [console.cloud.google.com](https://console.cloud.google.com)
2. Create project
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost`
6. Run OAuth flow to get refresh token
7. Save: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`

### Zoom
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Develop → Build App
3. Create Server-to-Server OAuth app
4. Add scopes:
   - `meeting:read:admin`
   - `user:read:admin`
5. Activate app
6. Copy credentials → `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_ACCOUNT_ID`

### Chorus.ai
1. Contact your Chorus.ai administrator
2. Request API access
3. Obtain API key
4. Get base URL (usually `https://api.chorus.ai/v1`)
5. Save: `CHORUS_API_KEY`, `CHORUS_API_BASE_URL`

## Security Best Practices

### Credential Management
- ✅ Store credentials in `.env` file (never commit to git)
- ✅ Use environment variables in production
- ✅ Rotate credentials regularly
- ✅ Use minimal required scopes/permissions

### Network Security
- ✅ Run MCP server on localhost only
- ✅ Use HTTPS for all API calls
- ✅ Validate all inputs
- ✅ Implement rate limiting

### Access Control
- ✅ Review OAuth scopes carefully
- ✅ Audit API access logs
- ✅ Revoke unused tokens
- ✅ Monitor for suspicious activity

## Troubleshooting

### Common Issues

**Server won't start**
```bash
# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Connection failures**
```bash
# Verify credentials
cat .env | grep TOKEN

# Test API directly
curl -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  https://slack.com/api/auth.test
```

**Build errors**
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Debug Mode

Run with debugging:
```bash
npm run inspect
```

Attach debugger at `chrome://inspect`

## Development

### Project Structure
```
mcp-server/
├── src/
│   ├── index.ts          # Main MCP server
│   └── sources/          # Data source managers
│       ├── slack.ts      # Slack integration
│       ├── zoom.ts       # Zoom integration
│       ├── chorus.ts     # Chorus integration
│       └── sheets.ts     # Sheets integration
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
├── README.md             # Full documentation
├── USAGE.md              # Usage examples
└── env.template          # Environment template
```

### Adding New Tools

1. Define tool in `ListToolsRequestSchema` handler
2. Implement handler function
3. Add to `CallToolRequestSchema` switch statement
4. Update documentation

### Testing

```bash
# Install test dependencies
npm install --save-dev @types/jest jest ts-jest

# Run tests
npm test
```

## Performance Considerations

### Rate Limits
- Slack: 1-20 requests/minute (tier dependent)
- Zoom: 80 requests/second
- Google Sheets: 100 requests/100 seconds/user
- Chorus.ai: Contact provider for limits

### Optimization Tips
- Batch requests when possible
- Cache frequently accessed data
- Use webhooks for real-time updates
- Implement exponential backoff

## Future Enhancements

### Planned Features
- [ ] Webhook support for real-time data
- [ ] Data caching layer
- [ ] Advanced filtering and search
- [ ] Custom aggregations
- [ ] Report templates
- [ ] Scheduled data sync
- [ ] Multi-user support
- [ ] Audit logging

### Integration Possibilities
- Connect to Jira for project tracking
- Integrate with GitHub for code metrics
- Add Salesforce for CRM data
- Include Linear for issue tracking
- Connect to analytics platforms

## Resources

- **MCP Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Anthropic MCP GitHub**: [github.com/anthropics/anthropic-mcp](https://github.com/anthropics/anthropic-mcp)
- **Full Server Docs**: [mcp-server/README.md](mcp-server/README.md)
- **Usage Examples**: [mcp-server/USAGE.md](mcp-server/USAGE.md)

## Support

For issues or questions:
- Review troubleshooting section
- Check API documentation for each service
- Verify credentials and permissions
- Review server logs for errors

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ to enable AI agents to automate weekly updates**

Last Updated: January 2024

