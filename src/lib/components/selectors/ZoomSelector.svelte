<script lang="ts">
	import { Video, Users, Clock, Calendar, FileText } from 'lucide-svelte';
	import type { ZoomMeeting } from '$lib/types';

	export let meetings: ZoomMeeting[];

	function toggleSelection(id: string) {
		meetings = meetings.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m));
	}

	function selectAll() {
		meetings = meetings.map((m) => ({ ...m, selected: true }));
	}

	function deselectAll() {
		meetings = meetings.map((m) => ({ ...m, selected: false }));
	}

	$: selectedCount = meetings.filter((m) => m.selected).length;
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">Zoom Meetings ({selectedCount} selected)</h3>
		<div class="flex gap-2">
			<button class="btn btn-ghost text-sm" on:click={selectAll}>Select All</button>
			<button class="btn btn-ghost text-sm" on:click={deselectAll}>Clear All</button>
		</div>
	</div>

	<div class="space-y-3">
		{#each meetings as meeting}
			<label
				class="card hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-4 {meeting.selected
					? 'ring-2 ring-primary-500'
					: ''}"
			>
				<input
					type="checkbox"
					class="checkbox mt-1"
					checked={meeting.selected}
					on:change={() => toggleSelection(meeting.id)}
				/>
				<div class="flex-1 min-w-0">
					<div class="flex items-start justify-between gap-4 mb-2">
						<div class="flex items-center gap-2 min-w-0">
							<Video class="w-5 h-5 text-primary-600 flex-shrink-0" />
							<h4 class="font-semibold text-gray-900">{meeting.topic}</h4>
						</div>
						<div class="flex gap-2 flex-shrink-0">
							{#if meeting.hasRecording}
								<span
									class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1"
								>
									<Video class="w-3 h-3" />
									Recording
								</span>
							{/if}
							{#if meeting.hasTranscript}
								<span
									class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1"
								>
									<FileText class="w-3 h-3" />
									Transcript
								</span>
							{/if}
						</div>
					</div>
					<p class="text-sm text-gray-600 mb-3 line-clamp-2">{meeting.preview}</p>
					<div class="flex items-center gap-4 text-xs text-gray-500">
						<span class="flex items-center gap-1">
							<Calendar class="w-3 h-3" />
							{meeting.startTime.toLocaleDateString()}
						</span>
						<span class="flex items-center gap-1">
							<Clock class="w-3 h-3" />
							{meeting.duration} min
						</span>
						<span class="flex items-center gap-1">
							<Users class="w-3 h-3" />
							{meeting.participants.length} participants
						</span>
					</div>
				</div>
			</label>
		{/each}
	</div>
</div>

