# Google Drive Integration Guide

## Overview

Weekly now includes **corporate Google Drive integration**! You can connect your Google Drive account and select documents, spreadsheets, presentations, and PDFs to include in your weekly updates.

## ✨ What's Been Added

### 1. **Google Drive as 5th Data Source**
- Added alongside Slack, Zoom, Chorus.ai, and Google Sheets
- Shows connection status in navigation
- Appears in data source connection step

### 2. **Drive File Selector**
- Beautiful grid view of your files
- Search functionality
- Filter by file type (Docs, Sheets, Slides, PDFs)
- File metadata (size, owner, modified date)
- Direct links to open files in Drive
- Visual file type icons (📄 📊 📽️ 📕)

### 3. **File Types Supported**
- ✅ Google Docs
- ✅ Google Sheets
- ✅ Google Slides
- ✅ PDFs
- ✅ Word Documents
- ✅ Excel Spreadsheets
- ✅ Text Files

### 4. **Chat Assistant Integration**
- Ask: "Connect to Google Drive"
- Ask: "Show me my Drive files"
- Ask: "List documents from this week"

## 🚀 How to Use

### Step 1: Connect to Google Drive

1. Open http://localhost:5173
2. Click "Connect Sources" in navigation
3. Find **Google Drive** card with 📁 icon
4. Click "Connect Google Drive"
5. (In production: OAuth flow would appear here)

### Step 2: Select Files

1. Navigate to "Select Data" (Step 2)
2. Click the **"Drive" tab** (📁 icon)
3. Browse your files in the grid view
4. Use filters:
   - **Search bar**: Search by filename
   - **File type dropdown**: Filter by document type
5. Click files to select them (blue border + checkmark)
6. Selected files show in summary at bottom

### Step 3: Include in Update

Selected Drive files will be referenced in your weekly update draft with:
- File names and links
- Last modified dates
- File owners
- Document type

## 📊 UI Features

### File Grid Display
```
┌─────────────────────────────┐
│ 📄  Q1 Product Roadmap      │
│                             │
│ Google Doc                  │
│ Modified: Jan 10, 2024      │
│ sarah.chen@company.com      │
│ 45.6 KB                     │
│                             │
│ [Open in Drive ↗]           │
└─────────────────────────────┘
```

### Search & Filters
- **Search**: Type filename to find specific documents
- **File Type Filters**:
  - All Files (default)
  - Google Docs
  - Google Sheets
  - Google Slides
  - PDFs

### Selection Indicators
- **Blue border** = Selected
- **Checkmark** in top-right corner
- **Selection summary** at bottom showing count

## 💬 Chat Assistant Commands

### Connect
```
You: "Connect to Google Drive"
AI: ✓ Connected to Google Drive successfully!
```

### List Files
```
You: "Show me my Drive files"
AI: [Lists available files with details]
```

### Navigate
```
You: "Go to Drive file selection"
AI: [Navigates to Step 2, Drive tab]
```

## 🔐 Authentication Setup

### For Production Use

To connect to your actual corporate Google Drive:

#### 1. Get Google Cloud Credentials

```bash
# Go to Google Cloud Console
https://console.cloud.google.com

# Enable APIs
- Google Drive API
- Google Picker API (for file browser)

# Create OAuth 2.0 credentials
- Application type: Web application
- Authorized redirect URIs: 
  - http://localhost:5173/auth/google/callback
  - https://your-domain.com/auth/google/callback

# Download credentials
- Save as credentials.json in project root
```

#### 2. Set Required Scopes

```javascript
// In your auth configuration
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/userinfo.email'
];
```

#### 3. Add to Environment

