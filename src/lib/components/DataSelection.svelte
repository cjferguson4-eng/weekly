<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import {
		mockSlackConversations,
		mockZoomMeetings,
		mockChorusRecordings,
		mockGoogleSheets,
		driveFiles
	} from '$lib/mockData';
	import SlackSelector from './selectors/SlackSelector.svelte';
	import ZoomSelector from './selectors/ZoomSelector.svelte';
	import ChorusSelector from './selectors/ChorusSelector.svelte';
	import SheetsSelector from './selectors/SheetsSelector.svelte';
	import DriveSelector from './selectors/DriveSelector.svelte';
	import type { DataSource } from '$lib/types';

	let dataSources: DataSource[] = [];
	let activeTab = '';

	appStore.subscribe((state) => {
		dataSources = state.dataSources.filter((ds) => ds.connected);
		if (dataSources.length > 0 && !activeTab) {
			activeTab = dataSources[0].type;
		}
	});

	let slackConversations = [...mockSlackConversations];
	let zoomMeetings = [...mockZoomMeetings];
	let chorusRecordings = [...mockChorusRecordings];
	let googleSheets = [...mockGoogleSheets];
	let googleDriveFiles = [...driveFiles];

	function handleBack() {
		appStore.setStep(1);
	}

	function handleNext() {
		// Save selections to store
		appStore.setSlackConversations(slackConversations.filter((c) => c.selected));
		appStore.setZoomMeetings(zoomMeetings.filter((m) => m.selected));
		appStore.setChorusRecordings(chorusRecordings.filter((r) => r.selected));
		appStore.setGoogleSheets(googleSheets.filter((s) => s.selected));
		appStore.setGoogleDriveFiles(googleDriveFiles.filter((f: any) => f.selected));
		appStore.setStep(3);
	}

	$: totalSelected =
		slackConversations.filter((c) => c.selected).length +
		zoomMeetings.filter((m) => m.selected).length +
		chorusRecordings.filter((r) => r.selected).length +
		googleSheets.filter((s) => s.selected).length +
		googleDriveFiles.filter((f: any) => f.selected).length;
</script>

<div class="max-w-6xl mx-auto">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Select Your Data</h2>
		<p class="text-gray-600">
			Choose the conversations, meetings, and data you want to include in your weekly update
		</p>
	</div>

	<!-- Tabs -->
	<div class="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
		{#each dataSources as source}
			<button
				class="px-6 py-3 font-medium transition-colors duration-200 border-b-2 {activeTab ===
				source.type
					? 'border-primary-600 text-primary-600'
					: 'border-transparent text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = source.type)}
			>
				{source.name}
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="mb-8">
		{#if activeTab === 'slack'}
			<SlackSelector bind:conversations={slackConversations} />
		{:else if activeTab === 'zoom'}
			<ZoomSelector bind:meetings={zoomMeetings} />
		{:else if activeTab === 'chorus'}
			<ChorusSelector bind:recordings={chorusRecordings} />
		{:else if activeTab === 'sheets'}
			<SheetsSelector bind:sheets={googleSheets} />
		{:else if activeTab === 'drive'}
			<DriveSelector bind:files={googleDriveFiles} />
		{/if}
	</div>

	<!-- Navigation -->
	<div class="flex justify-between items-center">
		<button class="btn btn-secondary" on:click={handleBack}> Back </button>
		<div class="text-sm text-gray-600">
			{totalSelected} item{totalSelected !== 1 ? 's' : ''} selected
		</div>
		<button class="btn btn-primary px-8" on:click={handleNext} disabled={totalSelected === 0}>
			Continue
		</button>
	</div>

	{#if totalSelected > 0 && totalSelected < 5}
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-500">
				You can continue with {totalSelected === 1 ? 'this selection' : 'your selections'}, or select more items for a more comprehensive update
			</p>
		</div>
	{/if}
</div>

