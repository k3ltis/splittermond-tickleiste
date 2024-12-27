<script lang="ts">
	import { LEVEL_NUMBER_TO_STRING, type Condition } from '$lib/state/condition';
	import {
		getAllConditions,
		getConditionById,
		toggleCondition
	} from '$lib/state/scene_data.conditions.svelte';
	import { sessionData } from '$lib/state/scene_data.svelte';
	import { Timer, Menu, Settings } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	function select(conditionId: string) {
		if (!sessionData.activeCombatant) {
			console.warn('No active combatant. Cannot toggle condition type ' + conditionId);
			return;
		}
		toggleCondition(sessionData.activeCombatant.id, conditionId);
	}

	function isActiveOnActiveCombatant(conditionId: string) {
		if (!sessionData.activeCombatant) {
			return;
		}

		return sessionData.activeCombatant.conditionStates.some((s) => s.id === conditionId);
	}

	function calculateConditionDuration(conditionId: string): number {
		if (!sessionData.activeCombatant) {
			return 0;
		}
		const conditionState = sessionData.activeCombatant.conditionStates.find(
			(c) => c.id === conditionId
		);
		if (!conditionState) {
			return 0;
		}
		return Math.abs(sessionData.activeCombatant.initiative - conditionState.activeSinceTick);
	}

	function getSortedConditions(unsortedConditions: Condition[]): Condition[] {
		const _conditions = [...unsortedConditions];
		_conditions.sort((a, b) => ($_(a.i18n) > $_(b.i18n) ? 1 : -1));
		return _conditions;
	}

	// Resolves the current condition level as roman letters, e.v. "IV", or empty string if no levels exist.
	function resolveCurrentLevel(conditionId: string): string {
		if (!sessionData.activeCombatant) {
			return '';
		}
		const conditionState = sessionData.activeCombatant.conditionStates.find(
			(c) => c.id === conditionId
		);
		if (!conditionState) {
			return '';
		}
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

	// Resolves the condition level range in roman letters, e.g. "I-IV", or empty string if no levels exist.
	function resolveLevelRange(conditionId: string, activeConditions: Condition[]): string {
		const condition = activeConditions.find((c) => c.id === conditionId);
		if (condition && condition.maxLevel > 1) {
			const maxLevelRoman = LEVEL_NUMBER_TO_STRING[condition.maxLevel];
			return `(I-${maxLevelRoman})`;
		}

		return '';
	}
</script>

<div class="grid grid-cols-2 gap-2 md:gap-4">
	{#each getSortedConditions(getAllConditions({ onlyActive: true })) as condition}
		<button
			class:btn-outline={!isActiveOnActiveCombatant(condition.id)}
			class:btn-error={isActiveOnActiveCombatant(condition.id)}
			class="btn px-2 text-lg font-normal md:text-xl"
			onclick={() => select(condition.id)}
		>
			<span class="leading-none">
				{$_(condition.i18n)}{resolveCurrentLevel(condition.id)}
				{#if isActiveOnActiveCombatant(condition.id)}
					<span class="text-nowrap">
						(<Timer
							class="mb-1 inline-block align-middle"
							size={16}
							strokeWidth={2}
						/>&nbsp;{calculateConditionDuration(condition.id)})
					</span>
				{:else}
					<span class="text-sm"
						>{resolveLevelRange(condition.id, getSortedConditions(getAllConditions()))}</span
					>
				{/if}
			</span>
		</button>
	{:else}
		<div class="my-6 text-center col-span-2">
			<h2 class="card-title justify-center">{$_('condition.no_conditions_selected')}</h2>
			<p class="mt-6">
				{$_('condition.no_conditions_selected_hint')}
				<kbd class="kbd kbd-sm bg-base-200 text-base-content"><Menu size={16} /></kbd> &#8594;
				<kbd class="kbd kbd-sm bg-base-200 text-base-content"
					><Settings size={16} />&nbsp;{$_('settings.title')}</kbd
				>
				{$_('condition.no_conditions_selected_hint_2')}
			</p>
		</div>
	{/each}
</div>
