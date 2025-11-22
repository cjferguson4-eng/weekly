import { writable } from 'svelte/store';
import type {
	AppState,
	DataSource,
	SlackConversation,
	ZoomMeeting,
	ChorusRecording,
	GoogleSheet,
	TemplateType,
	WeeklyUpdate
} from '../types';

const initialState: AppState = {
	currentStep: 1,
	dataSources: [
		{ type: 'slack', name: 'Slack', connected: false },
		{ type: 'zoom', name: 'Zoom', connected: false },
		{ type: 'chorus', name: 'Chorus.ai', connected: false },
		{ type: 'sheets', name: 'Google Sheets', connected: false },
		{ type: 'drive', name: 'Google Drive', connected: false },
		{ type: 'github', name: 'GitHub', connected: false }
	],
	selectedSlackConversations: [],
	selectedZoomMeetings: [],
	selectedChorusRecordings: [],
	selectedGoogleSheets: [],
	selectedGoogleDriveFiles: [],
	selectedTemplate: null,
	currentDraft: null
};

function createAppStore() {
	const { subscribe, set, update } = writable<AppState>(initialState);

	return {
		subscribe,
		setStep: (step: number) => update((state) => ({ ...state, currentStep: step })),
		
		connectDataSource: (type: string) =>
			update((state) => ({
				...state,
				dataSources: state.dataSources.map((ds) =>
					ds.type === type || ds.customId === type ? { ...ds, connected: true, lastSync: new Date() } : ds
				)
			})),
		
		disconnectDataSource: (type: string) =>
			update((state) => ({
				...state,
				dataSources: state.dataSources.map((ds) =>
					ds.type === type || ds.customId === type ? { ...ds, connected: false, lastSync: undefined } : ds
				)
			})),
		
		addCustomDataSource: (name: string, description: string) =>
			update((state) => {
				const customId = `custom-${Date.now()}`;
				const newSource: DataSource = {
					type: 'custom',
					name,
					description,
					connected: false,
					customId
				};
				return {
					...state,
					dataSources: [...state.dataSources, newSource]
				};
			}),
		
		removeCustomDataSource: (customId: string) =>
			update((state) => ({
				...state,
				dataSources: state.dataSources.filter((ds) => ds.customId !== customId)
			})),
		
		setSlackConversations: (conversations: SlackConversation[]) =>
			update((state) => ({ ...state, selectedSlackConversations: conversations })),
		
		setZoomMeetings: (meetings: ZoomMeeting[]) =>
			update((state) => ({ ...state, selectedZoomMeetings: meetings })),
		
		setChorusRecordings: (recordings: ChorusRecording[]) =>
			update((state) => ({ ...state, selectedChorusRecordings: recordings })),
		
	setGoogleSheets: (sheets: GoogleSheet[]) =>
		update((state) => ({ ...state, selectedGoogleSheets: sheets })),
	
	setGoogleDriveFiles: (files: any[]) =>
		update((state) => ({ ...state, selectedGoogleDriveFiles: files })),
	
	setTemplate: (template: TemplateType) =>
		update((state) => ({ ...state, selectedTemplate: template })),
		
		setDraft: (draft: WeeklyUpdate) =>
			update((state) => ({ ...state, currentDraft: draft })),
		
		reset: () => set(initialState)
	};
}

export const appStore = createAppStore();

