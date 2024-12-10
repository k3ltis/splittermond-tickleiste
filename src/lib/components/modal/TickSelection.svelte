<script lang="ts">
	import {
		getAbsoluteTicks,
		getRelativeTicks,
		moveCombatantByTicks,
		moveCombatantToTick,
		resetActiveCombatant,
		sceneData,
		sessionData,
		setCombatantCombatStateToDead,
		setCombatantCombatStateToExpecting,
		setCombatantCombatStateToWaiting,
		type Tick
	} from '$lib/state/scene_data.svelte';
	import { Minus, Hourglass, ClockAlert, Skull, UserRound, Plus } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { slide } from 'svelte/transition';

	let negation: boolean = $state(false);
	let { notifyDone }: { notifyDone: () => void } = $props();
	let userRoundAnimationDuration: number = $state(0);

	export function resetModal() {
		userRoundAnimationDuration = 0;
		negation = false;
		sessionData.ticks = calculatePossibleTicks();
	}

	function calculatePossibleTicks(): Array<Tick> {
		const activeCombatant = sessionData.activeCombatant;
		if (activeCombatant) {
			if (activeCombatant.combatState === 'Active') {
				return getRelativeTicks(negation, activeCombatant.initiative, sceneData.combatants);
			} else {
				return getAbsoluteTicks();
			}
		}
		return [];
	}

	function select(tick: Tick) {
		notifyDone();
		if (sessionData.activeCombatant) {
			if (tick.mode === 'relative') {
				moveCombatantByTicks(sessionData.activeCombatant.id, tick.number);
			} else {
				moveCombatantToTick(sessionData.activeCombatant.id, tick.number);
			}
			resetActiveCombatant();
		}
	}

	function toggleNegation() {
		// make the animation visible
		userRoundAnimationDuration = 200;
		negation = !negation;
		sessionData.ticks = calculatePossibleTicks();
	}

	function selectCombatStateExpecting() {
		notifyDone();
		if (!sessionData.activeCombatant) {
			return;
		}
		setCombatantCombatStateToExpecting(sessionData.activeCombatant.id);
		resetActiveCombatant();
	}

	function selectCombatStateWaiting() {
		notifyDone();
		if (!sessionData.activeCombatant) {
			return;
		}
		setCombatantCombatStateToWaiting(sessionData.activeCombatant.id);
		resetActiveCombatant();
	}

	function selectCombatStateDead() {
		notifyDone();
		if (!sessionData.activeCombatant) {
			return;
		}
		setCombatantCombatStateToDead(sessionData.activeCombatant.id);
		resetActiveCombatant();
	}
</script>

<div class="grid grid-cols-4 gap-1 md:grid-cols-5">
	{#each sessionData.ticks as tick}
		<button
			class="tick-selection btn relative aspect-square h-full w-full min-[320px]:text-2xl sm:text-3xl"
			onclick={() => select(tick)}
		>
			{#if tick.mode === 'relative'}
				<span class="sr-only">{$_('tick_move')}</span>
				{#if tick.number > 0}
					+{tick.number}
				{:else}
					{tick.number}
				{/if}
			{:else}
				<span class="sr-only">{$_('tick_join')}</span>
				{tick.number}
			{/if}

			<!-- {negation ? -tickNumber : tickNumber} -->
			{#if tick.hasCombatants}
				<span
					class="absolute bottom-0 right-0"
					transition:slide={{ duration: userRoundAnimationDuration }}
				>
					<UserRound class="size-4 text-accent sm:size-6" aria-hidden />
				</span>
			{/if}
		</button>
	{/each}
</div>
<div class="mt-1 grid grid-cols-4 gap-1 md:grid-cols-5">
	<div>
		{#if sessionData.activeCombatant === null || sessionData.activeCombatant?.combatState === 'Active'}
			<div
				class="tooltip aspect-square h-full w-full"
				data-tip={$_('tickselection.tooltip.tick_direction', { values: { n: Number(negation) } })}
			>
				<button
					class="btn h-full w-full"
					class:btn-active={negation}
					onclick={() => toggleNegation()}
					aria-label={$_('tickselection.tooltip.tick_direction', {
						values: { n: Number(negation) }
					})}
				>
					{#if negation}
						<Plus size={40} strokeWidth={2} aria-hidden />
					{:else}
						<Minus size={40} strokeWidth={2} aria-hidden />
					{/if}
				</button>
			</div>
		{/if}
	</div>
	<div class="hidden md:block"></div>
	<div>
		{#if sessionData.activeCombatant?.combatState !== 'Expecting'}
			<div
				class="tooltip aspect-square h-full w-full"
				data-tip={$_('tickselection.tooltip.set_state_expecting')}
			>
				<button
					class="btn btn-info aspect-square h-full w-full"
					onclick={() => selectCombatStateExpecting()}
					aria-label={$_('tickselection.tooltip.set_state_expecting')}
				>
					<ClockAlert size={40} strokeWidth={2} aria-hidden />
				</button>
			</div>
		{/if}
	</div>
	<div>
		{#if sessionData.activeCombatant?.combatState !== 'Waiting'}
			<div
				class="tooltip aspect-square h-full w-full"
				data-tip={$_('tickselection.tooltip.set_state_waiting')}
			>
				<button
					class="btn btn-info aspect-square h-full w-full"
					onclick={() => selectCombatStateWaiting()}
					aria-label={$_('tickselection.tooltip.set_state_waiting')}
				>
					<Hourglass size={40} strokeWidth={2} aria-hidden />
				</button>
			</div>
		{/if}
	</div>
	<div>
		{#if sessionData.activeCombatant?.combatState !== 'Dead'}
			<div
				class="tooltip aspect-square h-full w-full"
				data-tip={$_('tickselection.tooltip.set_state_dead')}
			>
				<button
					class="btn btn-error aspect-square h-full w-full"
					onclick={() => selectCombatStateDead()}
					aria-label={$_('tickselection.tooltip.set_state_dead')}
				>
					<Skull size={40} strokeWidth={2} aria-hidden />
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Until size (md - 1) we show only 16 elements */
	@media screen and (max-width: 767px) {
		button.tick-selection:nth-child(n + 17) {
			display: none;
		}
	}
</style>
