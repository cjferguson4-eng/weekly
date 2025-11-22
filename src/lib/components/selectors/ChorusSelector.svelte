<script lang="ts">
	import { Mic, Users, Clock, Calendar, DollarSign, Tag } from 'lucide-svelte';
	import type { ChorusRecording } from '$lib/types';

	export let recordings: ChorusRecording[];

	function toggleSelection(id: string) {
		recordings = recordings.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r));
	}

	function selectAll() {
		recordings = recordings.map((r) => ({ ...r, selected: true }));
	}

	function deselectAll() {
		recordings = recordings.map((r) => ({ ...r, selected: false }));
	}

	$: selectedCount = recordings.filter((r) => r.selected).length;
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">
			Chorus.ai Recordings ({selectedCount} selected)
		</h3>
		<div class="flex gap-2">
			<button class="btn btn-ghost text-sm" on:click={selectAll}>Select All</button>
			<button class="btn btn-ghost text-sm" on:click={deselectAll}>Clear All</button>
		</div>
	</div>

	<div class="space-y-3">
		{#each recordings as recording}
			<label
				class="card hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-4 {recording.selected
					? 'ring-2 ring-primary-500'
					: ''}"
			>
				<input
					type="checkbox"
					class="checkbox mt-1"
					checked={recording.selected}
					on:change={() => toggleSelection(recording.id)}
				/>
				<div class="flex-1 min-w-0">
					<div class="flex items-start justify-between gap-4 mb-2">
						<div class="flex items-center gap-2 min-w-0">
							<Mic class="w-5 h-5 text-primary-600 flex-shrink-0" />
							<h4 class="font-semibold text-gray-900">{recording.title}</h4>
						</div>
						<div class="flex-shrink-0">
							<span class="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
								{recording.customerName}
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-600 mb-3 line-clamp-2">{recording.preview}</p>
					<div class="flex flex-wrap gap-2 mb-3">
						{#each recording.keyTopics as topic}
							<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
								<Tag class="w-3 h-3" />
								{topic}
							</span>
						{/each}
					</div>
					<div class="flex items-center gap-4 text-xs text-gray-500">
						<span class="flex items-center gap-1">
							<Calendar class="w-3 h-3" />
							{recording.date.toLocaleDateString()}
						</span>
						<span class="flex items-center gap-1">
							<Clock class="w-3 h-3" />
							{recording.duration} min
						</span>
						<span class="flex items-center gap-1">
							<Users class="w-3 h-3" />
							{recording.participants.length} participants
						</span>
						{#if recording.dealValue}
							<span class="flex items-center gap-1 text-green-600 font-medium">
								<DollarSign class="w-3 h-3" />
								${(recording.dealValue / 1000).toFixed(0)}K
							</span>
						{/if}
					</div>
				</div>
			</label>
		{/each}
	</div>
</div>

