<script lang="ts">
	import { Check } from 'lucide-svelte';

	export let steps: Array<{ number: number; title: string; description: string }>;
	export let currentStep: number;
</script>

<div class="flex items-center justify-between max-w-4xl mx-auto">
	{#each steps as step, index}
		<div class="flex items-center flex-1">
			<!-- Step Circle -->
			<div class="flex flex-col items-center relative">
				<div
					class="w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 {currentStep >
					step.number
						? 'bg-primary-600 text-white'
						: currentStep === step.number
							? 'bg-primary-600 text-white ring-4 ring-primary-200'
							: 'bg-gray-200 text-gray-500'}"
				>
					{#if currentStep > step.number}
						<Check class="w-6 h-6" />
					{:else}
						{step.number}
					{/if}
				</div>
				<div class="mt-3 text-center">
					<p
						class="text-sm font-medium {currentStep === step.number
							? 'text-gray-900'
							: 'text-gray-500'}"
					>
						{step.title}
					</p>
					<p class="text-xs text-gray-400 mt-1">{step.description}</p>
				</div>
			</div>

			<!-- Connector Line -->
			{#if index < steps.length - 1}
				<div class="flex-1 h-0.5 mx-4 -mt-16 {currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'}"></div>
			{/if}
		</div>
	{/each}
</div>

