<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { appStore } from '$lib/stores/appStore';

	export let isOpen = false;

	interface Message {
		role: 'user' | 'assistant';
		content: string;
		toolCalls?: Array<{ name: string; args: any; result: any }>;
	}

	let messages: Message[] = [];
	let input = '';
	let loading = false;
	let chatContainer: HTMLDivElement;

	// Welcome message
	$: if (isOpen && messages.length === 0) {
		messages = [
			{
				role: 'assistant',
				content: "👋 Hi! I'm your Weekly Update Assistant. I can help you connect to data sources, navigate the workflow, and manage your weekly updates. What would you like to do?"
			}
		];
	}

	async function sendMessage() {
		if (!input.trim() || loading) return;

		const userMessage = input.trim();
		input = '';

		// Add user message
		messages = [...messages, { role: 'user', content: userMessage }];
		loading = true;

		// Scroll to bottom
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: messages.map(m => ({
						role: m.role,
						content: m.content
					}))
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			const data = await response.json();

			// Handle navigation tool calls
			if (data.toolCalls) {
				for (const toolCall of data.toolCalls) {
					if (toolCall.name === 'navigate_to_step' && toolCall.result.success) {
						appStore.setStep(toolCall.result.step);
					}
					if (toolCall.name === 'connect_data_source' && toolCall.result.success) {
						appStore.connectDataSource(toolCall.args.source);
					}
				}
			}

			// Add assistant response
			messages = [
				...messages,
				{
					role: 'assistant',
					content: data.message,
					toolCalls: data.toolCalls
				}
			];
		} catch (error) {
			messages = [
				...messages,
				{
					role: 'assistant',
					content: '❌ Sorry, I encountered an error. Please try again.'
				}
			];
		} finally {
			loading = false;
			setTimeout(() => {
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}, 100);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function clearChat() {
		messages = [];
	}
</script>

{#if isOpen}
	<div
		class="fixed right-4 bottom-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
		transition:fly={{ x: 100, duration: 300 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
					🤖
				</div>
				<div>
					<h3 class="font-semibold text-white">AI Assistant</h3>
					<p class="text-xs text-blue-100">Powered by GPT-4</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				{#if messages.length > 1}
					<button
						on:click={clearChat}
						class="p-2 hover:bg-white/20 rounded-lg transition-colors"
						title="Clear chat"
					>
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				{/if}
				<button
					on:click={() => (isOpen = false)}
					class="p-2 hover:bg-white/20 rounded-lg transition-colors"
				>
					<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Messages -->
		<div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-4">
			{#each messages as message (message)}
				<div
					class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
					transition:fade={{ duration: 200 }}
				>
					<div
						class="max-w-[80%] rounded-2xl px-4 py-2 {message.role === 'user'
							? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
							: 'bg-gray-100 text-gray-800 rounded-bl-none'}"
					>
						<p class="text-sm whitespace-pre-wrap">{message.content}</p>
						
						{#if message.toolCalls && message.toolCalls.length > 0}
							<div class="mt-2 pt-2 border-t border-gray-300/30">
								{#each message.toolCalls as toolCall}
									<div class="text-xs opacity-75 flex items-center gap-1 mt-1">
										<span>🔧</span>
										<span>{toolCall.name}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}

			{#if loading}
				<div class="flex justify-start" transition:fade>
					<div class="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
						<div class="flex space-x-2">
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
							<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="p-4 border-t border-gray-200">
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={input}
					on:keydown={handleKeyDown}
					placeholder="Ask me anything..."
					disabled={loading}
					class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				<button
					on:click={sendMessage}
					disabled={!input.trim() || loading}
					class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
					</svg>
				</button>
			</div>
			<p class="text-xs text-gray-500 mt-2 text-center">
				Press Enter to send, Shift+Enter for new line
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
	
	.animate-bounce {
		animation: bounce 1s infinite;
	}
</style>

