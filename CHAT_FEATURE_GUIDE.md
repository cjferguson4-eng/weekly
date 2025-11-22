# 🤖 AI Chat Assistant - User Guide

Weekly now has a **built-in AI chat assistant** powered by GPT-4!

## ✨ What's New

A floating AI assistant button in the bottom-right corner of your web application that lets you control everything with natural language.

## 🚀 How to Use

### 1. Open Your Application

Navigate to: **http://localhost:5173**

### 2. Click the AI Assistant Button

Look for the floating **🤖** button in the bottom-right corner with a green pulse indicator.

### 3. Start Chatting!

The chat window will open with a welcome message:

```
👋 Hi! I'm your Weekly Update Assistant. I can help you 
connect to data sources, navigate the workflow, and manage 
your weekly updates. What would you like to do?
```

## 💬 What You Can Ask

### Navigation
- "Go to step 2"
- "Take me to the template selection"
- "Navigate to data selection"
- "Show me the review step"

### Data Sources
- "What data sources are available?"
- "Show me my connection status"
- "Connect to Slack"
- "Connect to all my data sources"

### General Help
- "What can you help me with?"
- "How does this work?"
- "What are the steps?"
- "Help me create my weekly update"

### Multi-Step Tasks
- "Connect me to Slack and navigate to data selection"
- "Help me get started with my weekly update"
- "Set up everything I need for my update"

## 🎯 Example Conversation

```
You: What can you do?

AI: I can help you with several things:
1. Navigate through the 5-step workflow
2. Connect to data sources (Slack, Zoom, Chorus.ai, Google Sheets)
3. Guide you through creating your weekly update
4. Answer questions about the process

What would you like to start with?

---

You: Connect to Slack

AI: ✓ Connected to Slack successfully! 
Now you can move to step 2 to select which conversations 
you'd like to include in your weekly update. 
Would you like me to take you there?

---

You: Yes, go to step 2

AI: ✓ Navigated to step 2 - Data Selection
Here you can select specific Slack conversations, Zoom 
meetings, and other data to include in your weekly update.
```

## 🎨 Features

### Smart Interface
- **Floating Button**: Always accessible in bottom-right corner
- **Slide-in Chat**: Beautiful animated chat window
- **Message History**: Keeps track of your conversation
- **Tool Indicators**: Shows when AI is performing actions (🔧)
- **Typing Indicator**: Animated dots while AI is thinking
- **Auto-scroll**: Automatically scrolls to latest message

### Actions the AI Can Perform
1. **Navigate Steps**: Jump to any workflow step (1-5)
2. **Connect Sources**: Connect to Slack, Zoom, Chorus, Sheets
3. **Show Status**: Display current connection status
4. **Answer Questions**: Explain features and process

### Chat Controls
- **Send**: Click send button or press Enter
- **New Line**: Press Shift+Enter
- **Clear Chat**: Click trash icon in header
- **Close**: Click X or click outside chat window

## 🎭 UI Elements

### Floating Button
- **🤖 Icon**: AI assistant avatar
- **Green Pulse**: Indicates ready status
- **Hover Tooltip**: "Ask AI Assistant"
- **Position**: Fixed bottom-right corner

### Chat Window
- **Header**: Gradient blue-indigo with AI info
- **Messages**: User (blue) vs Assistant (gray)
- **Tool Calls**: Shows actions performed with 🔧 icon
- **Input**: Text field with send button

## 💡 Tips for Best Results

1. **Be Conversational**: Talk naturally like chatting with a colleague
2. **Be Specific**: "Go to step 2" is clearer than "next"
3. **Ask Follow-ups**: The AI remembers context
4. **Use Tools**: Let AI navigate and connect for you
5. **Clear When Stuck**: Use trash icon to start fresh conversation

## 🔄 How It Works Behind the Scenes

```
You type message
    ↓
Sent to OpenAI GPT-4
    ↓
AI interprets intent
    ↓
Calls appropriate tools (navigate, connect, etc.)
    ↓
Updates your application state
    ↓
Returns natural language response
```

## 🎯 Real-World Workflows

### Workflow 1: Quick Start
```
You: Help me get started
AI: [Explains workflow and asks what to do first]
You: Connect to Slack
AI: [Connects and suggests next step]
You: Go to data selection
AI: [Navigates to step 2]
```

