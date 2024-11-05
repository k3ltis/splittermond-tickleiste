<script lang="ts">
	import { Minus, Hourglass, ClockAlert, Skull } from "lucide-svelte";
	import { _ } from "svelte-i18n";

	let modal: HTMLDialogElement;
	let resolveSelect: (value: number) => void;
	
	const tickNumbers: Array<number> = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
	];
	let negation: boolean = $state(false);

	export function show() {
		negation = false
		modal.showModal();

		// Return a new Promise and assign the resolver to `resolveSelect`
		return new Promise<number>((resolve) => {
			resolveSelect = resolve;
		});
	}

	function hide() {
		modal.close();
	}

	function select(ticks: number) {
		hide();
		let sign: number = negation ? -1 : 1;
		// Resolve the promise with the selected tick value
		resolveSelect(sign * ticks);
	}

	function toggleNegation() {
		negation = !negation;
	}

	function selectCombatantReadyState() {

	}

	function selectCombatantWaitingState() {
		
	}

	function selectCombatantDeathState() {
		
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal}>
	<div class="modal-box w-11/12 max-w-l border-4 border-accent">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>
		<h3 class="mb-5 text-2xl font-bold">{$_("tick_selection_modal_header")}</h3>
		<div class="grid grid-cols-5 gap-1">
			{#each tickNumbers as tickNumber}
				<button class="btn text-4xl w-full h-full aspect-square" onclick={() => select(tickNumber)}>{negation ? -tickNumber : tickNumber}</button>
			{/each}
			<div>
				<button class="btn w-full h-full aspect-square" class:btn-active={negation} onclick={() => toggleNegation()}>
					<Minus size={48}/>
				</button>
			</div>
			<div></div>
			<div>
				<button class="btn w-full h-full btn-outline btn-info" onclick={() => selectCombatantReadyState()}>
					<ClockAlert size={64}/>
				</button>
			</div>
			<div>
				<button class="btn w-full h-full btn-outline btn-info" onclick={() => selectCombatantWaitingState()}>
					<Hourglass size={64}/>
				</button>
			</div>
			<div>
				<button class="btn w-full h-full btn-outline btn-error" onclick={() => selectCombatantDeathState()}>
					<Skull size={64}/>
				</button>
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
