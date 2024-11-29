<script lang="ts">
	import {
		determineNextActingCombatant,
		type Combatant,
		type ConditionState
	} from '$lib/state/scene_data.svelte';
	import { fade } from 'svelte/transition';
	import { Trash, Hourglass, ClockAlert, Skull, ArrowRight } from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';
	import { _ } from 'svelte-i18n';
	import { conditions, type ConditionType } from '$lib/state/condition';

	interface Props {
		combatant: Combatant;
		appMode: AppMode;
		index: number;
		combatantClicked: (combatant: Combatant) => void;
		conditionClicked: (combatant: Combatant, condition: ConditionState) => void;
		deleteCombatant: (combatantId: string) => void;
	}

	let { combatant, appMode, index, combatantClicked, conditionClicked, deleteCombatant }: Props =
		$props();

	let nextActingCombatant: Combatant | null = $derived(determineNextActingCombatant());

	function resolveLabel(conditionId: ConditionType): string {
		const condition = conditions.find((c) => c.id === conditionId);
		if (!condition) {
			return conditionId;
		}
		return $_(condition.i18n);
	}

	function calculateConditionDuration(
		combatant: Combatant,
		conditionState: ConditionState
	): number {
		return Math.abs(combatant.initiative - conditionState.activeSinceTick);
	}

	function onBadgeClicked(combatant: Combatant, conditionState: ConditionState, event: MouseEvent) {
		event.stopPropagation();
		conditionClicked(combatant, conditionState);
	}
</script>

<div
	class="
	    grid w-full grid-cols-[98fr_1fr_1fr] rounded-none p-6 focus:outline-none
		{appMode === 'RUNNING' ? 'cursor-pointer hover:bg-primary-content' : 'cursor-default'}
		{index >= 1 ? 'border-t-4 border-primary-content' : ''}"
	onclick={() => combatantClicked(combatant)}
	onkeydown={() => {}}
	onkeyup={() => {}}
	role="button"
	tabindex="0"
>
	<div class="col-span-3 grid grid-cols-subgrid items-center gap-2">
		<div class="relative">
			<div class="flex flex-col">
				<input
					type="text"
					aria-label="Combatant name"
					disabled={appMode === 'RUNNING'}
					class="
					input
					w-full
					{appMode === 'EDITING' ? 'input-bordered' : 'disabled input-ghost'}
					my-auto
					text-3xl
					"
					bind:value={combatant.name}
				/>
				{#if appMode === 'RUNNING'}
					<div class="flex flex-row flex-wrap">
						{#each combatant.conditionStates as conditionState}
							<button
								class="badge badge-error badge-outline badge-lg mr-1 self-end focus:outline-none focus:ring-0"
								onclick={(event) => onBadgeClicked(combatant, conditionState, event)}
							>
								<span class="text-nowrap"
									>{resolveLabel(conditionState.id)} ({calculateConditionDuration(
										combatant,
										conditionState
									)})</span
								>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			{#if combatant === nextActingCombatant && appMode === 'RUNNING'}
				<div class="absolute -left-4 top-2.5" in:fade={{ duration: 200 }}>
					<ArrowRight size="32" />
				</div>
			{/if}
		</div>
		<div class="self-start">
			{#if combatant.combatState === 'Active' || appMode === 'EDITING'}
				<input
					type="number"
					aria-label="Combatant Initiative"
					disabled={appMode === 'RUNNING'}
					class="
					{appMode === 'EDITING' ? 'input-bordered' : 'disabled input-ghost'}
					input w-20 px-1 text-center text-3xl
					"
					onfocus={(event: FocusEvent) => selectInputText(event)}
					bind:value={combatant.initiative}
				/>
			{:else}
				<div in:fade={{ duration: 200 }} aria-label="Combatant Status" class="">
					{#if combatant.combatState === 'Waiting'}
						<Hourglass class="w-20 text-center text-info" size={48} strokeWidth={1} />
					{:else if combatant.combatState === 'Expecting'}
						<ClockAlert class="w-20 text-center text-info" size={48} strokeWidth={1} />
					{:else if combatant.combatState === 'Dead'}
						<Skull class="w-20 text-center text-error" size={48} strokeWidth={1} />
					{/if}
				</div>
			{/if}
		</div>
		<div class="w-16 text-center">
			{#if appMode === 'EDITING'}
				<button
					in:fade={{ duration: 200 }}
					class="btn btn-outline btn-error"
					onclick={() => deleteCombatant(combatant.id)}
				>
					<Trash />
				</button>
			{:else if appMode === 'RUNNING'}
				<div class="min-w-12"></div>
			{/if}
		</div>
	</div>
</div>

<style>
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
		appearance: textfield;
	}

	/* disabled:bg-transparent disabled:border-none disabled:text-base-content disabled:cursor-default */
	input.disabled {
		background: var(--bg-transparent);
		border-color: transparent;
		color: var(--text-base-content);
		cursor: default;
		pointer-events: none;
		user-select: none;
	}
</style>