### Workflow 2: Status Check
```
You: What's my current status?
AI: [Shows connection status and current step]
You: Connect the disconnected sources
AI: [Connects remaining sources]
```

### Workflow 3: Guided Tour
```
You: What are all the steps?
AI: [Explains 5-step workflow]
You: Take me through step by step
AI: [Guides through each step]
```

## 🚨 Important Notes

### Current Capabilities (Phase 1)
✅ Navigate between workflow steps
✅ Connect to data sources
✅ Show connection status
✅ Answer questions about the workflow
✅ Remember conversation context

### Coming Soon (Future Phases)
🔜 Fetch actual data from connected sources
🔜 Generate draft updates via chat
🔜 Edit content through conversation
🔜 Export updates directly from chat
🔜 Schedule and automate updates

### Limitations
- Currently uses mock data for demonstrations
- Real API integrations require credentials in `.env`
- Some advanced features are in development

## 🔐 Security & Privacy

- Your OpenAI API key is stored securely in `.env`
- Conversations are not stored permanently
- Chat history clears when you close the window
- No data is sent outside your local environment and OpenAI

## 💰 Cost

Using the chat assistant consumes OpenAI API credits:
- **~$0.01-0.03 per message** (GPT-4 Turbo)
- **~$0.10-0.30 per conversation** (typical session)

Monitor usage at: https://platform.openai.com/usage

## 🎨 Customization

### Change Chat Position
Edit `ChatAssistant.svelte`:
```svelte
<!-- Change from right-4 bottom-4 to left-4 top-4 for top-left -->
class="fixed right-4 bottom-4..."
```

### Adjust Chat Size
Edit dimensions:
```svelte
class="... w-96 h-[600px] ..."
```

### Modify Colors
Change gradient colors:
```svelte
class="bg-gradient-to-r from-blue-500 to-indigo-600..."
```

## 📊 Comparison: Web Chat vs Terminal Chat

| Feature | Web Chat (This!) | Terminal Chat |
|---------|-----------------|---------------|
| Interface | Floating window in browser | Command line |
| Access | Click button | Run npm command |
| Integration | Built into app | Separate tool |
| Actions | Can navigate & update app | Standalone interactions |
| Persistence | Session-based | Command session |
| Visual | Beautiful UI | Text only |

## 🐛 Troubleshooting

### Chat button not visible
- Refresh the page (Cmd+R or Ctrl+R)
- Check dev server is running on port 5173
- Look in bottom-right corner

### "OpenAI API key not configured" error
- Ensure `.env` file exists in project root
- Check `OPENAI_API_KEY` is set correctly
- Restart dev server after adding key

### Chat not responding
- Check browser console for errors (F12)
- Verify OpenAI API key is valid
- Check internet connection

### Messages not sending
- Make sure input isn't empty
- Check for JavaScript errors in console
- Try refreshing the page

## 🎉 Quick Start Checklist

- ✅ Dev server running (`npm run dev`)
- ✅ Navigate to http://localhost:5173
- ✅ OpenAI API key configured in `.env`
- ✅ Click 🤖 button in bottom-right
- ✅ Start chatting!

## 📚 Related Documentation

- **Main README**: [README.md](README.md)
- **OpenAI Terminal Client**: [OPENAI_QUICKSTART.md](OPENAI_QUICKSTART.md)
- **All Changes**: [CHANGES.md](CHANGES.md)
- **Natural Language Options**: [NATURAL_LANGUAGE_INTERFACE.md](NATURAL_LANGUAGE_INTERFACE.md)

## 💬 Example Prompts to Try

Copy and paste these into the chat:

1. "What data sources can I connect to?"
2. "Help me navigate to the template selection"
3. "Connect to Slack and show me the status"
4. "What step am I on right now?"
5. "Take me through the workflow step by step"
6. "Connect all my data sources"
7. "Go to the final review step"
8. "What can you help me with?"

---

## 🎊 Congratulations!

You now have a **fully integrated AI assistant** in your web application! 

Just click that floating 🤖 button and start chatting. The AI will help you navigate, connect sources, and create your weekly updates - all through natural conversation.

**Enjoy your new AI-powered workflow! 🚀**

---

*Last Updated: January 2025*
*Powered by OpenAI GPT-4 Turbo*

