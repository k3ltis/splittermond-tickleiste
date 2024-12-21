<script lang="ts">
	import {
		determineNextActingCombatant,
		type Combatant,
		type ConditionState
	} from '$lib/state/scene_data.svelte';
	import { fade, slide } from 'svelte/transition';
	import { Trash, Hourglass, ClockAlert, Skull, ArrowRight, Timer } from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';
	import { _ } from 'svelte-i18n';
	import { LEVEL_NUMBER_TO_STRING } from '$lib/state/condition';
	import { getAllConditions } from '$lib/state/scene_data.conditions.svelte';

	interface Props {
		combatant: Combatant;
		appMode: AppMode;
		combatantClicked: (combatant: Combatant) => void;
		conditionClicked: (combatant: Combatant, condition: ConditionState) => void;
		deleteCombatant: (combatantId: string) => void;
	}

	let { combatant, appMode, combatantClicked, conditionClicked, deleteCombatant }: Props = $props();

	let nextActingCombatant: Combatant | null = $derived(determineNextActingCombatant());

	function resolveLabel(conditionId: string): string {
		const condition = getAllConditions().find((c) => c.id === conditionId);
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

	function resolveLevelNumber(conditionState: ConditionState): string {
		if (conditionState.activeLevel > 0) {
			return ' ' + LEVEL_NUMBER_TO_STRING[conditionState.activeLevel];
		}
		return '';
	}
</script>

{#if appMode === 'RUNNING'}
	<div class="p-6">
		<div class="grid w-full grid-cols-[98fr_1fr_1fr] gap-2">
			<div class="relative">
				<p aria-label={$_('combatant_name')} class="my-auto w-full ps-4 text-left text-3xl">
					{combatant.name}
				</p>
				{#if combatant === nextActingCombatant}
					<div class="absolute -left-4 top-0.5">
						<div in:slide={{ delay: 400, duration: 500, axis: 'x' }}>
							<ArrowRight size="32" />
							<span class="sr-only">{$_('active_combatant')}</span>
						</div>
					</div>
				{/if}
			</div>
			<div class="self-start">
				{#if combatant.combatState === 'Active'}
					<button
						aria-label={$_('combatant_initiative')}
						class="btn btn-primary w-20 px-1 text-center text-3xl"
						onclick={() => combatantClicked(combatant)}
					>
						{combatant.initiative}
						<span class="sr-only">{$_('open_interactions')}</span>
					</button>
				{:else if combatant.combatState === 'Waiting'}
					<button
						in:fade={{ duration: 200 }}
						class="btn btn-warning w-20 px-1 text-center"
						onclick={() => combatantClicked(combatant)}
					>
						<Hourglass class="w-20 text-center" size={32} strokeWidth={2} />
						<span class="sr-only"
							>{$_('combatant_status', {
								values: { status: $_('tickselection.tooltip.set_state_waiting') }
							})}.
							{$_('open_interactions')}</span
						>
					</button>
				{:else if combatant.combatState === 'Expecting'}
					<button
						in:fade={{ duration: 200 }}
						class="btn btn-warning w-20 px-1 text-center"
						onclick={() => combatantClicked(combatant)}
					>
						<ClockAlert class="w-20 text-center" size={32} strokeWidth={2} />
						<span class="sr-only"
							>{$_('combatant_status', {
								values: { status: $_('tickselection.tooltip.set_state_expecting') }
							})}.
							{$_('open_interactions')}</span
						>
					</button>
				{:else if combatant.combatState === 'Dead'}
					<button
						in:fade={{ duration: 200 }}
						class="btn btn-error w-20 px-1 text-center"
						onclick={() => combatantClicked(combatant)}
					>
						<Skull class="w-20 text-center" size={32} strokeWidth={2} />
						<span class="sr-only"
							>{$_('combatant_status', {
								values: { status: $_('tickselection.tooltip.set_state_dead') }
							})}.
							{$_('open_interactions')}</span
						>
					</button>
				{/if}
			</div>
			<div class="w-16 text-center">
				<div class="min-w-12"></div>
			</div>
		</div>
		<div class="mt-2 flex flex-row flex-wrap" class:hidden={combatant.conditionStates.length === 0}>
			{#each combatant.conditionStates as conditionState}
				<button
					class="badge badge-error badge-outline badge-lg mr-1 self-end hover:bg-error hover:text-neutral"
					onclick={(event) => onBadgeClicked(combatant, conditionState, event)}
				>
					<span class="text-nowrap"
						>{resolveLabel(conditionState.id)}{resolveLevelNumber(conditionState)} (<Timer
							class="mb-1 inline-block align-middle"
							size={16}
							strokeWidth={2}
						/>&nbsp;{calculateConditionDuration(combatant, conditionState)})</span
					>
				</button>
			{/each}
		</div>
	</div>
{/if}

{#if appMode === 'EDITING'}
	<div class="p-6">
		<div class="grid w-full grid-cols-[98fr_1fr_1fr] items-center gap-2">
			<div class="relative">
				<div class="flex flex-col">
					<input
						type="text"
						aria-label={$_('combatant_name')}
						class="input input-bordered my-auto w-full text-3xl"
						bind:value={combatant.name}
					/>
				</div>
			</div>
			<div>
				<input
					type="number"
					aria-label={$_('combatant_initiative')}
					class="input input-bordered w-20 px-1 text-center text-3xl"
					onfocus={(event: FocusEvent) => selectInputText(event)}
					bind:value={combatant.initiative}
				/>
			</div>
			<div class="w-16 text-center">
				<button
					in:fade={{ duration: 200 }}
					class="btn btn-error w-full"
					onclick={() => deleteCombatant(combatant.id)}
					aria-label={$_('delete_combatant', { values: { name: combatant.name } })}
				>
					<Trash aria-hidden />
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="divider my-0 before:bg-secondary after:bg-secondary"></div>

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
</style>
