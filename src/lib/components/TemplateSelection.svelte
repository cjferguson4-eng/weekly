<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import { templates } from '$lib/mockData';
	import { Check, FileText } from 'lucide-svelte';
	import type { TemplateType } from '$lib/types';

	let selectedTemplate: TemplateType | null = null;

	function handleSelect(templateId: TemplateType) {
		selectedTemplate = templateId;
	}

	function handleBack() {
		appStore.setStep(2);
	}

	function handleNext() {
		if (selectedTemplate) {
			appStore.setTemplate(selectedTemplate);
			appStore.setStep(4);
		}
	}
</script>

<div class="max-w-5xl mx-auto">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
		<p class="text-gray-600">
			Select the format that best fits your executive reporting style
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
		{#each templates as template}
			<button
				class="card text-left hover:shadow-lg transition-all duration-200 cursor-pointer relative {selectedTemplate ===
				template.id
					? 'ring-2 ring-primary-600 shadow-lg'
					: ''}"
				on:click={() => handleSelect(template.id)}
			>
				{#if selectedTemplate === template.id}
					<div
						class="absolute top-4 right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"
					>
						<Check class="w-5 h-5 text-white" />
					</div>
				{/if}

				<div class="flex items-start gap-4 mb-4">
					<div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
						<FileText class="w-6 h-6 text-primary-600" />
					</div>
					<div>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
						<p class="text-sm text-gray-600">{template.description}</p>
					</div>
				</div>

				<div class="space-y-3 mt-6">
					<p class="text-sm font-semibold text-gray-700">Sections included:</p>
					{#each template.sections as section}
						<div class="bg-gray-50 rounded-lg p-3">
							<p class="text-sm font-medium text-gray-900">{section.title}</p>
							<p class="text-xs text-gray-600 mt-1">{section.description}</p>
						</div>
					{/each}
				</div>
			</button>
		{/each}
	</div>

	<!-- Navigation -->
	<div class="flex justify-between items-center">
		<button class="btn btn-secondary" on:click={handleBack}> Back </button>
		<button class="btn btn-primary px-8" on:click={handleNext} disabled={!selectedTemplate}>
			Continue
		</button>
	</div>
</div>

