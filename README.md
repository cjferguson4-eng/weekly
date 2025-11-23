# Weekly

An AI-powered web application designed to help Senior Product Managers at enterprise SaaS companies create their weekly updates efficiently. This tool reduces the time spent on weekly updates from 3 hours to just 1 hour by automating data collection and synthesis from multiple sources.

## Overview

This application provides an intelligent workflow that:
1. Connects to multiple data sources (Slack, Zoom, Chorus.ai, Google Sheets)
2. Allows users to select specific conversations and meetings to include
3. Offers pre-defined templates for formatting (AI Adoption and 4-Box formats)
4. Generates AI-powered first drafts of weekly updates
5. Provides an intuitive review and editing interface

## Features

### 🔌 Multi-Source Integration
- **Slack**: Access team conversations and channels
- **Zoom**: Process meeting recordings and transcripts
- **Chorus.ai**: Analyze customer conversation recordings
- **Google Sheets**: Pull metrics and data from spreadsheets

### 🎯 Smart Data Selection
- Visual interface to browse and select relevant conversations
- Preview content before including in updates
- Batch selection capabilities
- Detailed metadata for each data source

### 📝 Template-Based Formatting
- **AI Adoption Template**: Focused on AI feature incubation, usage data, and customer engagement
- **4-Box Template**: Comprehensive format with updates, customer interactions, lowlights, and priorities

### 🤖 AI-Powered Generation
- Automatic synthesis of selected data sources
- Context-aware content generation
- Structured output matching executive reporting standards

### ✏️ Review & Edit Interface
- Inline editing capabilities
- Copy to clipboard functionality
- Download as text file
- Real-time preview of formatted content

## Tech Stack

- **Framework**: SvelteKit 2.0
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.3
- **Icons**: Lucide Svelte
- **Build Tool**: Vite 5.0
- **MCP Server**: Model Context Protocol for agent interaction

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
cd weekly-update-automation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### MCP Server Setup (Optional - For AI Agent Integration)

The project includes an MCP (Model Context Protocol) server that enables AI agents to interact with and manage your data sources programmatically.

1. Navigate to the MCP server directory:
```bash
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.template .env
# Edit .env with your API credentials
```

4. Build and run the server:
```bash
npm run build
npm start
```

For detailed MCP server documentation, see [mcp-server/README.md](mcp-server/README.md)

### OpenAI Natural Language Interface (Alternative to Claude)

If you have OpenAI API access instead of Anthropic/Claude:

```bash
cd mcp-server/openai-client
npm install
npm run build

# Add your OpenAI API key to mcp-server/.env
echo "OPENAI_API_KEY=sk-PLACEHOLDER-YOUR-OPENAI-API-KEY-HERE" >> ../.env

# Start the chat interface
npm start
```

See [OPENAI_QUICKSTART.md](OPENAI_QUICKSTART.md) for details.

## Project Structure

```
weekly-update-automation/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── selectors/
│   │   │   │   ├── SlackSelector.svelte
│   │   │   │   ├── ZoomSelector.svelte
│   │   │   │   ├── ChorusSelector.svelte
│   │   │   │   └── SheetsSelector.svelte
│   │   │   ├── DataSelection.svelte
│   │   │   ├── DataSourceConnection.svelte
│   │   │   ├── DraftGeneration.svelte
│   │   │   ├── DraftReview.svelte
│   │   │   ├── Navigation.svelte
│   │   │   ├── StepIndicator.svelte
│   │   │   └── TemplateSelection.svelte
│   │   ├── stores/
│   │   │   └── appStore.ts
│   │   ├── mockData.ts
│   │   └── types.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.css
│   └── app.html
├── mcp-server/              # MCP Server for AI Agent Integration
│   ├── src/
│   │   ├── index.ts        # Main MCP server
│   │   └── sources/        # Data source managers
│   │       ├── slack.ts
│   │       ├── zoom.ts
│   │       ├── chorus.ts
│   │       └── sheets.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── package.json
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Application Workflow

### Step 1: Connect Data Sources
Users connect their accounts for Slack, Zoom, Chorus.ai, and Google Sheets. Currently simulated with mock authentication for demonstration purposes.

### Step 2: Select Data
Browse and select specific conversations, meetings, recordings, and data sheets to include in the weekly update. Each data source has a dedicated interface with:
- Search and filter capabilities
- Preview of content
- Metadata display (participants, dates, duration, etc.)

### Step 3: Choose Template
Select between two pre-defined templates:
- **AI Adoption Template**: For AI-focused product updates
- **4-Box Template**: For comprehensive executive reporting

### Step 4: Generate Draft
The AI agent processes selected data sources and generates a structured first draft. Progress is displayed in real-time.

### Step 5: Review & Edit
Review the generated content, make inline edits, and finalize the update. Export options include:
- Copy to clipboard
- Download as text file

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks

### Building for Production

```bash
npm run build
```

The build output will be in the `build` directory.

## Architecture & Design Decisions

### State Management
Uses Svelte stores for global state management, keeping track of:
- Current workflow step
- Connected data sources
- Selected items from each source
- Chosen template
- Generated draft

### Component Structure
Modular component architecture with:
- **Container components**: Handle business logic and state
- **Presentation components**: Pure UI components
- **Selector components**: Specialized components for each data source

### Styling Approach
Utility-first CSS with TailwindCSS:
- Custom color palette for brand consistency
- Reusable component classes (btn, card, input, etc.)
- Responsive design for various screen sizes

### Mock Data
Currently uses mock data for demonstration. In production:
- Replace mock data with actual API calls
- Implement OAuth flows for data source authentication
- Integrate with AI/LLM services for content generation
- Add MCP (Model Context Protocol) server integration

## Future Enhancements

### Authentication & Authorization
- Implement OAuth 2.0 flows for each data source
- Secure token storage and refresh mechanisms
- User account management

### Real API Integrations
- Slack API for conversations and channels
- Zoom API for meeting recordings and transcripts
- Chorus.ai API for customer conversations
- Google Sheets API for spreadsheet data

### AI/LLM Integration
- Integration with GPT-4 or Claude for content generation
- Custom prompts for each template type
- Context window optimization
- Fact-checking and hallucination prevention

### Additional Features
- Save draft history
- Schedule automatic generation
- Custom template creation
- Collaboration and sharing
- Analytics on time saved
- Mobile responsive design improvements

## Security Considerations

### Current Implementation (Mock)
- No sensitive data is stored
- No external API calls made
- All data is client-side only

### Production Requirements
- Implement proper OAuth 2.0 flows
- Secure token storage (encrypted, HTTP-only cookies)
- API key management (environment variables, secrets manager)
- HTTPS only in production
- CORS configuration
- Rate limiting
- Data encryption at rest and in transit
- Compliance with GDPR, SOC 2, etc.

## Performance

- Lazy loading of components
- Optimized bundle size with code splitting
- Efficient state updates with Svelte's reactivity
- Minimal dependencies

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

This is a demonstration project built according to the Product Requirements Document. For production use, implement:
1. Real authentication flows
2. Actual API integrations
3. AI/LLM service integration
4. Security hardening
5. Testing suite
6. CI/CD pipeline

## License

MIT License - feel free to use this as a starting point for your own implementation.


