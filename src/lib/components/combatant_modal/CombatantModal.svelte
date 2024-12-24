<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TickSelection from './TickSelection.svelte';
	import ConditionSelection from './ConditionSelection.svelte';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { addAccesibleBehaviourToTabs } from '$lib/utility/html_tab_element_extension';
	import { assertNever } from '$lib/utility/assert_never';
	import { sessionData } from '$lib/state/scene_data.svelte';

	type Tab = 'actions' | 'conditions';

	let modal: HTMLDialogElement;
	let tickSelection: TickSelection;
	// svelte-ignore non_reactive_update
	let tabButtonTicks: HTMLButtonElement;
	// svelte-ignore non_reactive_update
	let tabButtonConditions: HTMLButtonElement;

	let isModalOpen: boolean = $state(false);

	export function show(tab: Tab = 'actions') {
		selectTab(tab);
		modal.showModal();
		isModalOpen = true;
		tickSelection.resetModal();
	}

	function onNotifyDone() {
		hide();
		resetActiveTab();
	}

	function hide() {
		modal.close();
		resetActiveTab();
	}

	function resetActiveTab() {
		selectTab('actions');
	}

	function selectTab(tab: Tab) {
		switch (tab) {
			case 'actions':
				tabButtonTicks.ariaSelected = 'true';
				tabButtonConditions.ariaSelected = 'false';
				break;
			case 'conditions':
				tabButtonTicks.ariaSelected = 'false';
				tabButtonConditions.ariaSelected = 'true';
				break;
			default:
				assertNever(tab);
		}
	}

	onMount(() => {
		addAccesibleBehaviourToTabs();
	});
</script>

<dialog
	id="tickSelectionModal"
	class="modal"
	class:hidden={!isModalOpen}
	bind:this={modal}
	onclose={() => (isModalOpen = false)}
>
	<div
		id="tickSelectionModalInner"
		class="max-w-l modal-box min-h-[50%] w-11/12 border-4 border-primary p-0"
	>
		<h3 id="tablist-for-combatant" class="sr-only">
			{$_('combatant_interaction_modal', { values: { name: sessionData.activeCombatant?.name } })}
		</h3>
		<div role="tablist" class="tabs-boxed tabs p-0" aria-labelledby="tablist-for-combatant">
			<button
				bind:this={tabButtonTicks}
				role="tab"
				id="tab-tick-selection"
				class="tab m-2 me-1 h-12 text-xl"
				aria-controls="tabpanel-tick-selection"
				aria-selected="true"
				class:tab-active={tabButtonTicks?.ariaSelected === 'actions'}
			>
				{$_('combatant_modal.actions')}
			</button>
			<div
				class="tab-content min-w-full border-r-0 border-none bg-base-100 p-3 md:p-6"
				id="tabpanel-tick-selection"
				role="tabpanel"
				tabindex="0"
				aria-labelledby="tab-tick-selection"
			>
				<TickSelection bind:this={tickSelection} notifyDone={() => onNotifyDone()} />
			</div>
			<button
				bind:this={tabButtonConditions}
				role="tab"
				id="tab-condition-selection"
				class="tab m-2 me-1 ms-0 h-12 text-xl"
				tabindex="-1"
				aria-controls="tabpanel-condition-selection"
				aria-selected="false"
				class:tab-active={tabButtonConditions?.ariaSelected === 'conditions'}
			>
				{$_('combatant_modal.conditions')}
			</button>
			<div
				class="tab-content min-w-full border-r-0 border-none bg-base-100 p-3 md:p-6"
				id="tabpanel-condition-selection"
				role="tabpanel"
				tabindex="0"
				aria-labelledby="tab-condition-selection"
			>
				<ConditionSelection />
			</div>
		</div>
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
