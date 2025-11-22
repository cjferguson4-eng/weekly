import type {
	SlackConversation,
	ZoomMeeting,
	ChorusRecording,
	GoogleSheet,
	Template
} from './types';

// Mock Slack conversations
export const mockSlackConversations: SlackConversation[] = [
	{
		id: 'slack-1',
		name: '#product-updates',
		type: 'channel',
		lastMessage: new Date('2025-10-10'),
		messageCount: 47,
		participants: ['Alex', 'Sarah', 'Mike', 'Jennifer'],
		preview: 'Discussed Q4 feature roadmap priorities and timeline adjustments...',
		selected: false
	},
	{
		id: 'slack-2',
		name: '#engineering-sync',
		type: 'channel',
		lastMessage: new Date('2025-10-09'),
		messageCount: 32,
		participants: ['Alex', 'Dev Team', 'Engineering Lead'],
		preview: 'Technical debt review and API performance optimization updates...',
		selected: false
	},
	{
		id: 'slack-3',
		name: 'DM with Sarah (CEO)',
		type: 'dm',
		lastMessage: new Date('2025-10-10'),
		messageCount: 12,
		participants: ['Alex', 'Sarah'],
		preview: 'Budget approval for new AI features and team expansion discussion...',
		selected: false
	},
	{
		id: 'slack-4',
		name: '#customer-feedback',
		type: 'channel',
		lastMessage: new Date('2025-10-08'),
		messageCount: 28,
		participants: ['Alex', 'Support Team', 'Customer Success'],
		preview: 'Latest NPS scores and feature requests from enterprise customers...',
		selected: false
	}
];

// Mock Zoom meetings
export const mockZoomMeetings: ZoomMeeting[] = [
	{
		id: 'zoom-1',
		topic: 'Executive Strategy Review',
		startTime: new Date('2025-10-09T10:00:00'),
		duration: 60,
		participants: ['Alex', 'CEO', 'CTO', 'VP Product'],
		hasRecording: true,
		hasTranscript: true,
		preview: 'Reviewed Q4 strategic initiatives, discussed AI adoption metrics...',
		selected: false
	},
	{
		id: 'zoom-2',
		topic: 'Product Roadmap Planning',
		startTime: new Date('2025-10-08T14:00:00'),
		duration: 90,
		participants: ['Alex', 'Product Team', 'Engineering Leads'],
		hasRecording: true,
		hasTranscript: true,
		preview: 'Prioritized features for next sprint, addressed technical constraints...',
		selected: false
	},
	{
		id: 'zoom-3',
		topic: 'Customer Advisory Board Meeting',
		startTime: new Date('2025-10-07T15:00:00'),
		duration: 120,
		participants: ['Alex', 'Top 5 Enterprise Customers', 'Customer Success'],
		hasRecording: true,
		hasTranscript: true,
		preview: 'Gathered feedback on new AI features, discussed integration needs...',
		selected: false
	},
	{
		id: 'zoom-4',
		topic: 'Weekly Team Standup',
		startTime: new Date('2025-10-10T09:00:00'),
		duration: 30,
		participants: ['Alex', 'Product Team'],
		hasRecording: true,
		hasTranscript: false,
		preview: 'Sprint progress updates, blocker discussions, resource allocation...',
		selected: false
	}
];

