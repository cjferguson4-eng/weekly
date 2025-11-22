<script lang="ts">
	import { FileSpreadsheet, Calendar, ExternalLink, ChevronDown, ChevronRight } from 'lucide-svelte';
	import type { GoogleSheet } from '$lib/types';

	export let sheets: GoogleSheet[];

	let expandedSheets: Set<string> = new Set();

	function toggleSheet(id: string) {
		sheets = sheets.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s));
	}

	function toggleTab(sheetId: string, tabId: string) {
		sheets = sheets.map((s) =>
			s.id === sheetId
				? {
						...s,
						sheetTabs: s.sheetTabs.map((t) => (t.id === tabId ? { ...t, selected: !t.selected } : t))
					}
				: s
		);
	}

	function toggleExpanded(id: string) {
		if (expandedSheets.has(id)) {
			expandedSheets.delete(id);
		} else {
			expandedSheets.add(id);
		}
		expandedSheets = expandedSheets;
	}

	function selectAll() {
		sheets = sheets.map((s) => ({
			...s,
			selected: true,
			sheetTabs: s.sheetTabs.map((t) => ({ ...t, selected: true }))
		}));
	}

	function deselectAll() {
		sheets = sheets.map((s) => ({
			...s,
			selected: false,
			sheetTabs: s.sheetTabs.map((t) => ({ ...t, selected: false }))
		}));
	}

	$: selectedCount = sheets.reduce(
		(count, sheet) => count + sheet.sheetTabs.filter((t) => t.selected).length,
		0
	);
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">
			Google Sheets ({selectedCount} tab{selectedCount !== 1 ? 's' : ''} selected)
		</h3>
		<div class="flex gap-2">
			<button class="btn btn-ghost text-sm" on:click={selectAll}>Select All</button>
			<button class="btn btn-ghost text-sm" on:click={deselectAll}>Clear All</button>
		</div>
	</div>

	<div class="space-y-3">
		{#each sheets as sheet}
			{@const isExpanded = expandedSheets.has(sheet.id)}
			<div class="card">
				<div class="flex items-start gap-4">
					<button
						class="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
						on:click={() => toggleExpanded(sheet.id)}
					>
						{#if isExpanded}
							<ChevronDown class="w-5 h-5" />
						{:else}
							<ChevronRight class="w-5 h-5" />
						{/if}
					</button>
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-4 mb-2">
							<div class="flex items-center gap-2 min-w-0">
								<FileSpreadsheet class="w-5 h-5 text-green-600 flex-shrink-0" />
								<h4 class="font-semibold text-gray-900">{sheet.name}</h4>
							</div>
							<a
								href={sheet.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary-600 hover:text-primary-700 flex-shrink-0"
								on:click|stopPropagation
							>
								<ExternalLink class="w-4 h-4" />
							</a>
						</div>
						<div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
							<span class="flex items-center gap-1">
								<Calendar class="w-3 h-3" />
								Modified {sheet.lastModified.toLocaleDateString()}
							</span>
							<span>{sheet.sheetTabs.length} tabs</span>
						</div>

						{#if isExpanded}
							<div class="space-y-2 mt-4 pl-4 border-l-2 border-gray-200">
								{#each sheet.sheetTabs as tab}
									<label class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
										<input
											type="checkbox"
											class="checkbox"
											checked={tab.selected}
											on:change={() => toggleTab(sheet.id, tab.id)}
										/>
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-900">{tab.name}</p>
											<p class="text-xs text-gray-500">{tab.rowCount} rows</p>
										</div>
									</label>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

