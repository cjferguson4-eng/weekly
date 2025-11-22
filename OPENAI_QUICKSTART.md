# Quick Start: OpenAI Natural Language Interface

## For Users with OpenAI API Access (No Anthropic/Claude Required)

If you have an **OpenAI API key** instead of Anthropic/Claude access, you can use this natural language chat interface powered by GPT-4!

## Setup (3 Steps)

### 1. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### 2. Add API Key to Environment

```bash
cd /Users/cferguson/weekly-update-automation/mcp-server

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp env.template .env
fi

# Add your OpenAI API key
echo "OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE" >> .env
```

### 3. Start Chatting!

```bash
cd openai-client
npm start
```

## Usage

You'll see a chat interface:

```
╔═══════════════════════════════════════════════════════════╗
║       Weekly Update Assistant (Powered by OpenAI)        ║
╚═══════════════════════════════════════════════════════════╝

Connected to MCP Server ✓

Type your questions or commands in natural language.

💬 You: _
```

## Example Conversations

### 1. Check Available Data Sources

```
💬 You: What data sources do I have?

🤔 Thinking...

🤖 Assistant: You have 4 data sources available:

1. Slack (not connected)
2. Zoom (not connected)  
3. Chorus.ai (not connected)
4. Google Sheets (not connected)

Would you like me to connect to any of these?
```

### 2. Connect to Slack

```
💬 You: Yes, connect to Slack

🤔 Thinking...
🔧 Calling connect_data_source({"source":"slack"})...

🤖 Assistant: Great! I've successfully connected to your Slack workspace.
You can now ask me to fetch conversations, channels, or message history.
```

### 3. Fetch Data

```
💬 You: Show me my Slack channels

🤔 Thinking...
🔧 Calling get_slack_conversations({"limit":20})...

🤖 Assistant: Here are your Slack channels:

📢 Public Channels:
• #general (45 members) - Company-wide announcements
• #product-updates (32 members) - Product team updates
• #engineering (28 members) - Engineering discussions

🔒 Private Channels:
• #leadership (8 members) - Leadership discussions
• #customer-feedback (15 members) - Customer insights

Would you like to see messages from any specific channel?
```

### 4. Complex Requests

```
💬 You: Get all my Zoom meetings from last week and summarize them

🤔 Thinking...
🔧 Calling connect_data_source({"source":"zoom"})...
🔧 Calling get_zoom_meetings({"from":"2024-01-08","to":"2024-01-15"})...

🤖 Assistant: Here's a summary of your 7 Zoom meetings from last week:

Monday:
• Product Planning (1hr) - 12 participants
• Customer Demo (30min) - 5 participants

Tuesday:
• Engineering Standup (15min) - 8 participants
• Design Review (1hr) - 6 participants

[...continues...]

Key themes: Product roadmap, customer feedback, sprint planning
```

## What You Can Ask

### Connection Management
- "Connect to Slack"
- "Connect to all my data sources"
- "What's connected right now?"
- "Show me my data sources"

### Slack
- "Get my Slack channels"
- "Show me channels with 'product' in the name"
- "Get conversations from the past week"

### Zoom
- "List my Zoom meetings"
- "Get meetings from January 1 to January 15"
- "Show me my meetings from last week"

### Google Sheets
- "Connect to Google Sheets"
- "List my spreadsheets"
- "Read data from my metrics sheet"

### Chorus.ai
- "Get my Chorus call recordings"
- "Show recordings from last week"

### Multi-Step Tasks
- "Connect to Slack and Zoom, then show me all activity from this week"
- "Help me prepare my weekly update by getting data from all sources"

## Tips for Better Results

1. **Be specific with dates**: "January 1 to 15" is better than "recently"
2. **Connect first**: The assistant will remind you if you need to connect
3. **Ask for help**: "What can you do?" explains capabilities
4. **Use natural language**: Chat like you're talking to a colleague

## Commands

- Type your question naturally
- Type `quit` or `exit` to end
- Press `Ctrl+C` to force quit

## Costs

OpenAI charges per API use:
- **GPT-4 Turbo**: ~$0.01-0.03 per exchange
- **Typical conversation**: $0.10-0.30

Monitor usage at: https://platform.openai.com/usage

## Troubleshooting

### "OPENAI_API_KEY not found"

Your API key isn't set. Add it to `.env`:

```bash
cd /Users/cferguson/weekly-update-automation/mcp-server
echo "OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE" >> .env
```

### "Slack is not connected"

Connect first:
```
You: Connect to Slack
```

### Data source connection fails

Check that you've added the data source credentials to `.env`:
```bash
# For Slack
SLACK_BOT_TOKEN=xoxb-PLACEHOLDER-YOUR-SLACK-TOKEN-HERE

# For Zoom
ZOOM_CLIENT_ID=PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE
ZOOM_CLIENT_SECRET=PLACEHOLDER-YOUR-ZOOM-CLIENT-SECRET-HERE
ZOOM_ACCOUNT_ID=PLACEHOLDER-YOUR-ZOOM-ACCOUNT-ID-HERE

# etc.
```

See main README for how to get these credentials.

### Build errors

Make sure the parent MCP server is built:
```bash
cd /Users/cferguson/weekly-update-automation/mcp-server
npm run build
```

## How It Works

```
You type: "Connect to Slack and show me channels"
    ↓
OpenAI GPT-4 interprets your intent
    ↓
Calls MCP tools: connect_data_source → get_slack_conversations
    ↓
Your data sources (Slack API)
    ↓
Results formatted by GPT-4
    ↓
Natural language response back to you
```

## Comparison: OpenAI vs Claude Desktop

| Feature | This (OpenAI) | Claude Desktop |
|---------|--------------|----------------|
| **Access** | OpenAI API key | Anthropic API / Claude Pro |
| **Interface** | Terminal CLI | Desktop App |
| **Cost** | Pay per use (~$0.01-0.03/msg) | Subscription or API |
| **Model** | GPT-4 Turbo | Claude 3 Sonnet/Opus |
| **Setup** | 3 commands | Config file |
| **Portability** | Works anywhere | macOS/Windows app |

## Next Steps

1. ✅ You have the OpenAI interface working
2. 📝 Add your data source credentials to enable connections
3. 💬 Start chatting to manage your weekly updates!

## Support

- **Full MCP Docs**: [mcp-server/README.md](mcp-server/README.md)
- **OpenAI Client Docs**: [mcp-server/openai-client/README.md](mcp-server/openai-client/README.md)
- **Integration Guide**: [MCP_INTEGRATION.md](MCP_INTEGRATION.md)

---

**Built with ❤️ for users who prefer OpenAI over Anthropic**

