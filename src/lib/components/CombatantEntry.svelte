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

{#if appMode === 'RUNNING'}
	<div
		class="
		rounded p-6 hover:bg-primary-content
		{index >= 1 ? 'border-t-4 border-primary-content' : ''}"
	>
		<div
			class="grid w-full cursor-pointer grid-cols-[98fr_1fr_1fr] items-center gap-2"
			onclick={() => combatantClicked(combatant)}
			onkeydown={() => {}}
			onkeyup={() => {}}
			role="button"
			tabindex="0"
		>
			<div class="relative">
				<div class="flex flex-col">
					<p aria-label={$_('combatant_name')} class="my-auto w-full ps-4 text-3xl">
						{combatant.name}
					</p>
				</div>
				{#if combatant === nextActingCombatant}
					<div class="absolute -left-4 top-1" in:fade={{ duration: 200 }}>
						<ArrowRight size="32" />
						<span class="sr-only">{$_('active_combatant')}</span>
					</div>
				{/if}
			</div>
			<div class="self-start">
				{#if combatant.combatState === 'Active'}
					<p
						aria-label={$_('combatant_initiative')}
						class="	w-20 px-1 text-center text-3xl"
						onfocus={(event: FocusEvent) => selectInputText(event)}
					>
						{combatant.initiative}
					</p>
				{:else}
					<div in:fade={{ duration: 200 }}>
						{#if combatant.combatState === 'Waiting'}
							<Hourglass class="w-20 text-center text-info" size={48} strokeWidth={1} />
							<span class="sr-only"
								>{$_('combatant_status', {
									values: { status: $_('tickselection.tooltip.set_state_waiting') }
								})}</span
							>
						{:else if combatant.combatState === 'Expecting'}
							<ClockAlert class="w-20 text-center text-info" size={48} strokeWidth={1} />
							<span class="sr-only"
								>{$_('combatant_status', {
									values: { status: $_('tickselection.tooltip.set_state_expecting') }
								})}</span
							>
						{:else if combatant.combatState === 'Dead'}
							<Skull class="w-20 text-center text-error" size={48} strokeWidth={1} />
							<span class="sr-only"
								>{$_('combatant_status', {
									values: { status: $_('tickselection.tooltip.set_state_dead') }
								})}</span
							>
						{/if}
					</div>
				{/if}
			</div>
			<div class="w-16 text-center">
				<div class="min-w-12"></div>
			</div>
		</div>
		<div class="mt-2 flex flex-row flex-wrap">
			{#each combatant.conditionStates as conditionState}
				<button
					class="badge badge-error badge-outline badge-lg mr-1 self-end"
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
	</div>
{/if}

{#if appMode === 'EDITING'}
	<div class="p-6 {index >= 1 ? 'border-t-4 border-primary-content' : ''}">
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
			<div class="self-start">
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
					class="btn btn-outline btn-error"
					onclick={() => deleteCombatant(combatant.id)}
					aria-label={$_('delete_combatant', { values: { name: combatant.name } })}
				>
					<Trash aria-hidden />
				</button>
			</div>
		</div>
	</div>
{/if}

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
