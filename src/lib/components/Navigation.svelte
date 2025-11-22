<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/appStore';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	
	export let currentStep: number;
	export let dataSources: any[];
	
	let isMobileMenuOpen = false;
	let isCollapsed = false;
	let SparklesIcon: any = null;
	
	onMount(async () => {
		if (browser) {
			const lucide = await import('lucide-svelte');
			SparklesIcon = lucide.Sparkles;
		}
	});
	
	const navItems = [
		{ 
			step: 1, 
			title: 'Connect', 
			icon: '🔗',
			description: 'Data Sources'
		},
		{ 
			step: 2, 
			title: 'Select', 
			icon: '📊',
			description: 'Your Data'
		},
		{ 
			step: 3, 
			title: 'Template', 
			icon: '📝',
			description: 'Choose Format'
		},
		{ 
			step: 4, 
			title: 'Generate', 
			icon: '✨',
			description: 'AI Draft'
		},
		{ 
			step: 5, 
			title: 'Review', 
			icon: '👁️',
			description: 'Finalize'
		}
	];
	
	function goToStep(step: number) {
		appStore.setStep(step);
		isMobileMenuOpen = false;
	}
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
	
	$: connectedCount = dataSources.filter(ds => ds.connected).length;
	$: totalSources = dataSources.length;
	
	// Get service emoji
	function getServiceEmoji(type: string): string {
		const emojiMap: Record<string, string> = {
			slack: '💬',
			zoom: '📹',
			chorus: '🎤',
			sheets: '📊',
			drive: '📁'
		};
		return emojiMap[type] || '📦';
	}
</script>

<!-- Mobile Menu Button -->
<button
	class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
	on:click={toggleMobileMenu}
	aria-label="Toggle menu"
>
	<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		{#if isMobileMenuOpen}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		{:else}
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		{/if}
	</svg>
</button>

<!-- Navigation Sidebar -->
<nav
	class="fixed left-0 top-0 h-screen bg-white shadow-2xl z-40 transition-all duration-300 ease-in-out
		{isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
		{isCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72"
>
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				{#if !isCollapsed}
					<div class="flex items-center gap-3 flex-1">
						{#if browser && SparklesIcon}
							<div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<svelte:component this={SparklesIcon} class="w-6 h-6 text-white" />
							</div>
						{:else}
							<div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<span class="text-white text-xl">✨</span>
							</div>
						{/if}
						<div>
							<h2 class="text-xl font-bold text-gray-900">Weekly</h2>
						</div>
					</div>
				{:else}
					<div class="mx-auto">
						{#if browser && SparklesIcon}
							<div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<svelte:component this={SparklesIcon} class="w-6 h-6 text-white" />
							</div>
						{:else}
							<div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
								<span class="text-white text-xl">✨</span>
							</div>
						{/if}
					</div>
				{/if}
				<button
					class="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
					on:click={toggleCollapse}
					aria-label="Toggle sidebar"
				>
					<svg class="w-5 h-5 text-gray-600 transition-transform {isCollapsed ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Connection Status -->
		<div class="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
			{#if !isCollapsed}
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-semibold text-gray-700">Connections</span>
					<span class="text-xs font-bold text-indigo-600">{connectedCount}/{totalSources}</span>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div 
						class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
						style="width: {(connectedCount / totalSources) * 100}%"
					></div>
				</div>
			{:else}
				<div class="text-center">
					<div class="text-lg font-bold text-indigo-600">{connectedCount}</div>
					<div class="text-xs text-gray-500">/{totalSources}</div>
				</div>
			{/if}
		</div>

		<!-- Navigation Items -->
		<div class="flex-1 overflow-y-auto py-6 px-3">
			<div class="space-y-2">
				{#each navItems as item (item.step)}
					<button
						class="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
							{currentStep === item.step 
								? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
								: 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
							}
							{currentStep > item.step ? 'opacity-100' : ''}
							{currentStep < item.step ? 'opacity-60' : ''}"
						on:click={() => goToStep(item.step)}
					>
						<div class="text-2xl {isCollapsed ? 'mx-auto' : ''}">{item.icon}</div>
						{#if !isCollapsed}
							<div class="flex-1 text-left">
								<div class="font-semibold text-sm">{item.title}</div>
								<div class="text-xs {currentStep === item.step ? 'text-blue-100' : 'text-gray-500'}">
									{item.description}
								</div>
							</div>
						{/if}
						{#if !isCollapsed && currentStep > item.step}
							<svg class="w-5 h-5 {currentStep === item.step ? 'text-white' : 'text-green-500'}" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Data Source Status -->
		{#if !isCollapsed}
			<div class="border-t border-gray-200 p-4">
				<div class="text-xs font-semibold text-gray-700 mb-3">Connected Services</div>
				<div class="space-y-2">
					{#each dataSources as source}
						<div class="flex items-center gap-2 text-xs">
							<div class="w-2 h-2 rounded-full {source.connected ? 'bg-green-500' : 'bg-gray-300'}"></div>
							<span class="text-gray-600">{source.name}</span>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="border-t border-gray-200 p-4">
				{#each dataSources as source}
					<div class="flex justify-center mb-2">
						<div class="w-3 h-3 rounded-full {source.connected ? 'bg-green-500' : 'bg-gray-300'}"></div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Footer -->
		<div class="border-t border-gray-200 p-4">
			{#if !isCollapsed}
				<button class="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
					<span class="text-xl">⚙️</span>
					<span class="text-sm font-medium">Settings</span>
				</button>
			{:else}
				<button class="w-full flex justify-center py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
					<span class="text-xl">⚙️</span>
				</button>
			{/if}
		</div>
	</div>
</nav>

<!-- Overlay for mobile -->
{#if isMobileMenuOpen}
	<div 
		class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
		on:click={toggleMobileMenu}
		transition:slide
	></div>
{/if}

<style>
	/* Custom scrollbar for navigation */
	nav::-webkit-scrollbar {
		width: 6px;
	}
	
	nav::-webkit-scrollbar-track {
		background: transparent;
	}
	
	nav::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}
	
	nav::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>

