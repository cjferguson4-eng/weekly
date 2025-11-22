<script lang="ts">
	import { MessageSquare, Users, Calendar } from 'lucide-svelte';
	import type { SlackConversation } from '$lib/types';

	export let conversations: SlackConversation[];

	function toggleSelection(id: string) {
		conversations = conversations.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c));
	}

	function selectAll() {
		conversations = conversations.map((c) => ({ ...c, selected: true }));
	}

	function deselectAll() {
		conversations = conversations.map((c) => ({ ...c, selected: false }));
	}

	$: selectedCount = conversations.filter((c) => c.selected).length;
</script>

<div>
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-semibold text-gray-900">
			Slack Conversations ({selectedCount} selected)
		</h3>
		<div class="flex gap-2">
			<button class="btn btn-ghost text-sm" on:click={selectAll}>Select All</button>
			<button class="btn btn-ghost text-sm" on:click={deselectAll}>Clear All</button>
		</div>
	</div>

	<div class="space-y-3">
		{#each conversations as conversation}
			<label
				class="card hover:shadow-md transition-all duration-200 cursor-pointer flex items-start gap-4 {conversation.selected
					? 'ring-2 ring-primary-500'
					: ''}"
			>
				<input
					type="checkbox"
					class="checkbox mt-1"
					checked={conversation.selected}
					on:change={() => toggleSelection(conversation.id)}
				/>
				<div class="flex-1 min-w-0">
					<div class="flex items-start justify-between gap-4 mb-2">
						<div class="flex items-center gap-2 min-w-0">
							<MessageSquare class="w-5 h-5 text-primary-600 flex-shrink-0" />
							<h4 class="font-semibold text-gray-900 truncate">{conversation.name}</h4>
							<span
								class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 capitalize flex-shrink-0"
							>
								{conversation.type}
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-600 mb-3 line-clamp-2">{conversation.preview}</p>
					<div class="flex items-center gap-4 text-xs text-gray-500">
						<span class="flex items-center gap-1">
							<Users class="w-3 h-3" />
							{conversation.participants.length} participants
						</span>
						<span class="flex items-center gap-1">
							<MessageSquare class="w-3 h-3" />
							{conversation.messageCount} messages
						</span>
						<span class="flex items-center gap-1">
							<Calendar class="w-3 h-3" />
							{conversation.lastMessage.toLocaleDateString()}
						</span>
					</div>
				</div>
			</label>
		{/each}
	</div>
</div>

