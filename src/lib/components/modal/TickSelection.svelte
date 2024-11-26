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
	let { notifyDone }: any = $props();

	export function resetModal() {
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

<h3 class="mb-5 text-2xl font-bold">
	<div class="flex">
		{$_('tick_selection_modal_header', {
			values: { combatantName: sessionData.activeCombatant?.name }
		})}
		{#if sessionData.activeCombatant?.combatState === 'Active'}
			({sessionData.activeCombatant?.initiative})
		{:else if sessionData.activeCombatant?.combatState === 'Dead'}
			(<Skull class="mt-0.5 text-error" strokeWidth="1" size="32" />)
		{:else if sessionData.activeCombatant?.combatState === 'Expecting'}
			(<ClockAlert class="mt-0.5 text-info" strokeWidth="1" size="32" />)
		{:else if sessionData.activeCombatant?.combatState === 'Waiting'}
			(<Hourglass class="mt-0.5 text-info" strokeWidth="1" size="32" />)
		{/if}
	</div>
</h3>
<div class="grid grid-cols-5 gap-1">
	{#each sessionData.ticks as tick}
		<button class="btn relative aspect-square h-full w-full text-4xl" onclick={() => select(tick)}>
			{#if tick.mode === 'relative'}
				{#if tick.number > 0}
					+{tick.number}
				{:else}
					{tick.number}
				{/if}
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
		{#if sessionData.activeCombatant === null || sessionData.activeCombatant?.combatState === 'Active'}
			<div
				class="tooltip aspect-square h-full w-full"
				data-tip={$_('tickselection.tooltip.negation')}
			>
				<button
					class="btn h-full w-full"
					class:btn-active={negation}
					onclick={() => toggleNegation()}
				>
					{#if negation}
						<Plus size={48} />
					{:else}
						<Minus size={48} />
					{/if}
				</button>
			</div>
		{/if}
	</div>
	<div></div>
	<div>
		{#if sessionData.activeCombatant?.combatState !== 'Expecting'}
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
		{#if sessionData.activeCombatant?.combatState !== 'Waiting'}
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
		{#if sessionData.activeCombatant?.combatState !== 'Dead'}
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
