<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore } from '$lib/stores/appStore';
	import { templates } from '$lib/mockData';
	import { Sparkles, Loader2, CheckCircle2 } from 'lucide-svelte';
	import type { AppState, WeeklyUpdate, UpdateSection } from '$lib/types';

	let appState: AppState;
	let isGenerating = false;
	let progress = 0;
	let currentStage = '';

	appStore.subscribe((state) => {
		appState = state;
	});

	const stages = [
		'Analyzing selected conversations...',
		'Processing meeting transcripts...',
		'Extracting key insights...',
		'Synthesizing information...',
		'Generating draft sections...',
		'Finalizing your update...'
	];

	async function generateDraft() {
		isGenerating = true;
		progress = 0;

		// Simulate AI generation with progress
		for (let i = 0; i < stages.length; i++) {
			currentStage = stages[i];
			progress = ((i + 1) / stages.length) * 100;
			await new Promise((resolve) => setTimeout(resolve, 1500));
		}

		// Generate mock draft content
		const template = templates.find((t) => t.id === appState.selectedTemplate);
		if (!template) return;

		const sections: UpdateSection[] = generateSections(template.id);

		const draft: WeeklyUpdate = {
			id: `draft-${Date.now()}`,
			createdAt: new Date(),
			updatedAt: new Date(),
			template: appState.selectedTemplate!,
			sections,
			status: 'draft'
		};

		appStore.setDraft(draft);
		isGenerating = false;

		// Move to review step after a short delay
		setTimeout(() => {
			appStore.setStep(5);
		}, 500);
	}

	function generateSections(templateId: string): UpdateSection[] {
		if (templateId === 'ai-adoption') {
			return [
				{
					id: 'incubation',
					title: 'Incubation Program',
					content: `**AI Feature Development Progress:**\n\nThis week we made significant strides in our AI feature development:\n\n• Completed the initial integration of GPT-4 into our core product workflow\n• Launched beta testing with 15 enterprise customers from our advisory board\n• Achieved 85% positive feedback on AI-generated suggestions\n• Identified and resolved 3 critical issues related to API rate limiting\n\n**Key Milestones:**\n\n✓ API integration completed ahead of schedule\n✓ Security review passed with no major findings\n✓ Performance benchmarks exceeded targets by 40%\n\nNext week's focus will be on expanding beta access to 50 additional customers and implementing the feedback loop mechanism.`
				},
				{
					id: 'usage-data',
					title: 'Usage Data',
					content: `**Adoption Metrics:**\n\n• **Weekly Active Users:** 12,456 (+23% WoW)\n• **AI Feature Adoption Rate:** 34% of eligible users\n• **Average Sessions per User:** 8.7 (+1.2 WoW)\n• **Feature Engagement Time:** 14.3 minutes per session\n\n**Key Insights:**\n\n📈 Enterprise customers show 2.5x higher adoption than SMB segment\n📈 Users who engage with AI features have 40% higher retention\n📈 Peak usage times: Tuesday-Thursday, 10 AM - 3 PM EST\n\n**Revenue Impact:**\n\n• AI feature tier represents $2.1M in ARR\n• 67% of trial users convert to paid AI tier\n• Average deal size increase of $15K when AI features are included`
				},
				{
					id: 'customer-engagement',
					title: 'Customer Engagement',
					content: `**Customer Conversations:**\n\nThis week I participated in several high-value customer interactions:\n\n**Acme Corp (Deal Value: $250K)**\n• Strong interest in AI integration capabilities\n• Raised important security and compliance questions\n• Requested custom integration with their internal systems\n• Action: Scheduled technical deep-dive for next week\n\n**GlobalTech Inc (Deal Value: $500K)**\n• Impressed with automation capabilities in product demo\n• Discussed scalability requirements for 10,000+ users\n• Interested in expanding to 3 additional departments\n• Next steps: Proposal for enterprise-wide deployment\n\n**MegaCorp QBR**\n• Usage increased 300% quarter-over-quarter\n• Expansion opportunity to 5 new departments\n• Feature requests: Advanced analytics dashboard, custom workflows\n• Relationship status: Strong, high renewal probability\n\n**Common Themes:**\n• Security and compliance remain top concerns\n• Strong demand for API customization\n• Integration with existing tools is critical for adoption`
				}
			];
		} else {
			// 4-box template
			return [
				{
					id: 'updates',
					title: 'Updates',
					content: `**Product Development:**\n\n✅ Shipped AI-powered automation feature to 100% of enterprise customers\n✅ Completed Q4 roadmap prioritization with engineering team\n✅ Launched customer advisory board program with 12 top accounts\n✅ Achieved 98.9% uptime for all critical services\n\n**Team & Process:**\n\n• Finalized hiring for 2 senior engineers - start date Nov 1\n• Implemented new sprint planning process, reducing cycle time by 20%\n• Updated product documentation and onboarding materials\n\n**Business Impact:**\n\n• Product-led growth initiatives drove 45 new signups this week\n• NPS score improved to 72 (+8 points from last quarter)\n• Feature adoption rate for new releases at 67%`
				},
				{
					id: 'customer-interactions',
					title: 'Customer Interactions',
					content: `**Key Conversations:**\n\n**Acme Corp** - Discovery call revealed $250K opportunity\n• Decision timeline: End of Q4\n• Key stakeholders identified and engaged\n• Primary concern: Security compliance (addressed)\n\n**GlobalTech Inc** - Product demo generated strong interest\n• $500K potential deal value\n• Technical requirements documented\n• Proposal due next week\n\n**MegaCorp** - Quarterly business review\n• Usage up 300% QoQ - excellent health signal\n• Expansion discussion for 5 new departments\n• Feature requests captured for roadmap consideration\n\n**StartupXYZ** - Technical implementation support\n• Successfully resolved integration challenges\n• Onboarding completion expected next week\n\n**Feedback Summary:**\n\n👍 Customers love: Speed, ease of use, AI capabilities\n📋 Most requested: Advanced analytics, custom integrations, mobile app`
				},
				{
					id: 'lowlights',
					title: 'Lowlights',
					content: `**Challenges & Blockers:**\n\n⚠️ **API Performance Issues:**\n• Experienced rate limiting during peak usage Tuesday afternoon\n• Impacted ~200 users for 45 minutes\n• Root cause identified: Third-party service throttling\n• Mitigation: Implemented request queuing, monitoring enhanced\n• Prevention: Negotiating higher rate limits with vendor\n\n⚠️ **Resource Constraints:**\n• Engineering team at 110% capacity with current sprint commitments\n• May need to deprioritize 2 features from Q4 roadmap\n• Discussed tradeoffs with leadership - decision pending\n\n⚠️ **Customer Escalation:**\n• Beta customer reported data sync issues with Salesforce integration\n• Working directly with customer success team on resolution\n• Temporary workaround provided, permanent fix in development\n\n**Risk Mitigation:**\n• Daily standups added for critical issues\n• Escalation path clarified with support team\n• Engineering resources being evaluated for reallocation`
				},
				{
					id: 'forward-looking',
					title: 'Forward Looking Priorities',
					content: `**Next Week's Focus:**\n\n🎯 **Priority 1: Beta Expansion**\n• Expand AI feature beta from 15 to 50 customers\n• Target: Enterprise accounts with >500 users\n• Success metric: 80% positive feedback maintained\n\n🎯 **Priority 2: Q4 Planning**\n• Finalize Q4 roadmap with adjusted scope\n• Present to executive team for approval\n• Communicate timeline updates to customers\n\n🎯 **Priority 3: Customer Commitments**\n• Deliver proposals to GlobalTech and Acme Corp\n• Complete technical deep-dive with Acme security team\n• MegaCorp expansion planning meeting\n\n🎯 **Priority 4: Technical Debt**\n• Address API performance improvements\n• Complete security audit requirements\n• Update documentation for new features\n\n**Key Metrics to Watch:**\n• Beta customer engagement rates\n• API performance and error rates\n• Customer satisfaction scores\n• Feature adoption velocity\n\n**Support Needed:**\n• Executive review of Q4 roadmap tradeoffs\n• Budget approval for additional engineering resources\n• Marketing support for beta program communications`
				}
			];
		}
	}

	function handleBack() {
		appStore.setStep(3);
	}

	onMount(() => {
		// Auto-start generation
		setTimeout(generateDraft, 500);
	});

	$: selectedDataCount =
		appState.selectedSlackConversations.length +
		appState.selectedZoomMeetings.length +
		appState.selectedChorusRecordings.length +
		appState.selectedGoogleSheets.length;
