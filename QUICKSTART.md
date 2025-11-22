# Quick Start Guide

## Prerequisites

Make sure you have Node.js 18+ installed. Check your version:

```bash
node --version
```

If you need to upgrade, visit [nodejs.org](https://nodejs.org/)

## Installation & Running

1. **Navigate to the project directory:**
   ```bash
   cd weekly-update-automation
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Using the Application

### Step 1: Connect Data Sources
- Click "Connect" for any of the four data sources (Slack, Zoom, Chorus.ai, Google Sheets)
- Currently uses mock authentication - just click to simulate connection
- You need at least one connected source to proceed

### Step 2: Select Your Data
- Browse through tabs for each connected data source
- Check the boxes next to conversations, meetings, or recordings you want to include
- Use "Select All" or "Clear All" for batch operations
- Preview content before selecting

### Step 3: Choose Your Template
- **AI Adoption Template**: Best for AI feature updates
  - Sections: Incubation Program, Usage Data, Customer Engagement
- **4-Box Template**: Comprehensive executive format
  - Sections: Updates, Customer Interactions, Lowlights, Forward Looking Priorities

### Step 4: Generate Draft
- The AI processes your selected data automatically
- Watch the progress as it analyzes your sources
- Takes approximately 10 seconds (simulated)

### Step 5: Review & Edit
- Review the generated content
- Click "Edit" on any section to make changes
- Use "Copy to Clipboard" to paste into your email or document
- Use "Download" to save as a text file

## Features to Explore

- **Multi-source selection**: Mix Slack conversations with Zoom meetings and customer calls
- **Rich previews**: See snippets of content before including them
- **Editable output**: Fine-tune the AI-generated content
- **Multiple formats**: Choose the template that fits your reporting style
- **Quick actions**: Copy, download, or start over with one click

## Current Limitations (Demo Mode)

This is a demonstration with mock data:
- ✅ Full UI/UX workflow
- ✅ Mock data for all sources
- ✅ Simulated AI generation
- ❌ No real API connections
- ❌ No actual authentication
- ❌ No real AI/LLM integration

## Next Steps for Production

To make this production-ready:

1. **Implement OAuth flows** for each data source
2. **Connect to real APIs** (Slack, Zoom, Chorus.ai, Google Sheets)
3. **Integrate with AI service** (OpenAI GPT-4, Anthropic Claude, etc.)
4. **Add user authentication** and account management
5. **Implement data persistence** (save drafts, history)
6. **Add security measures** (token encryption, HTTPS, etc.)

See `.env.example` for required API keys and configuration.

## Troubleshooting

**Port already in use:**
```bash
# Kill the process on port 5173
npx kill-port 5173
# Then restart
npm run dev
```

**Dependencies issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Run type checking
npm run check
```

## Project Structure

```
src/
├── lib/
│   ├── components/       # All Svelte components
│   │   ├── selectors/   # Data source selectors
│   │   └── *.svelte     # Main workflow components
│   ├── stores/          # State management
│   ├── types.ts         # TypeScript definitions
│   └── mockData.ts      # Demo data
├── routes/              # SvelteKit pages
└── app.css             # Global styles
```

## Support

- Check `README.md` for full documentation
- Review the PRD for product requirements
- Examine component code for implementation details

---

**Time Saved**: This tool is designed to reduce weekly update time from 3 hours to 1 hour - a 66% reduction! ⏰

