<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/appStore';
	import { browser } from '$app/environment';
	import type { DataSource } from '$lib/types';

	let dataSources: DataSource[] = [];
	appStore.subscribe((state) => {
		dataSources = state.dataSources;
	});

	// Modal state for adding custom data source
	let showAddModal = false;
	let newSourceName = '';
	let newSourceDescription = '';

	// Lazy load icons only on client side to avoid SSR issues
	let IconComponents: any = {};
	
	onMount(async () => {
		if (browser) {
			const lucide = await import('lucide-svelte');
			IconComponents = {
				slack: lucide.MessageSquare,
				zoom: lucide.Video,
				chorus: lucide.Mic,
				sheets: lucide.FileSpreadsheet,
				drive: lucide.Cloud,
				github: lucide.GitBranch,
				custom: lucide.Plus,
				check: lucide.Check,
				externalLink: lucide.ExternalLink,
				X: lucide.X
			};
		}
	});

	const descriptions = {
		slack: 'Connect to access your team conversations and channels',
		zoom: 'Connect to access your meeting recordings and transcripts',
		chorus: 'Connect to access customer conversation recordings',
		sheets: 'Connect to access your spreadsheets and metrics data',
		drive: 'Connect to access your documents and files',
		github: 'Connect to access your code repositories and pull requests'
	};

	function handleConnect(type: string) {
		// Simulate OAuth connection flow
		appStore.connectDataSource(type);
	}

	function handleDisconnect(type: string) {
		// Disconnect the data source
		appStore.disconnectDataSource(type);
	}

	function handleAddCustomSource() {
		if (newSourceName.trim()) {
			appStore.addCustomDataSource(
				newSourceName.trim(),
				newSourceDescription.trim() || 'Custom data source connection'
			);
			newSourceName = '';
			newSourceDescription = '';
			showAddModal = false;
		}
	}

	function handleRemoveCustomSource(customId: string) {
		if (confirm('Are you sure you want to remove this data source?')) {
			appStore.removeCustomDataSource(customId);
		}
	}

	function handleNext() {
		const someConnected = dataSources.some((ds) => ds.connected);
		if (someConnected) {
			appStore.setStep(2);
		}
	}

	function getDescription(source: DataSource): string {
		if (source.description) return source.description;
		if (source.type === 'custom') return 'Connect to access your data';
		return descriptions[source.type as keyof typeof descriptions] || 'Connect to access your data';
	}

	function getSourceId(source: DataSource): string {
		return source.customId || source.type;
	}

	$: allConnected = dataSources.every((ds) => ds.connected);
	$: someConnected = dataSources.some((ds) => ds.connected);
</script>

<div class="max-w-4xl mx-auto">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Connect Your Data Sources</h2>
		<p class="text-gray-600">
			Connect at least one data source to start generating your weekly updates
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
		{#each dataSources as source}
			{@const Icon = IconComponents[source.type]}
			{@const sourceId = getSourceId(source)}
			<div class="card hover:shadow-md transition-shadow duration-200">
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
							{#if browser && Icon}
								<svelte:component this={Icon} class="w-6 h-6 text-primary-600" />
							{:else}
								<div class="w-6 h-6 text-primary-600"></div>
							{/if}
						</div>
						<div class="flex-1">
							<h3 class="text-lg font-semibold text-gray-900">{source.name}</h3>
							{#if source.connected && source.lastSync}
								<p class="text-xs text-green-600 flex items-center gap-1 mt-1">
									{#if browser && IconComponents.check}
										<svelte:component this={IconComponents.check} class="w-3 h-3" />
									{/if}
									Connected
								</p>
							{/if}
						</div>
						{#if source.type === 'custom' && source.customId}
							<button
								class="text-gray-400 hover:text-red-600 transition-colors p-1"
								on:click={() => source.customId && handleRemoveCustomSource(source.customId)}
								title="Remove data source"
							>
								{#if browser && IconComponents.X}
									<svelte:component this={IconComponents.X} class="w-4 h-4" />
								{/if}
							</button>
						{/if}
					</div>
				</div>

				<p class="text-sm text-gray-600 mb-4">
					{getDescription(source)}
				</p>

				{#if source.connected}
					<button
						class="btn btn-secondary w-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
						on:click={() => handleDisconnect(sourceId)}
					>
						{#if browser && IconComponents.check}
							<svelte:component this={IconComponents.check} class="w-4 h-4" />
						{/if}
						Connected
					</button>
				{:else}
					<button
						class="btn btn-primary w-full flex items-center justify-center gap-2"
						on:click={() => handleConnect(sourceId)}
					>
						{#if browser && IconComponents.externalLink}
							<svelte:component this={IconComponents.externalLink} class="w-4 h-4" />
						{/if}
						Connect {source.name}
					</button>
				{/if}
			</div>
		{/each}

		<!-- Add Custom Data Source Card -->
		<button
			class="card hover:shadow-md transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center min-h-[200px] text-center"
			on:click={() => (showAddModal = true)}
		>
			<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
				{#if browser && IconComponents.custom}
					<svelte:component this={IconComponents.custom} class="w-6 h-6 text-gray-600" />
				{/if}
			</div>
			<h3 class="text-lg font-semibold text-gray-700 mb-2">Add Custom Data Source</h3>
			<p class="text-sm text-gray-500">Connect to a new data source</p>
		</button>
	</div>

	<!-- Add Custom Data Source Modal -->
	{#if showAddModal}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			on:click={() => (showAddModal = false)}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Escape' && (showAddModal = false)}
			aria-label="Close modal"
		>
			<div
				class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
				on:click|stopPropagation
				role="dialog"
				aria-label="Add custom data source"
			>
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-xl font-bold text-gray-900">Add Custom Data Source</h3>
					<button
						class="text-gray-400 hover:text-gray-600 transition-colors"
						on:click={() => (showAddModal = false)}
					>
						{#if browser && IconComponents.X}
							<svelte:component this={IconComponents.X} class="w-5 h-5" />
						{/if}
					</button>
				</div>

				<div class="space-y-4">
					<div>
						<label for="source-name" class="block text-sm font-medium text-gray-700 mb-1">
							Data Source Name *
						</label>
						<input
							id="source-name"
							type="text"
							bind:value={newSourceName}
							placeholder="e.g., Jira, Linear, Notion"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label for="source-description" class="block text-sm font-medium text-gray-700 mb-1">
							Description (optional)
						</label>
						<textarea
							id="source-description"
							bind:value={newSourceDescription}
							placeholder="Describe what this data source provides..."
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						></textarea>
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<button
						class="btn btn-secondary flex-1"
						on:click={() => {
							showAddModal = false;
							newSourceName = '';
							newSourceDescription = '';
						}}
					>
						Cancel
					</button>
					<button
						class="btn btn-primary flex-1"
						on:click={handleAddCustomSource}
						disabled={!newSourceName.trim()}
					>
						Add Data Source
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Navigation -->
	<div class="flex justify-between items-center">
		<div class="text-sm text-gray-500">
			{dataSources.filter((ds) => ds.connected).length} of {dataSources.length} sources connected
		</div>
		<button
			class="btn btn-primary px-8"
			on:click={handleNext}
			disabled={!someConnected}
		>
			Continue
		</button>
	</div>

	{#if !allConnected && someConnected}
		<div class="mt-4 text-center">
			<p class="text-sm text-gray-500">
				You can skip sources and continue, but connecting more sources will create a more comprehensive update
			</p>
		</div>
	{/if}
</div>

