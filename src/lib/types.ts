// Data source types
export type DataSourceType = 'slack' | 'zoom' | 'chorus' | 'sheets' | 'drive' | 'github' | 'custom';

export interface DataSource {
	type: DataSourceType;
	name: string;
	connected: boolean;
	lastSync?: Date;
	description?: string;
	customId?: string; // For custom data sources
}

// Slack types
export interface SlackConversation {
	id: string;
	name: string;
	type: 'channel' | 'dm' | 'group';
	lastMessage: Date;
	messageCount: number;
	participants: string[];
	preview: string;
	selected: boolean;
}

// Zoom types
export interface ZoomMeeting {
	id: string;
	topic: string;
	startTime: Date;
	duration: number; // minutes
	participants: string[];
	hasRecording: boolean;
	hasTranscript: boolean;
	preview: string;
	selected: boolean;
}

// Chorus.ai types
export interface ChorusRecording {
	id: string;
	title: string;
	date: Date;
	duration: number; // minutes
	participants: string[];
	customerName: string;
	dealValue?: number;
	keyTopics: string[];
	preview: string;
	selected: boolean;
}

// Google Sheets types
export interface GoogleSheet {
	id: string;
	name: string;
	url: string;
	lastModified: Date;
	sheetTabs: SheetTab[];
	selected: boolean;
}

export interface SheetTab {
	id: string;
	name: string;
	rowCount: number;
	selected: boolean;
}

// Template types
export type TemplateType = 'ai-adoption' | '4-box';

export interface Template {
	id: TemplateType;
	name: string;
	description: string;
	sections: TemplateSection[];
}

export interface TemplateSection {
	id: string;
	title: string;
	description: string;
}

// Weekly update types
export interface WeeklyUpdate {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	template: TemplateType;
	sections: UpdateSection[];
	status: 'draft' | 'review' | 'final';
}

export interface UpdateSection {
	id: string;
	title: string;
	content: string;
}

// Application state
export interface GoogleDriveFile {
	id: string;
	name: string;
	mimeType: string;
	modifiedTime: string;
	size?: number;
	webViewLink?: string;
	thumbnailLink?: string;
	owner?: string;
}

export interface AppState {
	currentStep: number;
	dataSources: DataSource[];
	selectedSlackConversations: SlackConversation[];
	selectedZoomMeetings: ZoomMeeting[];
	selectedChorusRecordings: ChorusRecording[];
	selectedGoogleSheets: GoogleSheet[];
	selectedGoogleDriveFiles: GoogleDriveFile[];
	selectedTemplate: TemplateType | null;
	currentDraft: WeeklyUpdate | null;
}

