# Architecture Overview

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Entry Point                         │
│                    +page.svelte (Main)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Step Indicator                            │
│              Shows current progress (1-5)                    │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  ┌─────────┐      ┌─────────┐     ┌──────────┐
  │ Step 1  │      │ Step 2  │     │  Step 3  │
  │ Connect │─────▶│ Select  │────▶│ Template │
  │ Sources │      │  Data   │     │  Choice  │
  └─────────┘      └─────────┘     └──────────┘
                         │                │
                         │                ▼
                         │          ┌──────────┐
                         │          │  Step 4  │
                         └─────────▶│ Generate │
                                    │  Draft   │
                                    └──────────┘
                                         │
                                         ▼
                                   ┌──────────┐
                                   │  Step 5  │
                                   │  Review  │
                                   │   Edit   │
                                   └──────────┘
```

## Component Hierarchy

```
+page.svelte (Root)
│
├── StepIndicator.svelte
│   └── Shows workflow progress
│
├── DataSourceConnection.svelte (Step 1)
│   ├── Slack connection card
│   ├── Zoom connection card
│   ├── Chorus.ai connection card
│   └── Google Sheets connection card
│
├── DataSelection.svelte (Step 2)
│   ├── Tab navigation
│   └── Dynamic selector based on tab:
│       ├── SlackSelector.svelte
│       ├── ZoomSelector.svelte
│       ├── ChorusSelector.svelte
│       └── SheetsSelector.svelte
│
├── TemplateSelection.svelte (Step 3)
│   ├── AI Adoption template card
│   └── 4-Box template card
│
├── DraftGeneration.svelte (Step 4)
│   ├── Loading animation
│   ├── Progress bar
│   └── Stage descriptions
│
└── DraftReview.svelte (Step 5)
    ├── Section editors
    ├── Action buttons (Copy, Download)
    └── Metadata display
```

## State Management

### Global Store (appStore)

```typescript
AppState {
  currentStep: number           // 1-5, tracks workflow position
  dataSources: DataSource[]     // Connection status
  selectedSlackConversations: SlackConversation[]
  selectedZoomMeetings: ZoomMeeting[]
  selectedChorusRecordings: ChorusRecording[]
  selectedGoogleSheets: GoogleSheet[]
  selectedTemplate: TemplateType | null
  currentDraft: WeeklyUpdate | null
}
```

### Store Actions

- `setStep(step)` - Navigate between workflow steps
- `connectDataSource(type)` - Mark data source as connected
- `setSlackConversations(conversations)` - Store selected Slack data
- `setZoomMeetings(meetings)` - Store selected Zoom data
- `setChorusRecordings(recordings)` - Store selected Chorus data
- `setGoogleSheets(sheets)` - Store selected Sheets data
- `setTemplate(template)` - Store chosen template
- `setDraft(draft)` - Store generated update
- `reset()` - Clear all state and start over

## Data Models

### Core Types

```typescript
// Data source types
DataSourceType = 'slack' | 'zoom' | 'chorus' | 'sheets'

// Template types
TemplateType = 'ai-adoption' | '4-box'

// Status types
DraftStatus = 'draft' | 'review' | 'final'
```

### Main Entities

1. **SlackConversation**: Represents a Slack channel or DM
2. **ZoomMeeting**: Represents a Zoom meeting with recording
3. **ChorusRecording**: Represents a customer conversation
4. **GoogleSheet**: Represents a spreadsheet with tabs
5. **WeeklyUpdate**: The final draft with sections
6. **Template**: Defines the structure of the update

## Styling Architecture

### TailwindCSS Classes

Custom utility classes defined in `app.css`:

```css
.btn - Base button styles
.btn-primary - Primary action buttons
.btn-secondary - Secondary action buttons
.btn-ghost - Minimal style buttons
.card - Container with shadow and border
.input - Form input fields
.checkbox - Checkbox inputs
```

### Color Palette

Primary colors (blue):
- 50-100: Light backgrounds
- 500-600: Main actions
- 700-900: Hover/active states

### Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size
- Touch-friendly targets (min 44px)

## Data Flow

### Step 1 → Step 2
```
User clicks "Connect" 
→ connectDataSource() updates store
→ DataSelection shows tabs for connected sources
```

### Step 2 → Step 3
```
User selects items and clicks "Continue"
→ Selected items saved to store arrays
→ TemplateSelection displays options
```

### Step 3 → Step 4
```
User chooses template
→ setTemplate() updates store
→ DraftGeneration auto-starts
```

### Step 4 → Step 5
```
AI generates content (simulated)
→ setDraft() saves to store
→ Auto-navigates to DraftReview
```

### Step 5 → Export
```
User reviews/edits content
→ Click "Copy" or "Download"
→ Content exported for use
```

## Mock Data vs Production

### Current (Demo Mode)

```
mockData.ts
├── Static arrays of sample data
├── Realistic content and metadata
└── No API calls required
```

### Production Implementation

```
API Layer (to be built)
├── /lib/api/slack.ts
├── /lib/api/zoom.ts
├── /lib/api/chorus.ts
├── /lib/api/sheets.ts
└── /lib/api/ai.ts

Each provides:
├── authenticate() - OAuth flow
├── fetchData() - Get user's data
└── disconnect() - Revoke tokens
```

## Security Considerations

### Current (Demo)
- ✅ Client-side only
- ✅ No sensitive data
- ✅ No external requests

### Production Requirements
- 🔐 OAuth 2.0 implementation
- 🔐 Token encryption
- 🔐 Secure session management
- 🔐 HTTPS enforcement
- 🔐 API rate limiting
- 🔐 Data encryption (at rest & transit)
- 🔐 CORS configuration
- 🔐 XSS protection
- 🔐 CSRF tokens

## Performance Optimizations

### Already Implemented
- Lazy component loading
- Svelte's compiler optimizations
- Minimal bundle size
- Reactive updates only where needed

### Future Enhancements
- Virtual scrolling for long lists
- Debounced search/filter
- Image lazy loading
- Service worker for offline support
- Progressive Web App (PWA) features

## Testing Strategy (Future)

```
tests/
├── unit/
│   ├── stores/          # State management tests
│   ├── components/      # Component unit tests
│   └── utils/           # Utility function tests
├── integration/
│   ├── workflow/        # End-to-end flow tests
│   └── api/            # API integration tests
└── e2e/
    └── playwright/      # Full user journey tests
```

## Deployment

### Development
```bash
npm run dev          # Local development server
```

### Production Build
```bash
npm run build        # Creates optimized build
npm run preview      # Preview production build
```

### Hosting Options
- Vercel (recommended for SvelteKit)
- Netlify
- AWS Amplify
- Self-hosted with Node.js

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## Future Architecture Improvements

1. **Backend API**: Add Express/Fastify server for API orchestration
2. **Database**: Add PostgreSQL for user data and draft history
3. **Caching**: Implement Redis for API response caching
4. **Queue System**: Add Bull/RabbitMQ for async AI generation
5. **Monitoring**: Add Sentry for error tracking
6. **Analytics**: Add PostHog/Mixpanel for usage analytics
7. **CDN**: Use Cloudflare for static asset delivery
8. **WebSockets**: Real-time collaboration features

---

This architecture is designed to be:
- **Scalable**: Can handle growing user base
- **Maintainable**: Clean separation of concerns
- **Extensible**: Easy to add new data sources
- **Secure**: Ready for enterprise deployment
- **User-friendly**: Intuitive and responsive UI

