<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import { Copy, Download, CheckCircle2, Edit3, RotateCcw } from 'lucide-svelte';
	import type { WeeklyUpdate, UpdateSection } from '$lib/types';

	let draft: WeeklyUpdate | null = null;
	let editingSection: string | null = null;
	let copiedToClipboard = false;

	appStore.subscribe((state) => {
		draft = state.currentDraft;
	});

	function handleEdit(sectionId: string) {
		editingSection = sectionId;
	}

	function handleSaveSection(sectionId: string) {
		editingSection = null;
		if (draft) {
			appStore.setDraft({ ...draft, updatedAt: new Date(), status: 'review' });
		}
	}

	function handleCopy() {
		if (!draft) return;

		const text = draft.sections.map((s) => `${s.title}\n${'='.repeat(s.title.length)}\n\n${s.content}`).join('\n\n\n');

		navigator.clipboard.writeText(text).then(() => {
			copiedToClipboard = true;
			setTimeout(() => {
				copiedToClipboard = false;
			}, 2000);
		});
	}

	function handleDownload() {
		if (!draft) return;

		const text = `Weekly Update - ${draft.createdAt.toLocaleDateString()}\n\n${draft.sections.map((s) => `${s.title}\n${'='.repeat(s.title.length)}\n\n${s.content}`).join('\n\n\n')}`;

		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `weekly-update-${draft.createdAt.toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function handleStartOver() {
		appStore.reset();
		appStore.setStep(1);
	}

	function handleBack() {
		appStore.setStep(4);
	}
</script>

<div class="max-w-5xl mx-auto">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Review Your Update</h2>
		<p class="text-gray-600">
			Review, edit, and finalize your weekly update before sharing with your team
		</p>
	</div>

	{#if draft}
		<!-- Action Buttons -->
		<div class="flex flex-wrap gap-3 mb-6 justify-end">
			<button class="btn btn-secondary flex items-center gap-2" on:click={handleCopy}>
				{#if copiedToClipboard}
					<CheckCircle2 class="w-4 h-4" />
					Copied!
				{:else}
					<Copy class="w-4 h-4" />
					Copy to Clipboard
				{/if}
			</button>
			<button class="btn btn-secondary flex items-center gap-2" on:click={handleDownload}>
				<Download class="w-4 h-4" />
				Download
			</button>
		</div>

		<!-- Draft Sections -->
		<div class="space-y-6 mb-8">
			{#each draft.sections as section}
				<div class="card">
					<div class="flex items-start justify-between mb-4">
						<h3 class="text-xl font-bold text-gray-900">{section.title}</h3>
						{#if editingSection === section.id}
							<button
								class="btn btn-primary btn-sm flex items-center gap-1"
								on:click={() => handleSaveSection(section.id)}
							>
								<CheckCircle2 class="w-4 h-4" />
								Save
							</button>
						{:else}
							<button
								class="btn btn-ghost btn-sm flex items-center gap-1"
								on:click={() => handleEdit(section.id)}
							>
								<Edit3 class="w-4 h-4" />
								Edit
							</button>
						{/if}
					</div>

					{#if editingSection === section.id}
						<textarea
							bind:value={section.content}
							class="input min-h-[300px] font-mono text-sm"
							placeholder="Edit your content..."
						/>
					{:else}
						<div class="prose prose-sm max-w-none">
							{@html section.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/• /g, '• ').replace(/✓ /g, '✓ ').replace(/⚠️ /g, '⚠️ ').replace(/🎯 /g, '🎯 ').replace(/📈 /g, '📈 ').replace(/👍 /g, '👍 ').replace(/📋 /g, '📋 ')}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Metadata -->
		<div class="card bg-gray-50 mb-8">
			<div class="flex items-center justify-between text-sm text-gray-600">
				<div>
					<p>
						<span class="font-medium">Created:</span>
						{draft.createdAt.toLocaleString()}
					</p>
					<p>
						<span class="font-medium">Last Updated:</span>
						{draft.updatedAt.toLocaleString()}
					</p>
				</div>
				<div>
					<p>
						<span class="font-medium">Template:</span>
						{draft.template === 'ai-adoption' ? 'AI Adoption' : '4-Box'}
					</p>
					<p>
						<span class="font-medium">Status:</span>
						<span class="capitalize">{draft.status}</span>
					</p>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex justify-between items-center">
			<button class="btn btn-secondary flex items-center gap-2" on:click={handleStartOver}>
				<RotateCcw class="w-4 h-4" />
				Start Over
			</button>
			<div class="flex gap-3">
				<button class="btn btn-secondary" on:click={handleBack}> Back </button>
				<button class="btn btn-primary px-8 flex items-center gap-2" on:click={handleCopy}>
					<CheckCircle2 class="w-4 h-4" />
					Finalize & Copy
				</button>
			</div>
		</div>
	{:else}
		<div class="card text-center py-12">
			<p class="text-gray-600">No draft available. Please generate a draft first.</p>
			<button class="btn btn-primary mt-4" on:click={() => appStore.setStep(4)}>
				Generate Draft
			</button>
		</div>
	{/if}
</div>

