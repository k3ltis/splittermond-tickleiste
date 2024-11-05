<script lang="ts">
	import {
		CombatState,
		sceneData,
		sessionData,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import { Minus, Hourglass, ClockAlert, Skull, UserRound } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { slide } from 'svelte/transition';

	let modal: HTMLDialogElement;
	const DEFAULT_TICK_NUMBERS: Array<number> = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
	];
	type Tick = {
		number: number;
		hasCombatants: boolean;
	};
	let ticks: Array<Tick> = $state(getDefaultTicks());
	let negation: boolean = $state(false);

	$effect(() => {
		console.log('before mysterious effect');

		if (sessionData.activeCombatant?.combatState === CombatState.Active) {
			ticks = getDefaultTicks();
		} else {
			const firstPossibleTick = sessionData.mostRecentTick;
			const lastPossibleTick = Math.min(
				...sceneData.combatants
					.filter((c) => c !== sessionData.activeCombatant && c.combatState === CombatState.Active)
					.map((c) => c.initiative)
			);
			if (firstPossibleTick > lastPossibleTick) {
				console.error(
					`firstPossibleTick (${firstPossibleTick}) must not be greater than lastPossibleTick (${lastPossibleTick})`
				);
				return;
			}
			if (firstPossibleTick === Infinity || lastPossibleTick === Infinity) {
				return;
			}
			const effectiveTicks = [];
			for (let i = firstPossibleTick; i <= lastPossibleTick; i++) {
				effectiveTicks.push({
					number: i,
					hasCombatants: sceneData.combatants.some(
						(c) => c.initiative === i && c.id !== sessionData.activeCombatant?.id
					)
				});
			}
			ticks = effectiveTicks;
		}

		console.log('after mysterious effect');
	});

	export function show() {
		negation = false;
		modal.showModal();
	}

	function hide() {
		modal.close();
	}

	function select(ticks: number) {
		hide();
		let sign: number = negation ? -1 : 1;
		if (sessionData.activeCombatant) {
			sessionData.mostRecentTick = sessionData.activeCombatant.initiative;
			sessionData.activeCombatant.initiative += sign * ticks;
			sortCombatantsByInitiative(sessionData.activeCombatant);
		}
	}

	function toggleNegation() {
		negation = !negation;
	}

	function setCombatStateToExpecting() {
		if (!sessionData.activeCombatant) {
			return;
		}
		sessionData.mostRecentTick = sessionData.activeCombatant.initiative;
		sessionData.activeCombatant.combatState = CombatState.Expecting;
	}

	function setCombatStateToWaiting() {
		if (!sessionData.activeCombatant) {
			return;
		}
		sessionData.mostRecentTick = sessionData.activeCombatant.initiative;
		sessionData.activeCombatant.combatState = CombatState.Waiting;
	}

	function setCombatStateToDead() {
		if (!sessionData.activeCombatant) {
			return;
		}
		sessionData.activeCombatant.combatState = CombatState.Dead;
	}

	function getDefaultTicks(): Array<Tick> {
		// const allInitiatives = sceneData.combatants.map(c => c.initiative);
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((number) => {
			return {
				number,
				hasCombatants: tickNumberHasCombatantsAssigned(number)
			};
		});
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
			// console.log(relativeInitiatives);
		} else {
			relativeInitiatives = sceneData.combatants.map(
				(c: Combatant) => c.initiative - comparisonInitiative
			);
			// console.log(relativeInitiatives);
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
						<div class="absolute {tick.number <= 9 ? 'left-4' : 'left-2.5'}">-</div>
					{/if}
					{tick.number}
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
					<button
						class="btn aspect-square h-full w-full"
						class:btn-active={negation}
						onclick={() => toggleNegation()}
					>
						<Minus size={48} />
					</button>
				{/if}
			</div>
			<div></div>
			<div>
				{#if sessionData.activeCombatant?.combatState !== CombatState.Expecting}
					<button
						class="btn btn-outline btn-info h-full w-full"
						onclick={() => setCombatStateToExpecting()}
					>
						<ClockAlert size={64} strokeWidth={1} />
					</button>
				{/if}
			</div>
			<div>
				{#if sessionData.activeCombatant?.combatState !== CombatState.Waiting}
					<button
						class="btn btn-outline btn-info h-full w-full"
						onclick={() => setCombatStateToWaiting()}
					>
						<Hourglass size={64} strokeWidth={1} />
					</button>
				{/if}
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