// Mock Chorus.ai recordings
export const mockChorusRecordings: ChorusRecording[] = [
	{
		id: 'chorus-1',
		title: 'Discovery Call - Acme Corp',
		date: new Date('2025-10-09'),
		duration: 45,
		participants: ['Alex', 'Sales Rep', 'Acme Corp CTO'],
		customerName: 'Acme Corp',
		dealValue: 250000,
		keyTopics: ['AI Integration', 'Security Requirements', 'Timeline Expectations'],
		preview: 'Customer expressed strong interest in AI capabilities, raised security concerns...',
		selected: false
	},
	{
		id: 'chorus-2',
		title: 'Product Demo - GlobalTech Inc',
		date: new Date('2025-10-08'),
		duration: 60,
		participants: ['Alex', 'Sales Engineer', 'GlobalTech Product Team'],
		customerName: 'GlobalTech Inc',
		dealValue: 500000,
		keyTopics: ['API Capabilities', 'Custom Integrations', 'Scalability'],
		preview: 'Demonstrated new AI features, customer impressed with automation capabilities...',
		selected: false
	},
	{
		id: 'chorus-3',
		title: 'QBR - MegaCorp Enterprise',
		date: new Date('2025-10-07'),
		duration: 90,
		participants: ['Alex', 'Account Manager', 'MegaCorp Executive Team'],
		customerName: 'MegaCorp',
		keyTopics: ['Usage Growth', 'Expansion Opportunities', 'Feature Requests'],
		preview: 'Quarterly review showed 300% usage increase, discussed expansion to 5 new departments...',
		selected: false
	},
	{
		id: 'chorus-4',
		title: 'Technical Discussion - StartupXYZ',
		date: new Date('2025-10-10'),
		duration: 30,
		participants: ['Alex', 'Technical Lead', 'StartupXYZ Engineering'],
		customerName: 'StartupXYZ',
		dealValue: 75000,
		keyTopics: ['API Documentation', 'Integration Support', 'Onboarding'],
		preview: 'Addressed technical questions about API endpoints and authentication...',
		selected: false
	}
];

// Mock Google Drive files
export const driveFiles = [
	{
		id: '1a2b3c4d5e',
		name: 'Q1 Product Roadmap 2024',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-10T14:30:00Z',
		size: 45632,
		webViewLink: 'https://docs.google.com/document/d/1a2b3c4d5e',
		owner: 'sarah.chen@company.com',
		selected: false
	},
	{
		id: '2b3c4d5e6f',
		name: 'Customer Feedback Summary - January',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-12T09:15:00Z',
		size: 28941,
		webViewLink: 'https://docs.google.com/document/d/2b3c4d5e6f',
		owner: 'mike.rodriguez@company.com',
		selected: false
	},
	{
		id: '3c4d5e6f7g',
		name: 'Sprint Planning Notes',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-09T16:45:00Z',
		size: 15789,
		webViewLink: 'https://docs.google.com/document/d/3c4d5e6f7g',
		owner: 'alex.kim@company.com',
		selected: false
	},
	{
		id: '4d5e6f7g8h',
		name: 'Feature Specifications - AI Integration',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-11T11:20:00Z',
		size: 67234,
		webViewLink: 'https://docs.google.com/document/d/4d5e6f7g8h',
		owner: 'emily.parker@company.com',
		selected: false
	},
	{
		id: '5e6f7g8h9i',
		name: 'Product Metrics Dashboard',
		mimeType: 'application/vnd.google-apps.spreadsheet',
		modifiedTime: '2024-01-13T08:00:00Z',
		size: 89456,
		webViewLink: 'https://docs.google.com/spreadsheets/d/5e6f7g8h9i',
		owner: 'data@company.com',
		selected: false
	},
	{
		id: '6f7g8h9i0j',
		name: 'Q1 Business Review Slides',
		mimeType: 'application/vnd.google-apps.presentation',
		modifiedTime: '2024-01-08T13:30:00Z',
		size: 12456789,
		webViewLink: 'https://docs.google.com/presentation/d/6f7g8h9i0j',
		owner: 'leadership@company.com',
		selected: false
	},
	{
		id: '7g8h9i0j1k',
		name: 'Competitive Analysis Report.pdf',
		mimeType: 'application/pdf',
		modifiedTime: '2024-01-07T10:00:00Z',
		size: 2345678,
		webViewLink: 'https://drive.google.com/file/d/7g8h9i0j1k',
		owner: 'research@company.com',
		selected: false
	},
	{
		id: '8h9i0j1k2l',
		name: 'User Research Findings',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-06T15:45:00Z',
		size: 41234,
		webViewLink: 'https://docs.google.com/document/d/8h9i0j1k2l',
		owner: 'ux.team@company.com',
		selected: false
	},
	{
		id: '9i0j1k2l3m',
		name: 'Budget Allocation 2024',
		mimeType: 'application/vnd.google-apps.spreadsheet',
		modifiedTime: '2024-01-05T09:30:00Z',
		size: 56789,
		webViewLink: 'https://docs.google.com/spreadsheets/d/9i0j1k2l3m',
		owner: 'finance@company.com',
		selected: false
	},
	{
		id: '0j1k2l3m4n',
		name: 'Team OKRs - Q1 2024',
		mimeType: 'application/vnd.google-apps.document',
		modifiedTime: '2024-01-14T12:00:00Z',
		size: 32145,
		webViewLink: 'https://docs.google.com/document/d/0j1k2l3m4n',
		owner: 'hr@company.com',
		selected: false
	}
];

