<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import Navigation from '$lib/components/Navigation.svelte';
	import ChatAssistant from '$lib/components/ChatAssistant.svelte';
	import StepIndicator from '$lib/components/StepIndicator.svelte';
	import DataSourceConnection from '$lib/components/DataSourceConnection.svelte';
	import DataSelection from '$lib/components/DataSelection.svelte';
	import TemplateSelection from '$lib/components/TemplateSelection.svelte';
	import DraftGeneration from '$lib/components/DraftGeneration.svelte';
	import DraftReview from '$lib/components/DraftReview.svelte';

	let currentStep = 1;
	let dataSources: any[] = [];
	let chatOpen = false;
	
	appStore.subscribe((state) => {
		currentStep = state.currentStep;
		dataSources = state.dataSources;
	});

	const steps = [
		{ number: 1, title: 'Connect Sources', description: 'Link your data sources' },
		{ number: 2, title: 'Select Data', description: 'Choose conversations & meetings' },
		{ number: 3, title: 'Choose Template', description: 'Select update format' },
		{ number: 4, title: 'Generate Draft', description: 'AI creates your update' },
		{ number: 5, title: 'Review & Edit', description: 'Finalize your update' }
	];
</script>

<!-- Navigation Sidebar -->
<Navigation {currentStep} {dataSources} />

<!-- Main Content Area -->
<div class="lg:ml-72 transition-all duration-300">
<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Header -->
	<header class="mb-12 text-center">
		<h1 class="text-4xl font-bold text-gray-900 mb-3">
			Weekly
		</h1>
		<p class="text-lg text-gray-600">
			Your AI-powered assistant for creating executive updates in minutes
		</p>
	</header>

	<!-- Step Indicator -->
	<div class="mb-12">
		<StepIndicator {steps} {currentStep} />
	</div>

	<!-- Main Content -->
	<main class="mb-8">
		{#if currentStep === 1}
			<DataSourceConnection />
		{:else if currentStep === 2}
			<DataSelection />
		{:else if currentStep === 3}
			<TemplateSelection />
		{:else if currentStep === 4}
			<DraftGeneration />
		{:else if currentStep === 5}
			<DraftReview />
		{/if}
	</main>

	<!-- Footer -->
	<footer class="text-center text-sm text-gray-500 py-8">
	</footer>
</div>
</div>

<!-- AI Chat Assistant -->
<ChatAssistant bind:isOpen={chatOpen} />

<!-- Floating Chat Button -->
{#if !chatOpen}
	<button
		on:click={() => (chatOpen = true)}
		class="fixed right-4 bottom-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
		aria-label="Open AI Assistant"
	>
		<div class="relative">
			<span class="text-2xl">🤖</span>
			<span class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
		</div>
		<span class="absolute right-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
			Ask AI Assistant
		</span>
	</button>
{/if}

