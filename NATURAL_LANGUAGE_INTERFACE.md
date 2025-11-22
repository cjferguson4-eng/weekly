# Natural Language Interface Options

Weekly now has **TWO** natural language interface options!

## Option 1: Claude Desktop (Native MCP Support) 🟣

**Best for**: Users with Anthropic API access or Claude Pro subscription

### Setup
1. Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "weekly-update": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-PLACEHOLDER-YOUR-SLACK-TOKEN-HERE",
        "ZOOM_CLIENT_ID": "PLACEHOLDER-YOUR-ZOOM-CLIENT-ID-HERE",
        ...
      }
    }
  }
}
```

2. Restart Claude Desktop

### Usage
Just chat normally in Claude:
```
You: "Connect to my Slack workspace and show me recent conversations"
Claude: [Connects and presents results]
```

### Pros
- ✅ Native MCP integration
- ✅ Beautiful GUI interface
- ✅ Multi-modal (can handle images, files, etc.)
- ✅ No terminal needed

### Cons
- ❌ Requires Anthropic API access or Claude Pro
- ❌ Desktop app only (no remote servers)

---

## Option 2: OpenAI CLI Interface (Custom Integration) 🟢

**Best for**: Users with OpenAI API access

### Setup
```bash
# Navigate to OpenAI client
cd /Users/cferguson/weekly-update-automation/mcp-server/openai-client

# Install dependencies
npm install
npm run build

# Add your OpenAI API key to parent .env
echo "OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE" >> ../.env

# Start the interface
npm start
```

### Usage
Interactive terminal chat:
```
💬 You: Connect to Slack and show me my channels

🤔 Thinking...
🔧 Calling connect_data_source({"source":"slack"})...
🔧 Calling get_slack_conversations({"limit":20})...

🤖 Assistant: I've connected to Slack! Here are your channels:
[Lists channels with details]
```

### Pros
- ✅ Uses OpenAI (GPT-4)
- ✅ Pay-as-you-go pricing (~$0.01-0.03/message)
- ✅ Works on any system with Node.js
- ✅ Can be run on remote servers
- ✅ Terminal-based (scriptable)

### Cons
- ❌ Terminal only (no GUI)
- ❌ Text-only interface
- ❌ Requires running command

---

## Feature Comparison

| Feature | Claude Desktop | OpenAI CLI |
|---------|---------------|------------|
| **Model** | Claude 3 (Sonnet/Opus) | GPT-4 Turbo |
| **Interface** | Desktop GUI App | Terminal CLI |
| **Access Required** | Anthropic API / Claude Pro | OpenAI API Key |
| **Cost Model** | Subscription or API | Pay per use |
| **Setup Complexity** | Config file | 3 commands |
| **Platform** | macOS/Windows app | Cross-platform CLI |
| **MCP Support** | Native | Custom implementation |
| **Multi-modal** | Yes (images, files) | No (text only) |
| **Automation** | Limited | Fully scriptable |
| **Remote Use** | No | Yes |

---

## Which Should You Choose?

### Choose **Claude Desktop** if you:
- ✅ Have Anthropic API access or Claude Pro
- ✅ Prefer a GUI interface
- ✅ Want native MCP support
- ✅ Work on desktop only
- ✅ Need multi-modal capabilities

### Choose **OpenAI CLI** if you:
- ✅ Have OpenAI API access
- ✅ Comfortable with terminal
- ✅ Want pay-as-you-go pricing
- ✅ Need to run on servers
- ✅ Want to automate/script interactions

### Use BOTH if you:
- ✅ Have access to both APIs
- ✅ Want flexibility
- ✅ Use desktop for interactive work
- ✅ Use CLI for automation

---

## Example Use Cases

### Claude Desktop
```
"Connect to all my data sources and create a draft weekly update 
based on this week's Slack conversations, Zoom meetings, and the 
metrics from my Google Sheet"

Claude handles this naturally with its GUI, showing progress
and presenting a beautifully formatted update.
```

### OpenAI CLI
```bash
# Interactive session
npm start

You: Connect to Slack
You: Get conversations from #product-updates
You: Now connect to Zoom
You: Get meetings from last week
You: Summarize everything for my weekly update
```

Or script it:
```bash
echo "Connect to Slack, get #product channels, summarize" | npm start
```

---

## Available Commands (Both Interfaces)

Both interfaces support the same MCP tools:

### Connection Management
- "Connect to [slack/zoom/chorus/sheets]"
- "Disconnect from [source]"
- "List my data sources"
- "What's connected?"

### Data Retrieval
- "Get Slack conversations"
- "Show me Zoom meetings from [date range]"
- "List my Google Sheets"
- "Read data from sheet [name]"
- "Get Chorus recordings from this week"

### Multi-Step Tasks
- "Connect to all sources and sync"
- "Prepare my weekly update with data from Slack and Zoom"
- "Show me all activity from last week across all sources"

---

## Cost Comparison

### Claude Desktop
- **Claude Pro**: $20/month (unlimited messages)
- **Claude API**: ~$0.01-0.05 per message (varies by model)

### OpenAI CLI
- **GPT-4 Turbo**: $0.01 per 1K input tokens, $0.03 per 1K output tokens
- **Typical message**: ~$0.01-0.03
- **Conversation (10 messages)**: ~$0.10-0.30

**Example**: Creating weekly update (connect + fetch + generate)
- Claude API: ~$0.10-0.20
- OpenAI API: ~$0.15-0.30
- Claude Pro: $0 (included in subscription)

---

## Getting Started

### Quick Start: Claude Desktop
1. See [MCP_INTEGRATION.md](MCP_INTEGRATION.md)
2. Add config to Claude Desktop
3. Restart Claude
4. Start chatting!

### Quick Start: OpenAI CLI
1. See [OPENAI_QUICKSTART.md](OPENAI_QUICKSTART.md)
2. Add OpenAI API key to `.env`
3. Run `npm start` in openai-client directory
4. Start chatting!

---

## Documentation

- **Claude Setup**: [MCP_INTEGRATION.md](MCP_INTEGRATION.md)
- **OpenAI Setup**: [OPENAI_QUICKSTART.md](OPENAI_QUICKSTART.md)
- **MCP Server Docs**: [mcp-server/README.md](mcp-server/README.md)
- **OpenAI Client Docs**: [mcp-server/openai-client/README.md](mcp-server/openai-client/README.md)
- **All Changes**: [CHANGES.md](CHANGES.md)

---

## The Bottom Line

🎉 **You now have TWO powerful natural language interfaces!**

- **Have Anthropic access?** Use Claude Desktop
- **Have OpenAI access?** Use the OpenAI CLI
- **Have both?** Use whichever fits your workflow

Both interfaces provide the exact same capabilities - connect to your data sources and manage your weekly updates using natural language. The only difference is the AI model and interface style.

**Pick the one that works for you and start automating your weekly updates! 🚀**

---

Built with ❤️ to support both major AI platforms

