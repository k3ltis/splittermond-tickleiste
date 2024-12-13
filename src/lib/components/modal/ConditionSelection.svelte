<script lang="ts">
	import {
		conditions,
		LEVEL_NUMBER_TO_STRING,
		type Condition,
		type ConditionType
	} from '$lib/state/condition';
	import { sessionData, toggleCondition } from '$lib/state/scene_data.svelte';
	import { Timer } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	function select(conditionId: ConditionType) {
		if (!sessionData.activeCombatant) {
			console.warn('No active combatant. Cannot toggle condition type ' + conditionId);
			return;
		}
		toggleCondition(sessionData.activeCombatant.id, conditionId);
	}

	function isActiveOnActiveCombatant(conditionId: ConditionType) {
		if (!sessionData.activeCombatant) {
			return;
		}

		return sessionData.activeCombatant.conditionStates.some((s) => s.id === conditionId);
	}

	function calculateConditionDuration(conditionId: ConditionType): number {
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

	function getSortedConditions(): Condition[] {
		const _conditions = conditions;
		_conditions.sort((a, b) => ($_(a.i18n) > $_(b.i18n) ? 1 : -1));
		return _conditions;
	}

	// Resolves the current condition level as roman letters, e.v. "IV", or empty string if no levels exist.
	function resolveCurrentLevel(conditionId: ConditionType): string {
		if (!sessionData.activeCombatant) {
			return '';
		}
		const conditionState = sessionData.activeCombatant.conditionStates.find(
			(c) => c.id === conditionId
		);
		if (!conditionState) {
			return '';
		}
		if (conditionState.activeLevel > 0) {
			return ' ' + LEVEL_NUMBER_TO_STRING[conditionState.activeLevel];
		}
		return '';
	}

	// Resolves the condition level range in roman letters, e.g. "I-IV", or empty string if no levels exist.
	function resolveLevelRange(conditionId: ConditionType): string {
		const condition = conditions.find((c) => c.id === conditionId);
		if (condition && condition.maxLevel > 0) {
			const maxLevelRoman = LEVEL_NUMBER_TO_STRING[condition.maxLevel];
			return `(I-${maxLevelRoman})`;
		}

		return '';
	}
</script>

<div class="grid grid-cols-2 gap-4">
	{#each getSortedConditions() as condition}
		<button
			class:btn-outline={!isActiveOnActiveCombatant(condition.id)}
			class:btn-error={isActiveOnActiveCombatant(condition.id)}
			class="btn md:text-xl"
			onclick={() => select(condition.id)}
		>
			<span class="text-nowrap">
				{$_(condition.i18n)}{resolveCurrentLevel(condition.id)}
				{#if isActiveOnActiveCombatant(condition.id)}
					(<Timer
						class="mb-1 inline-block align-middle"
						size={16}
						strokeWidth={2}
					/>&nbsp;{calculateConditionDuration(condition.id)})
				{:else}
					<span class="text-sm">{resolveLevelRange(condition.id)}</span>
				{/if}
			</span>
		</button>
	{/each}
</div>