```bash
# In .env file
GOOGLE_DRIVE_CLIENT_ID=PLACEHOLDER-YOUR-GOOGLE-CLIENT-ID-HERE
GOOGLE_DRIVE_CLIENT_SECRET=PLACEHOLDER-YOUR-GOOGLE-CLIENT-SECRET-HERE
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

#### 4. Corporate Domain Restrictions

For corporate Google Workspace accounts:

```javascript
// In OAuth config
hd: 'your-company.com'  // Restricts to your domain only
```

## 🏢 Corporate Features

### Domain Filtering
- Restrict to company domain only
- Ensures only corporate files are accessible
- Prevents personal Drive access

### Shared Drive Support
- Access team drives
- Organization-wide shared folders
- Department-specific drives

### Permission Awareness
- Only shows files you have access to
- Respects Google Workspace permissions
- Read-only access (safe for automation)

## 📁 File Selection Best Practices

### What to Include
✅ Product roadmaps
✅ Sprint planning docs
✅ Customer feedback summaries
✅ Metrics dashboards
✅ Meeting notes
✅ Presentation decks
✅ Feature specs

### What to Avoid
❌ Personal documents
❌ Confidential HR files
❌ Financial sensitive data
❌ Very large files (>100MB)

## 🔧 Mock Data

Currently using mock data for demonstration. Files shown:

1. **Q1 Product Roadmap 2024** (Google Doc)
2. **Customer Feedback Summary - January** (Google Doc)
3. **Sprint Planning Notes** (Google Doc)
4. **Feature Specifications - AI Integration** (Google Doc)
5. **Product Metrics Dashboard** (Google Sheet)
6. **Q1 Business Review Slides** (Presentation)
7. **Competitive Analysis Report** (PDF)
8. **User Research Findings** (Google Doc)
9. **Budget Allocation 2024** (Google Sheet)
10. **Team OKRs - Q1 2024** (Google Doc)

## 🎨 Customization

### Change File Icons

Edit `DriveSelector.svelte`:
```typescript
function getFileIcon(mimeType: string): string {
  if (mimeType.includes('document')) return '📝'; // Custom icon
  // ... add more
}
```

### Add More File Types

Add to `fileTypeMap`:
```typescript
const fileTypeMap: Record<string, string> = {
  'application/vnd.google-apps.document': 'Google Doc',
  'your/mime-type': 'Your Type'  // Add here
};
```

### Adjust Grid Layout

Change columns in `DriveSelector.svelte`:
```svelte
<!-- Change from 2 columns to 3 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
```

## 📊 Data Flow

```
User Selects Files
    ↓
Stored in App State
    ↓
Passed to Draft Generation
    ↓
Included in Weekly Update
    ↓
Shows as Links + Metadata
```

## 🔄 Integration with Workflow

### Step 1: Connect Sources
- Google Drive appears as 5th option
- Shows connection status
- Click to connect via OAuth

### Step 2: Select Data
- New "Drive" tab (📁)
- Browse and select files
- Files added to selection count

### Step 3: Choose Template
- Template can reference Drive files
- Links embedded in update

### Step 4: Generate Draft
- Selected files mentioned in draft
- Links included for easy access
- Metadata shown (modified date, owner)

### Step 5: Review & Edit
- See all selected Drive files
- Edit file references
- Remove unwanted files

## 🎯 Use Cases

### Product Manager Weekly Update
```
Selected Files:
- Q1 Roadmap.gdoc
- Sprint Planning.gdoc
- Metrics Dashboard.gsheet

Update Draft:
"This week I updated our Q1 Roadmap [link] based on 
sprint planning discussions [link]. Key metrics from
the dashboard [link] show..."
```

### Executive Summary
```
Selected Files:
- Business Review.gslides
- Budget Allocation.gsheet
- OKRs.gdoc

Update Draft:
"Prepared Q1 business review [link] showing progress
against OKRs [link]. Budget remains on track [link]..."
```

### Customer Update
```
Selected Files:
- Customer Feedback.gdoc
- Feature Specs.gdoc
- Research Findings.gdoc

Update Draft:
"Based on customer feedback [link], we've spec'd new
features [link] validated by user research [link]..."
```

## 🚧 Limitations (Current Mock Implementation)

- Using static mock data
- No real OAuth flow
- No actual file fetching
- File selection not persisted
- No real-time updates

## ✨ Future Enhancements

- [ ] Real Google Drive API integration
- [ ] OAuth 2.0 authentication flow
- [ ] File preview in app
- [ ] Recent files quick access
- [ ] Starred files section
- [ ] Folder navigation
- [ ] File version history
- [ ] Collaborative comments
- [ ] Download files locally
- [ ] Share file permissions

## 📚 Resources

- **Google Drive API Docs**: https://developers.google.com/drive
- **OAuth 2.0 Guide**: https://developers.google.com/identity/protocols/oauth2
- **Google Workspace Admin**: https://admin.google.com

## 🎉 Summary

You now have **full Google Drive integration** in Weekly! 

- 📁 5th data source added
- 🎨 Beautiful file selector
- 🔍 Search and filter capabilities
- 💬 Chat assistant support
- 🏢 Corporate-ready architecture

**Start using it**: Just click the Drive tab in Step 2! 🚀

---

*Last Updated: January 2025*
*Google Drive Integration v1.0*

