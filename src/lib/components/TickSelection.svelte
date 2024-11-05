<script lang="ts">
	import { CombatState, sceneData, sessionData, type Combatant } from '$lib/state/scene_data.svelte';
	import { Minus, Hourglass, ClockAlert, Skull, UserRound } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { slide } from 'svelte/transition';

	let modal: HTMLDialogElement;
	let resolveSelect: (value: number) => void;

	const tickNumbers: Array<number> = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
	];
	let negation: boolean = $state(false);

	export function show() {
		negation = false;

		sceneData.combatants;

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

	function setCombatStateToExpecting() {
		if (!sessionData.activeCombatant) {
			return
		}
		sessionData.activeCombatant.combatState = CombatState.Expecting
	}
	
	function setCombatStateToWaiting() {
		if (!sessionData.activeCombatant) {
			return
		}
		sessionData.activeCombatant.combatState = CombatState.Waiting

	}

	function setCombatStateToDead() {
		if (!sessionData.activeCombatant) {
			return
		}
		sessionData.activeCombatant.combatState = CombatState.Dead

	}

	function tickNumberHasCombatantsAssigned(tickNumber: number): boolean {
		if (!sessionData.activeCombatant) {
			return false;
		}

		const comparisonInitiative = sessionData.activeCombatant.initiative;
		let relativeInitiatives: Array<number> = [];
		if (negation) {
			relativeInitiatives = sceneData.combatants.map(
				(c: Combatant) => comparisonInitiative - c.initiative
			);
			console.log(relativeInitiatives);
		} else {
			relativeInitiatives = sceneData.combatants.map(
				(c: Combatant) => c.initiative - comparisonInitiative
			);
			console.log(relativeInitiatives);
		}
		return relativeInitiatives.includes(tickNumber);
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal}>
	<div class="max-w-l modal-box w-11/12 border-4 border-accent">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>
		<h3 class="mb-5 text-2xl font-bold">{$_('tick_selection_modal_header', { values: { combatantName: sessionData.activeCombatant?.name}})}</h3>
		<div class="grid grid-cols-5 gap-1">
			{#each tickNumbers as tickNumber}
				<button
					class="btn relative aspect-square h-full w-full text-4xl"
					onclick={() => select(tickNumber)}
				>
					{#if negation}
						<div class="absolute {tickNumber <= 9 ? "left-4" :  "left-2.5"}">-</div>
					{/if}
					{tickNumber}
					<!-- {negation ? -tickNumber : tickNumber} -->
					{#if tickNumberHasCombatantsAssigned(tickNumber)}
						<div class="absolute bottom-1 right-1" transition:slide>
							<UserRound class="text-accent" />
						</div>
					{/if}
				</button>
			{/each}
			<div>
				<button
					class="btn aspect-square h-full w-full"
					class:btn-active={negation}
					onclick={() => toggleNegation()}
				>
					<Minus size={48} />
				</button>
			</div>
			<div></div>
			<div>
				<button
					class="btn btn-outline btn-info h-full w-full"
					onclick={() => setCombatStateToExpecting()}
				>
					<ClockAlert size={64} strokeWidth={1} />
				</button>
			</div>
			<div>
				<button
					class="btn btn-outline btn-info h-full w-full"
					onclick={() => setCombatStateToWaiting()}
				>
					<Hourglass size={64} strokeWidth={1} />
				</button>
			</div>
			<div>
				<button
					class="btn btn-outline btn-error h-full w-full"
					onclick={() => setCombatStateToDead()}
				>
					<Skull size={64} strokeWidth={1} />
				</button>
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
