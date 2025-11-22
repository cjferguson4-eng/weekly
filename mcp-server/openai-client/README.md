# OpenAI Natural Language Interface for MCP Server

A conversational CLI interface powered by OpenAI's GPT-4 that lets you interact with your MCP server using natural language.

## What This Does

Instead of Claude Desktop (which requires Anthropic API access), this uses **OpenAI's GPT-4** to provide a natural language interface to your MCP server. You can chat with it just like you would with Claude.

## Setup

### 1. Install Dependencies

```bash
cd openai-client
npm install
```

### 2. Add OpenAI API Key

Add your OpenAI API key to the parent `.env` file:

```bash
cd ..  # Go back to mcp-server directory
echo "OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE" >> .env
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Build

```bash
cd openai-client
npm run build
```

### 4. Run

```bash
npm start
```

## Usage

Once running, you can chat naturally:

```
💬 You: Connect to my Slack workspace

🤔 Thinking...
🔧 Calling connect_data_source({"source":"slack"})...

🤖 Assistant: I've successfully connected to your Slack workspace!
```

### Example Conversations

**Check what's available:**
```
You: What data sources do I have?
Assistant: You have 4 data sources available:
- Slack (not connected)
- Zoom (not connected)
- Chorus.ai (not connected)
- Google Sheets (not connected)
```

**Connect and fetch data:**
```
You: Connect to Slack and show me my channels
Assistant: [Connects and lists your Slack channels]
```

**Get meeting data:**
```
You: Get my Zoom meetings from last week
Assistant: [Fetches and summarizes your meetings]
```

**Multi-step tasks:**
```
You: I need to create my weekly update. Connect to Slack and Zoom, 
     then show me conversations from #product and all meetings from this week
Assistant: [Executes multiple steps and presents results]
```

## Features

✅ **Natural Language**: Chat like you would with a colleague
✅ **Tool Integration**: Automatically calls MCP server tools
✅ **Context Aware**: Remembers conversation history
✅ **Error Handling**: Gracefully handles failures
✅ **Multi-Step**: Can execute complex workflows

## Available Commands

Ask in natural language, for example:

- "Connect to Slack"
- "Show me my data sources"
- "Get Slack conversations"
- "List my Zoom meetings from last week"
- "Connect to Google Sheets and show me available spreadsheets"
- "Read data from my metrics sheet"

## How It Works

```
You (Natural Language)
    ↓
OpenAI GPT-4 (interprets intent)
    ↓
Function Calling (selects appropriate MCP tools)
    ↓
MCP Client (executes tools)
    ↓
Data Source APIs
    ↓
Results back to GPT-4
    ↓
Natural Language Response
    ↓
You
```

## Cost

This uses OpenAI's API which has usage costs:
- GPT-4 Turbo: ~$0.01 per request (varies by length)
- Typical conversation: $0.05 - $0.20

Monitor your usage at: https://platform.openai.com/usage

## Comparison to Claude Desktop

| Feature | Claude Desktop | OpenAI CLI |
|---------|---------------|------------|
| Setup | Config file | Build & run |
| Cost | Requires Claude Pro | Pay per use |
| Interface | GUI app | Terminal CLI |
| Model | Claude 3 | GPT-4 Turbo |
| MCP Support | Native | Custom implementation |

## Troubleshooting

**"OPENAI_API_KEY not found"**
- Make sure you added the key to `mcp-server/.env`
- The key should start with `sk-`

**"Tool call failed"**
- Ensure the MCP server's data source credentials are configured
- Check that you're connected to the required data source first

**Build errors**
- Make sure parent MCP server is built: `cd .. && npm run build`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Development

Watch mode for development:
```bash
npm run dev
```

## Tips

1. **Be specific**: "Get my Slack channels" works better than "show me stuff"
2. **Connect first**: Connect to a data source before fetching data from it
3. **Use dates**: "meetings from January 1 to January 15" is clearer than "recent meetings"
4. **Ask for help**: "What can you do?" will explain available capabilities

## Exit

Type `quit` or `exit` to end the session, or press `Ctrl+C`.

## License

MIT

