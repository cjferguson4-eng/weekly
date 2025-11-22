<script lang="ts">
	import type { GoogleDriveFile } from '$lib/types';

	export let files: any[] = [];
	let searchTerm = '';
	let fileTypeFilter = 'all';

	// File type mapping
	const fileTypeMap: Record<string, string> = {
		'application/vnd.google-apps.document': 'Google Doc',
		'application/vnd.google-apps.spreadsheet': 'Google Sheet',
		'application/vnd.google-apps.presentation': 'Google Slides',
		'application/pdf': 'PDF',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Doc',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
		'text/plain': 'Text File'
	};

	$: filteredFiles = files.filter((file) => {
		const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType =
			fileTypeFilter === 'all' ||
			(fileTypeFilter === 'docs' && file.mimeType.includes('document')) ||
			(fileTypeFilter === 'sheets' && file.mimeType.includes('spreadsheet')) ||
			(fileTypeFilter === 'slides' && file.mimeType.includes('presentation')) ||
			(fileTypeFilter === 'pdfs' && file.mimeType === 'application/pdf');
		return matchesSearch && matchesType;
	});

	function toggleFile(file: any) {
		file.selected = !file.selected;
		files = [...files];
	}

	function isSelected(file: any): boolean {
		return file.selected || false;
	}
	
	$: selectedCount = files.filter(f => f.selected).length;

	function getFileIcon(mimeType: string): string {
		if (mimeType.includes('document')) return '📄';
		if (mimeType.includes('spreadsheet')) return '📊';
		if (mimeType.includes('presentation')) return '📽️';
		if (mimeType.includes('pdf')) return '📕';
		if (mimeType.includes('image')) return '🖼️';
		if (mimeType.includes('video')) return '🎬';
		return '📁';
	}

	function formatFileSize(bytes?: number): string {
		if (!bytes) return 'N/A';
		const kb = bytes / 1024;
		const mb = kb / 1024;
		if (mb >= 1) return `${mb.toFixed(1)} MB`;
		return `${kb.toFixed(1)} KB`;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Google Drive Files</h3>
			<p class="text-sm text-gray-600 mt-1">
				Select documents to include in your update
				{#if selectedCount > 0}
					<span class="text-blue-600 font-medium">({selectedCount} selected)</span>
				{/if}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
				Connected
			</span>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4">
		<!-- Search -->
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search files..."
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>

		<!-- File Type Filter -->
		<select
			bind:value={fileTypeFilter}
			class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		>
			<option value="all">All Files</option>
			<option value="docs">Google Docs</option>
			<option value="sheets">Google Sheets</option>
			<option value="slides">Google Slides</option>
			<option value="pdfs">PDFs</option>
		</select>
	</div>

	<!-- Files Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each filteredFiles as file (file.id)}
			<button
				on:click={() => toggleFile(file)}
				class="relative p-4 border-2 rounded-xl text-left transition-all hover:shadow-lg {isSelected(
					file
				)
					? 'border-blue-500 bg-blue-50'
					: 'border-gray-200 bg-white hover:border-blue-300'}"
			>
				<!-- Selection Indicator -->
				{#if isSelected(file)}
					<div
						class="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
					>
						<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				{/if}

				<!-- File Header -->
				<div class="flex items-start gap-3 mb-3">
					<div class="text-3xl">{getFileIcon(file.mimeType)}</div>
					<div class="flex-1 min-w-0">
						<h4 class="font-semibold text-gray-900 truncate">{file.name}</h4>
						<p class="text-xs text-gray-500 mt-1">
							{fileTypeMap[file.mimeType] || 'File'}
						</p>
					</div>
				</div>

				<!-- File Details -->
				<div class="space-y-2 text-sm">
					<div class="flex items-center gap-2 text-gray-600">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span class="text-xs">Modified {formatDate(file.modifiedTime)}</span>
					</div>

					{#if file.owner}
						<div class="flex items-center gap-2 text-gray-600">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<span class="text-xs">{file.owner}</span>
						</div>
					{/if}

					{#if file.size}
						<div class="flex items-center gap-2 text-gray-600">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
							<span class="text-xs">{formatFileSize(file.size)}</span>
						</div>
					{/if}
				</div>

				<!-- View Link -->
				{#if file.webViewLink}
					<div class="mt-3 pt-3 border-t border-gray-200">
						<a
							href={file.webViewLink}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
							on:click={(e) => e.stopPropagation()}
						>
							<span>Open in Drive</span>
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
						</a>
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Empty State -->
	{#if filteredFiles.length === 0}
		<div class="text-center py-12 bg-gray-50 rounded-xl">
			<div class="text-6xl mb-4">📁</div>
			<h4 class="text-lg font-semibold text-gray-900 mb-2">No files found</h4>
			<p class="text-gray-600">
				{searchTerm ? 'Try a different search term' : 'No files match the selected filter'}
			</p>
		</div>
	{/if}

	<!-- Selection Summary -->
	{#if selectedCount > 0}
		<div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
			<div class="flex items-start justify-between">
				<div>
					<h4 class="font-semibold text-blue-900">
						{selectedCount} file{selectedCount !== 1 ? 's' : ''} selected
					</h4>
					<p class="text-sm text-blue-700 mt-1">
						These files will be referenced in your weekly update
					</p>
				</div>
				<button
					on:click={() => {
						files.forEach(f => f.selected = false);
						files = [...files];
					}}
					class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
				>
					Clear
				</button>
			</div>
		</div>
	{/if}
</div>

