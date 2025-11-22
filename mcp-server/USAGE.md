# MCP Server Usage Guide

## Quick Start Example

### 1. Basic Connection Test

Once the server is running, you can test it using any MCP client. Here's an example interaction:

#### Connect to Slack
```json
{
  "tool": "connect_data_source",
  "arguments": {
    "source": "slack"
  }
}
```

**Response:**
```json
{
  "success": true,
  "source": "Slack",
  "message": "Connected to Slack workspace: YourWorkspace",
  "connected": true
}
```

#### List All Data Sources
```json
{
  "tool": "list_data_sources",
  "arguments": {}
}
```

**Response:**
```json
{
  "success": true,
  "dataSources": [
    {
      "type": "slack",
      "name": "Slack",
      "connected": true,
      "lastSync": "2024-01-15T10:30:00Z"
    },
    {
      "type": "zoom",
      "name": "Zoom",
      "connected": false
    },
    {
      "type": "chorus",
      "name": "Chorus.ai",
      "connected": false
    },
    {
      "type": "sheets",
      "name": "Google Sheets",
      "connected": false
    }
  ],
  "connectedCount": 1,
  "totalCount": 4
}
```

### 2. Fetching Data

#### Get Slack Conversations
```json
{
  "tool": "get_slack_conversations",
  "arguments": {
    "limit": 10,
    "types": "public_channel,private_channel"
  }
}
```

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "C123456",
      "name": "product-updates",
      "isPrivate": false,
      "memberCount": 45,
      "purpose": "Weekly product updates and discussions"
    }
  ]
}
```

#### Get Zoom Meetings
```json
{
  "tool": "get_zoom_meetings",
  "arguments": {
    "from": "2024-01-01",
    "to": "2024-01-15",
    "limit": 20
  }
}
```

#### Get Chorus Recordings
```json
{
  "tool": "get_chorus_recordings",
  "arguments": {
    "from": "2024-01-08",
    "to": "2024-01-15",
    "limit": 10
  }
}
```

#### List Google Sheets
```json
{
  "tool": "get_google_sheets",
  "arguments": {
    "limit": 5
  }
}
```

#### Read Sheet Data
```json
{
  "tool": "read_sheet_data",
  "arguments": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "range": "Sheet1!A1:D10"
  }
}
```

### 3. Sync All Sources

```json
{
  "tool": "sync_all_sources",
  "arguments": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Synced 2 data sources",
  "results": [
    {
      "source": "Slack",
      "synced": true,
      "lastSync": "2024-01-15T11:00:00Z"
    },
    {
      "source": "Google Sheets",
      "synced": true,
      "lastSync": "2024-01-15T11:00:00Z"
    }
  ]
}
```

## Using with Claude Desktop

### Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

### Example Prompt for Claude

Once configured, you can ask Claude:

> "Connect to my Slack workspace and show me the 5 most active channels from this week"

Claude will:
1. Use the `connect_data_source` tool to connect to Slack
2. Use the `get_slack_conversations` tool to fetch channels
3. Parse and present the results

> "Get all my Zoom meetings from last week and summarize the key topics"

Claude will:
1. Connect to Zoom if not already connected
2. Fetch meetings with date range
3. Analyze and summarize

## Error Handling

All tools return errors in a consistent format:

```json
{
  "success": false,
  "error": "Detailed error message"
}
```

Common errors:
- **Not Connected**: "Slack is not connected" - Call `connect_data_source` first
- **Missing Credentials**: "Slack token not configured" - Check your .env file
- **API Error**: "Failed to fetch conversations: Unauthorized" - Verify API credentials

## Resources

The server also exposes resources that can be read:

### Check Connection Status
```
datasources://status
```

Returns the current status of all data source connections.

## Advanced Usage

### Chaining Operations

1. Connect to multiple sources:
```javascript
await connect("slack")
await connect("zoom")
await connect("sheets")
```

2. Fetch all data for a weekly update:
```javascript
const conversations = await getSlackConversations({ limit: 20 })
const meetings = await getZoomMeetings({ 
  from: "2024-01-08", 
  to: "2024-01-15" 
})
const sheets = await getGoogleSheets({ limit: 5 })
```

3. Process and generate update
```javascript
const update = generateWeeklyUpdate({
  conversations,
  meetings,
  sheets
})
```

## Debugging

Run the server with debugging enabled:

```bash
npm run inspect
```

Then attach your debugger to the Node.js process.

Check logs:
```bash
tail -f mcp-server.log
```

## Best Practices

1. **Connection Management**
   - Connect to sources once at the start of your session
   - Reuse connections for multiple requests
   - Disconnect when done to free resources

2. **Rate Limiting**
   - Be mindful of API rate limits for each service
   - Use appropriate `limit` parameters
   - Implement exponential backoff for retries

3. **Data Selection**
   - Use date ranges to limit data volume
   - Filter by relevant channels/meetings only
   - Cache results when possible

4. **Security**
   - Never log or expose API credentials
   - Use environment variables for sensitive data
   - Rotate credentials regularly

## Troubleshooting

### Server Won't Start
- Check Node.js version (18+ required)
- Verify all dependencies are installed: `npm install`
- Check for port conflicts
- Review error logs

### Connection Failures
- Verify API credentials in .env
- Check network connectivity
- Confirm API token permissions
- Test credentials directly with API documentation

### Data Not Fetching
- Ensure source is connected first
- Check date ranges are valid
- Verify you have access to the requested resources
- Review API quota/rate limits

## Next Steps

- Integrate with your front-end application
- Implement caching for better performance
- Add webhooks for real-time updates
- Create custom aggregation logic
- Build automated report generation

