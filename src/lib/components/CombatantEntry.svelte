<script lang="ts">
	import {
		determineNextActingCombatant,
		type Combatant,
		type ConditionState,
		type HEX
	} from '$lib/state/scene_data.svelte';
	import { fade, slide } from 'svelte/transition';
	import {
		Trash,
		Hourglass,
		ClockAlert,
		Skull,
		ArrowRight,
		Timer,
		Palette,
		Ban
	} from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';
	import { _ } from 'svelte-i18n';
	import { LEVEL_NUMBER_TO_STRING } from '$lib/state/condition';
	import { getAllConditions, getConditionById } from '$lib/state/scene_data.conditions.svelte';
	import { addToggleListener } from '$lib/utility/html_details_element_extension';

	interface Props {
		combatant: Combatant;
		appMode: AppMode;
		combatantClicked: (combatant: Combatant) => void;
		conditionClicked: (combatant: Combatant, condition: ConditionState) => void;
		deleteCombatant: (combatantId: string) => void;
	}

	const colors: HEX[] = [
		'#40bb03',
		'#e7b500',
		'#d41c3e',
		'#940be6',
		'#3a75f1',
		'#070706',
		'#4a4a4a',
		'#ffffff'
	];
	// svelte-ignore non_reactive_update
	let colorDetails: HTMLDetailsElement;
	// Used to position the dropdown top and bottom
	let detailsButtonInLowerHalf = $state(false);
	// Used to handle the z-indexing
	let colorDetailsOpen = $state(false);
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
		const condition = getConditionById(conditionState.id);
		if (!condition) {
			console.error(`Cannot find condition ${conditionState.id}`);
			return '';
		}
		if (condition.maxLevel > 1) {
			return ' ' + LEVEL_NUMBER_TO_STRING[conditionState.activeLevel];
		}
		return '';
	}

	function selectColor(color: HEX | null) {
		combatant.color = color;
		colorDetails.open = false;
	}

	$effect(() => {
		// Since appMode is 'RUNNING' initially, the editing section would not be rendered and thus addToggleListener
		// cannot be executed using the onMount function. This is why the handler is added on switching to edit mode.
		if (appMode === 'EDITING') {
			// register listener for details toggle behavior
			addToggleListener(colorDetails);

			// register listener for additional behavior
			colorDetails.addEventListener('toggle', () => {
				if (colorDetails.open) {
					colorDetailsOpen = true;

					// open dropdown top- or bottom-aligned depending on where
					// the triggering button is, more on the upper or more on
					// the lower half of the screen
					const rect: DOMRect = colorDetails.getBoundingClientRect();
					const isInLowerHalf = rect.top > window.innerHeight * 0.7;
					detailsButtonInLowerHalf = isInLowerHalf;
				} else {
					colorDetailsOpen = false;
				}
			});
		}
	});
</script>

{#if appMode === 'RUNNING'}
	<div class="flex">
		<div style:background-color={combatant.color} class="min-w-2">&nbsp;</div>
		<div class="w-full p-3 md:p-6">
			<div class="flex w-full items-center justify-between">
				<div class="relative">
					<p
						aria-label={$_('combatant_name')}
						class="my-auto w-full ps-4 text-left text-2xl md:text-3xl"
					>
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
				<div class="mx-2 mr-16 self-start">
					{#if combatant.combatState === 'Active'}
						<button
							aria-label={$_('combatant_initiative')}
							class="btn btn-primary w-16 px-1 text-center text-2xl md:w-20 md:text-3xl"
							onclick={() => combatantClicked(combatant)}
						>
							{combatant.initiative}
							<span class="sr-only">{$_('open_interactions')}</span>
						</button>
					{:else if combatant.combatState === 'Waiting'}
						<button
							in:fade={{ duration: 200 }}
							class="btn btn-warning w-16 px-1 text-center md:w-20"
							onclick={() => combatantClicked(combatant)}
						>
							<Hourglass class="w-16 text-center md:w-20" size={32} strokeWidth={2} />
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
							class="btn btn-warning w-16 px-1 text-center md:w-20"
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
							class="px btn btn-error w-16 px-1 text-center md:w-20"
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
			</div>
			<div
				class="mt-2 flex flex-row flex-wrap"
				class:hidden={combatant.conditionStates.length === 0}
			>
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
	</div>
{/if}

{#if appMode === 'EDITING'}
	<div class="flex">
		<div style:background-color={combatant.color} class="min-w-2">&nbsp;</div>
		<div class="flex w-full p-3 md:p-6">
			<div class="flex w-full items-center">
				<div class="relative grow">
					<div class="mr-1 flex flex-col">
						<input
							type="text"
							aria-label={$_('combatant_name')}
							class="input input-bordered my-auto w-full text-2xl md:text-3xl"
							bind:value={combatant.name}
						/>
					</div>
				</div>
				<details
					id="color-dropdown-{combatant.id}"
					class="dropdown dropdown-end {detailsButtonInLowerHalf
						? 'dropdown-top'
						: 'dropdown-bottom'} mr-1 drop-shadow-xl {colorDetailsOpen ? 'z-[1]' : ''}"
					bind:this={colorDetails}
				>
					<summary
						style:background-color={combatant.color}
						class:btn-outline={combatant.color === null}
						class="btn btn-square btn-ghost input-bordered z-auto"
						aria-label={$_('open_menu')}
					>
						{#if combatant.color === null}
							<Palette aria-hidden />
						{:else}
							&nbsp;
						{/if}
					</summary>
					<div
						tabindex="-1"
						class="dropdown-content grid grid-cols-[1fr_1fr_1fr] rounded-md bg-primary p-1 text-primary-content shadow"
					>
						<button
							class="btn btn-square btn-neutral size-16"
							onclick={() => selectColor(null)}
							aria-label="__SELECT_COLOR_NONE_"
							role="menuitem"
							tabindex="0"><Ban aria-hidden /></button
						>
						{#each colors as color, index}
							<button
								style:background-color={color}
								class="btn btn-square size-16"
								onclick={() => selectColor(color)}
								aria-label="__SELECT_COLOR_{index}__"
								role="menuitem"
								tabindex="0">&nbsp;</button
							>
						{/each}
					</div>
				</details>
				<div class="mr-1">
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

	ul.color-detail-dropdown-content {
		flex-direction: row;
		flex-wrap: nowrap;
	}
</style>
