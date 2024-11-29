<script lang="ts">
	import { _ } from 'svelte-i18n';
	import TickSelection from './TickSelection.svelte';
	import ConditionSelection from './ConditionSelection.svelte';
	import { X } from 'lucide-svelte';

	type Tab = 'actions' | 'conditions';

	let modal: HTMLDialogElement;
	let tickSelection: TickSelection;
	let selectedTab: Tab = 'actions';

	export function show(tab: Tab = 'actions') {
		selectedTab = tab;
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
		selectedTab = 'actions';
	}

	function selectTab(tab: Tab, event: MouseEvent) {
		event.preventDefault();
		selectedTab = tab;
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal}>
	<div
		id="tickSelectionModalInner"
		class="max-w-l modal-box min-h-[60%] w-11/12 border-4 border-accent pt-2"
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
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a
				href="#"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				onclick={(event) => selectTab('actions', event)}
				class:tab-active={selectedTab === 'actions'}
			>
				{$_('combatant_modal.actions')}
			</a>
			<div class="tab-content rounded-box border-base-300 bg-base-100 p-6" hidden={true}>
				<TickSelection bind:this={tickSelection} notifyDone={() => onNotifyDone()} />
			</div>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a
				href="#"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				onclick={(event) => selectTab('conditions', event)}
				class:tab-active={selectedTab === 'conditions'}
			>
				{$_('combatant_modal.conditions')}
			</a>
			<div class="tab-content rounded-box border-base-300 bg-base-100 p-6">
				<ConditionSelection />
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