// Mock Google Sheets
export const mockGoogleSheets: GoogleSheet[] = [
	{
		id: 'sheet-1',
		name: 'Q4 Product Metrics Dashboard',
		url: 'https://docs.google.com/spreadsheets/d/abc123',
		lastModified: new Date('2025-10-10'),
		sheetTabs: [
			{ id: 'tab-1', name: 'Weekly Active Users', rowCount: 156, selected: false },
			{ id: 'tab-2', name: 'Feature Adoption Rates', rowCount: 89, selected: false },
			{ id: 'tab-3', name: 'Revenue Metrics', rowCount: 52, selected: false }
		],
		selected: false
	},
	{
		id: 'sheet-2',
		name: 'AI Feature Usage Tracking',
		url: 'https://docs.google.com/spreadsheets/d/def456',
		lastModified: new Date('2025-10-09'),
		sheetTabs: [
			{ id: 'tab-4', name: 'Daily Usage', rowCount: 200, selected: false },
			{ id: 'tab-5', name: 'Customer Segments', rowCount: 45, selected: false }
		],
		selected: false
	},
	{
		id: 'sheet-3',
		name: 'Customer Health Scores',
		url: 'https://docs.google.com/spreadsheets/d/ghi789',
		lastModified: new Date('2025-10-08'),
		sheetTabs: [
			{ id: 'tab-6', name: 'Enterprise Accounts', rowCount: 78, selected: false },
			{ id: 'tab-7', name: 'Risk Assessment', rowCount: 34, selected: false }
		],
		selected: false
	}
];

// Template definitions
export const templates: Template[] = [
	{
		id: 'ai-adoption',
		name: 'AI Adoption Template',
		description: 'Focused on AI feature incubation, usage data, and customer engagement',
		sections: [
			{
				id: 'incubation',
				title: 'Incubation Program',
				description: 'Progress on AI feature development and testing'
			},
			{
				id: 'usage-data',
				title: 'Usage Data',
				description: 'Metrics and analytics on AI feature adoption'
			},
			{
				id: 'customer-engagement',
				title: 'Customer Engagement',
				description: 'Customer feedback and engagement with AI features'
			}
		]
	},
	{
		id: '4-box',
		name: '4-Box Template',
		description: 'Comprehensive weekly update with updates, interactions, challenges, and priorities',
		sections: [
			{
				id: 'updates',
				title: 'Updates',
				description: 'Key accomplishments and progress this week'
			},
			{
				id: 'customer-interactions',
				title: 'Customer Interactions',
				description: 'Notable customer conversations and feedback'
			},
			{
				id: 'lowlights',
				title: 'Lowlights',
				description: 'Challenges, blockers, and areas needing attention'
			},
			{
				id: 'forward-looking',
				title: 'Forward Looking Priorities',
				description: 'Key priorities and focus areas for next week'
			}
		]
	}
];

