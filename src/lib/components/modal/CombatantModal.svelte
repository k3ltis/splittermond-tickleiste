<script lang="ts">
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import TickSelection from './TickSelection.svelte';
	import ConditionSelection from './ConditionSelection.svelte';

	type Tab = 'actions' | 'conditions'

	let modal: HTMLDialogElement;
	let tickSelection: TickSelection;
	let selectedTab: Tab = 'actions'

	export function show(tab: Tab = 'actions') {
		selectedTab = tab
		modal.showModal();
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
		selectedTab = 'actions'
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal} >
	<div
		id="tickSelectionModalInner"
		class="max-w-l modal-box min-h-[60%] w-11/12 border-4 border-accent"
	>
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
		<div role="tablist" class="tabs tabs-lifted">
			<input
				type="radio"
				name="my_tabs_2"
				value="actions"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				aria-label={$_('combatant_modal.actions')}
				bind:group={selectedTab}
				checked={true}
			/>
			<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
				<TickSelection bind:this={tickSelection} notifyDone={() => onNotifyDone()} />
			</div>

			<input
				type="radio"
				name="my_tabs_2"
				value="conditions"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				aria-label={$_('combatant_modal.conditions')}
				bind:group={selectedTab}
			/>
			<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
				<ConditionSelection />
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
