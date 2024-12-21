<script lang="ts">
	import { LEVEL_NUMBER_TO_STRING, type Condition } from '$lib/state/condition';
	import {
		deleteCustomCondition,
		toggleConditionVisibility
	} from '$lib/state/scene_data.conditions.svelte';
	import { sceneData, type Combatant } from '$lib/state/scene_data.svelte';
	import { TriangleAlert, Trash } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		conditionList: Condition[];
		deletableConditions: boolean;
	}

	let { conditionList, deletableConditions }: Props = $props();

	let conditionsInUse: string[] = $derived(
		sceneData.combatants.flatMap((combatant) =>
			combatant.conditionStates.map((conditionState) => conditionState.id)
		)
	);

	function onToggleCondition(conditionId: string) {
		toggleConditionVisibility(conditionId);
	}

	function isConditionEnabled(conditionId: string): boolean {
		return sceneData.settings.disabledConditions.every((disabledConditionId: string) => {
			return disabledConditionId !== conditionId;
		});
	}

	function isConditionInUse(conditionId: string): boolean {
		return sceneData.combatants.some((combatant: Combatant) => {
			return combatant.conditionStates.some((c) => {
				return c.id === conditionId;
			});
		});
	}

	function isAnyConditionInUse(conditions: Condition[]): boolean {
		return conditions.some((condition) => {
			return conditionsInUse.includes(condition.id);
		});
	}

	function onDeleteCustomCondition(conditionId: string) {
		deleteCustomCondition(conditionId);
	}

	function resolveLevelrange(maxLevel: number): string {
		if (maxLevel === 0 || maxLevel === 1) {
			return '';
		}

		return `(I - ${LEVEL_NUMBER_TO_STRING[maxLevel]})`;
	}
</script>

{#if isAnyConditionInUse(conditionList)}
	<div role="alert" class="my-3 flex rounded-md border-4 border-warning bg-base-200 p-3 text-left">
		<TriangleAlert aria-hidden size={36} class="mr-3 self-center text-warning" />

		<span class="text-lg">{$_('settings.in_use')}</span>
	</div>
{/if}
{#each conditionList as condition}
	<div class="my-1 flex flex-row items-center rounded focus-within:bg-base-300 hover:bg-base-300">
		<label for={condition.id} class="flex-1 p-3 text-xl hover:cursor-pointer md:text-2xl"
			>{$_(condition.i18n)} {resolveLevelrange(condition.maxLevel)}</label
		>
		<input
			type="checkbox"
			id={condition.id}
			class="toggle toggle-success mr-3"
			checked={isConditionEnabled(condition.id)}
			onclick={() => onToggleCondition(condition.id)}
			disabled={isConditionInUse(condition.id)}
			aria-label={isConditionEnabled(condition.id)
				? $_('settings.deactivate_condition', { values: { name: $_(condition.i18n) } })
				: $_('settings.activate_condition', { values: { name: $_(condition.i18n) } })}
		/>

		{#if deletableConditions}
			<button
				class="btn btn-error btn-sm mr-2 w-14"
				onclick={() => onDeleteCustomCondition(condition.id)}
				disabled={isConditionInUse(condition.id)}
				aria-label={$_('settings.delete_condition', { values: { name: condition.i18n } })}
			>
				<Trash aria-hidden />
			</button>
		{/if}
	</div>
{/each}
