<script lang="ts">
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import TickSelection from './TickSelection.svelte';
	import ConditionSelection from './ConditionSelection.svelte';

	let modal: HTMLDialogElement;
	let tickSelection: TickSelection;

	export function show() {
		// negation = false;
		// sessionData.ticks = calculatePossibleTicks();
		modal.showModal();
		tickSelection.resetModal();
	}

	function onNotifyDone() {
		hide();
	}

	function hide() {
		modal.close();
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal}>
	<div
		id="tickSelectionModalInner"
		class="max-w-l modal-box min-h-[60%] w-11/12 border-4 border-accent"
	>
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
				<X size={24} />
			</button>
		</form>
		<div role="tablist" class="tabs tabs-lifted">
			<input
				type="radio"
				name="my_tabs_2"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				aria-label={$_('combatant_modal.actions')}
			/>
			<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
				<TickSelection bind:this={tickSelection} notifyDone={() => onNotifyDone()} />
			</div>

			<input
				type="radio"
				name="my_tabs_2"
				role="tab"
				class="tab h-12 text-2xl focus:outline-none focus:ring-0"
				aria-label={$_('combatant_modal.conditions')}
				checked={true}
			/>
			<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
				<ConditionSelection />
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
