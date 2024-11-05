<script lang="ts">
	import {
		CombatState,
		moveCombatantByTicks,
		moveCombatantToTick,
		resetActiveCombatant,
		sceneData,
		sessionData,
		setCombatantCombatStateToDead,
		setCombatantCombatStateToExpecting,
		setCombatantCombatStateToWaiting,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import { Minus, Hourglass, ClockAlert, Skull, UserRound, X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { slide } from 'svelte/transition';

	let modal: HTMLDialogElement;
	type Tick = {
		number: number;
		hasCombatants: boolean;
	};
	let negation: boolean = $state(false);
	let ticks: Array<Tick> = $state([]);

	export function show() {
		negation = false;
		ticks = calculatePossibleTicks();
		modal.showModal();
	}

	function hide() {
		modal.close();
	}

	function select(ticks: number) {
		hide();
		if (sessionData.activeCombatant) {
			if (sessionData.activeCombatant.combatState === CombatState.Active) {
				let sign: number = negation ? -1 : 1;
				moveCombatantByTicks(sessionData.activeCombatant, sign * ticks);
			} else {
				moveCombatantToTick(sessionData.activeCombatant, ticks);
			}
			resetActiveCombatant();
		}
	}

	function toggleNegation() {
		negation = !negation;
		ticks = calculatePossibleTicks();
	}

	function calculatePossibleTicks(): Array<Tick> {
		const activeCombatant = sessionData.activeCombatant;
		if (activeCombatant) {
			if (activeCombatant.combatState === CombatState.Active) {
				return getRelativeTicks(negation, activeCombatant.initiative, sceneData.combatants);
			} else {
				return getAbsoluteTicks();
			}
		}
		return [];
	}

	function selectCombatStateExpecting() {
		hide();
		if (!sessionData.activeCombatant) {
			return;
		}
		// const activeCombatant = sessionData.activeCombatant
		// if (sceneData.combatants.some(c => c.initiative < activeCombatant.initiative)) {

		// } else {
		// 	sessionData.mostRecentTick = activeCombatant.initiative;
		// }
		// sessionData.mostRecentTick = sessionData.activeCombatant.initiative;
		// sessionData.activeCombatant.combatState = CombatState.Expecting;
		setCombatantCombatStateToExpecting(sessionData.activeCombatant);
		resetActiveCombatant();
	}

	function selectCombatStateWaiting() {
		hide();
		if (!sessionData.activeCombatant) {
			return;
		}
		setCombatantCombatStateToWaiting(sessionData.activeCombatant);
		// sessionData.mostRecentTick = sessionData.activeCombatant.initiative;
		// sessionData.activeCombatant.combatState = CombatState.Waiting;
		resetActiveCombatant();
	}

	function selectCombatStateDead() {
		hide();
		if (!sessionData.activeCombatant) {
			return;
		}
		// sessionData.activeCombatant.combatState = CombatState.Dead;
		setCombatantCombatStateToDead(sessionData.activeCombatant);
		resetActiveCombatant();
	}

	// $effect(() => {
	// 	if (negation) {

	// 	} else {
	// 		ticks = untrack(() => getRelativeTicks());
	// 	}
	// })

	// $effect(() => {
	// 	const activeCombatant = sessionData.activeCombatant
	// 	if (!activeCombatant) {
	// 		return
	// 	} else if (activeCombatant.combatState === CombatState.Active) {
	// 		// ticks = untrack(() => getRelativeTicks(activeCombatant.initiative, sceneData.combatants));
	// 	} else {
	// 		const firstPossibleTick = sessionData.mostRecentTick;
	// 		const lastPossibleTick = Math.min(
	// 			...sceneData.combatants
	// 				.filter((c) => c !== sessionData.activeCombatant && c.combatState === CombatState.Active)
	// 				.map((c) => c.initiative)
	// 		);
	// 		if (firstPossibleTick > lastPossibleTick) {
	// 			console.error(
	// 				`firstPossibleTick (${firstPossibleTick}) must not be greater than lastPossibleTick (${lastPossibleTick})`
	// 			);
	// 			return;
	// 		}
	// 		if (firstPossibleTick === Infinity || lastPossibleTick === Infinity) {
	// 			return;
	// 		}
	// 		const effectiveTicks = [];
	// 		for (let i = firstPossibleTick; i <= lastPossibleTick; i++) {
	// 			effectiveTicks.push({
	// 				number: i,
	// 				hasCombatants: sceneData.combatants.some(
	// 					(c) => c.initiative === i && c.id !== sessionData.activeCombatant?.id
	// 				)
	// 			});
	// 		}
	// 		ticks = effectiveTicks;
	// 	}
	// });

	function getAbsoluteTicks(): Array<Tick> {
		// determine last (largest) possible tick
		let lastPossibleTick: number;
		const validInitiatives = sceneData.combatants
			.filter((c) => c !== sessionData.activeCombatant && c.combatState === CombatState.Active)
			.map((c) => c.initiative);
		if (validInitiatives.length === 0) {
			// Fallback when all combatants are in waiting, expecting, or dead
			lastPossibleTick = sessionData.mostRecentTick || 0;
		} else {
			lastPossibleTick = Math.min(...validInitiatives);
		}
		console.log(`lastPossibleTick: ${lastPossibleTick}`);

		// determine first (smallest) possible tick
		const firstPossibleTick = sessionData.mostRecentTick;
		console.log(`firstPossibleTick: ${firstPossibleTick}`);

		return [
			{
				number: 1,
				hasCombatants: false
			}
		];
	}

	function getRelativeTicks(
		negation: boolean,
		comparisonInitiative: number,
		combatants: Array<Combatant>
	): Array<Tick> {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((number) => {
			const effectiveNumber = negation ? -number : number;
			return {
				number: effectiveNumber,
				hasCombatants: tickNumberHasCombatantsAssigned(
					effectiveNumber,
					comparisonInitiative,
					combatants
				)
			};
		});
	}

	function tickNumberHasCombatantsAssigned(
		tickNumber: number,
		comparisonInitiative: number,
		combatants: Array<Combatant>
	): boolean {
		let relativeInitiatives: Array<number> = [];
		relativeInitiatives = combatants.map((c: Combatant) => c.initiative - comparisonInitiative);
		return relativeInitiatives.includes(tickNumber);
	}
</script>

<dialog id="tickSelectionModal" class="modal" bind:this={modal}>
	<div class="max-w-l modal-box w-11/12 border-4 border-accent">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
				<X size={24} />
			</button>
		</form>
		<h3 class="mb-5 text-2xl font-bold">
			{$_('tick_selection_modal_header', {
				values: { combatantName: sessionData.activeCombatant?.name }
			})} ({sessionData.activeCombatant?.initiative})
		</h3>
		<div class="grid grid-cols-5 gap-1">
			{#each ticks as tick}
				<button
					class="btn relative aspect-square h-full w-full text-4xl"
					onclick={() => select(tick.number)}
				>
					{#if negation}
						<div class="absolute {tick.number <= 9 && tick.number >= -9 ? 'left-4' : 'left-2'}">
							-
						</div>
						{-tick.number}
					{:else}
						{tick.number}
					{/if}

					<!-- {negation ? -tickNumber : tickNumber} -->
					{#if tick.hasCombatants}
						<div class="absolute bottom-1 right-1" transition:slide>
							<UserRound class="text-accent" />
						</div>
					{/if}
				</button>
			{/each}
		</div>
		<div class="mt-1 grid grid-cols-5 gap-1">
			<div>
				{#if sessionData.activeCombatant?.combatState === CombatState.Active}
					<div class="tooltip aspect-square h-full w-full" data-tip={$_('tickselection.tooltip.negation')}>
						<button
							class="btn h-full w-full"
							class:btn-active={negation}
							onclick={() => toggleNegation()}
						>
							<Minus size={48} />
						</button>
					</div>
				{/if}
			</div>
			<div></div>
			<div>
				{#if sessionData.activeCombatant?.combatState !== CombatState.Expecting}
					<div
						class="tooltip aspect-square h-full w-full"
						data-tip={$_('tickselection.tooltip.set_state_expecting')}
					>
						<button
							class="btn btn-outline btn-info aspect-square h-full w-full"
							onclick={() => selectCombatStateExpecting()}
						>
							<ClockAlert size={48} strokeWidth={1} />
						</button>
					</div>
				{/if}
			</div>
			<div>
				{#if sessionData.activeCombatant?.combatState !== CombatState.Waiting}
					<div
						class="tooltip aspect-square h-full w-full"
						data-tip={$_('tickselection.tooltip.set_state_waiting')}
					>
						<button
							class="btn btn-outline btn-info aspect-square h-full w-full"
							onclick={() => selectCombatStateWaiting()}
						>
							<Hourglass size={48} strokeWidth={1} />
						</button>
					</div>
				{/if}
			</div>
			<div>
				{#if sessionData.activeCombatant?.combatState !== CombatState.Dead}
					<div
						class="tooltip aspect-square h-full w-full"
						data-tip={$_('tickselection.tooltip.set_state_dead')}
					>
						<button
							class="btn btn-outline btn-error aspect-square h-full w-full"
							onclick={() => selectCombatStateDead()}
						>
							<Skull size={48} strokeWidth={1} />
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