</script>

<div class="max-w-4xl mx-auto">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Generating Your Update</h2>
		<p class="text-gray-600">
			Our AI is analyzing {selectedDataCount} data source{selectedDataCount !== 1 ? 's' : ''} to create
			your weekly update
		</p>
	</div>

	<div class="card">
		<div class="flex flex-col items-center py-8">
			{#if isGenerating}
				<div class="mb-6">
					<Loader2 class="w-16 h-16 text-primary-600 animate-spin" />
				</div>

				<h3 class="text-lg font-semibold text-gray-900 mb-2">{currentStage}</h3>

				<!-- Progress Bar -->
				<div class="w-full max-w-md mt-6">
					<div class="bg-gray-200 rounded-full h-3 overflow-hidden">
						<div
							class="bg-primary-600 h-full transition-all duration-500 ease-out rounded-full"
							style="width: {progress}%"
						></div>
					</div>
					<p class="text-center text-sm text-gray-600 mt-2">{Math.round(progress)}% complete</p>
				</div>

				<!-- Data Sources Being Analyzed -->
				<div class="mt-8 w-full max-w-md">
					<p class="text-sm font-medium text-gray-700 mb-3">Analyzing:</p>
					<div class="space-y-2">
						{#if appState.selectedSlackConversations.length > 0}
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle2 class="w-4 h-4 text-green-600" />
								{appState.selectedSlackConversations.length} Slack conversation{appState.selectedSlackConversations.length !==
								1
									? 's'
									: ''}
							</div>
						{/if}
						{#if appState.selectedZoomMeetings.length > 0}
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle2 class="w-4 h-4 text-green-600" />
								{appState.selectedZoomMeetings.length} Zoom meeting{appState.selectedZoomMeetings.length !==
								1
									? 's'
									: ''}
							</div>
						{/if}
						{#if appState.selectedChorusRecordings.length > 0}
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle2 class="w-4 h-4 text-green-600" />
								{appState.selectedChorusRecordings.length} Chorus recording{appState.selectedChorusRecordings.length !==
								1
									? 's'
									: ''}
							</div>
						{/if}
						{#if appState.selectedGoogleSheets.length > 0}
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<CheckCircle2 class="w-4 h-4 text-green-600" />
								{appState.selectedGoogleSheets.length} Google Sheet{appState.selectedGoogleSheets.length !==
								1
									? 's'
									: ''}
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="mb-6">
					<CheckCircle2 class="w-16 h-16 text-green-600" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">Draft Complete!</h3>
				<p class="text-gray-600">Your weekly update is ready for review</p>
			{/if}
		</div>
	</div>

	<!-- Navigation -->
	<div class="flex justify-between items-center mt-8">
		<button class="btn btn-secondary" on:click={handleBack} disabled={isGenerating}> Back </button>
		<div class="flex items-center gap-2 text-sm text-gray-500">
			<Sparkles class="w-4 h-4 text-primary-600" />
			Powered by AI
		</div>
	</div>
</div>

