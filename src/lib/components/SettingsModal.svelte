<script lang="ts">
	import { conditions, LEVEL_NUMBER_TO_STRING, type Condition } from '$lib/state/condition';
	import {
		addCustomCondition,
		deleteCustomCondition,
		toggleConditionVisibility
	} from '$lib/state/scene_data.conditions.svelte';
	import { sceneData, type Combatant } from '$lib/state/scene_data.svelte';
	import { Plus, Trash, X, TriangleAlert } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	const DEFAULT_CUSTOM_CONDITION_MAX_LEVEL = 1;
	let settingsModal: HTMLDialogElement;
	let customConditionName: string = $state('');
	let customConditionMaxLevel: number = $state(DEFAULT_CUSTOM_CONDITION_MAX_LEVEL);
	let isModalOpen: boolean = $state(false);
	let conditionsInUse: string[] = $derived(
		sceneData.combatants.flatMap((combatant) =>
			combatant.conditionStates.map((conditionState) => conditionState.id)
		)
	);

	export function show() {
		settingsModal.showModal();
		isModalOpen = true;
	}

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

	function onAddCustomCondition(event: Event) {
		event.preventDefault();

		addCustomCondition({
			i18n: String(customConditionName),
			maxLevel: Number(customConditionMaxLevel)
		});

		customConditionName = '';
		customConditionMaxLevel = DEFAULT_CUSTOM_CONDITION_MAX_LEVEL;
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

	function getPossibleLevels(): string[] {
		return Object.values(LEVEL_NUMBER_TO_STRING).reduce((acc, curr) => {
			acc.push(curr);
			return acc;
		}, Array<string>());
	}
</script>

<dialog
	id="settingsModal"
	bind:this={settingsModal}
	class="modal"
	class:hidden={!isModalOpen}
	onclose={() => (isModalOpen = false)}
	aria-labelledby="settingsDialogTitle"
	aria-describedby="dialogDesc"
>
	<div class="modal-box relative border-4 border-primary p-2 pt-0 md:p-4 md:pt-0">
		<div class="sticky top-0 z-10 flex justify-between bg-base-100 py-3">
			<!-- Allow closing by clicking the "X" -->
			<h3 class="pl-3 text-xl font-bold" id="settingsDialogTitle">{$_('settings.title')}</h3>
			<form method="dialog" class="float-end">
				<button class="btn btn-circle btn-ghost btn-sm" aria-label={$_('close')}>
					<X aria-hidden size={24} />
				</button>
			</form>
		</div>

		<div class="divider uppercase before:bg-secondary after:bg-secondary">
			{$_('settings.conditions')}
		</div>

		{#if isAnyConditionInUse(conditions)}
			<div
				role="alert"
				class="my-3 flex rounded-md border-4 border-warning bg-base-200 p-3 text-left"
			>
				<TriangleAlert aria-hidden size={36} class="mr-3 self-center text-warning" />

				<span class="text-lg">{$_('settings.in_use')}</span>
			</div>
		{/if}
		{#each conditions as condition}
			<div
				class="my-1 flex flex-row items-center rounded focus-within:bg-base-300 hover:bg-base-300"
			>
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
				/>
			</div>
		{/each}

		<div class="divider uppercase before:bg-secondary after:bg-secondary">
			{$_('settings.custom_conditions')}
		</div>
		<form action="" class="flex" onsubmit={onAddCustomCondition}>
			<input
				type="text"
				bind:value={customConditionName}
				name="custom_condition_name"
				placeholder="{$_('settings.custom_condition_placeholder')} "
				class="input input-bordered mr-4 w-full text-xl md:text-2xl"
			/>
			<select
				class="select select-bordered mr-4 text-center text-xl md:text-2xl"
				name="custom_condition_max_level"
				bind:value={customConditionMaxLevel}
			>
				{#each getPossibleLevels() as level, index}
					<option value={index + 1}>{level}</option>
				{/each}
			</select>

			<button class="btn btn-primary mr-2" type="submit" disabled={customConditionName.length === 0}
				><Plus strokeWidth={3} aria-hidden /></button
			>
		</form>

		{#if isAnyConditionInUse(sceneData.settings.customConditions)}
			<div
				role="alert"
				class="my-3 flex rounded-md border-4 border-warning bg-base-200 p-3 text-left"
			>
				<TriangleAlert aria-hidden size={36} class="mr-3 self-center text-warning" />

				<span class="text-lg">{$_('settings.in_use')}</span>
			</div>
		{/if}

		{#each sceneData.settings.customConditions as condition (condition.id)}
			<div
				class="my-1 flex flex-row flex-wrap items-center rounded focus-within:bg-base-300 hover:bg-base-300"
			>
				<label for={condition.id} class="flex-1 p-3 text-xl hover:cursor-pointer md:text-2xl"
					>{$_(condition.i18n)}
					{resolveLevelrange(condition.maxLevel)}
				</label>
				<input
					type="checkbox"
					id={condition.id}
					class="toggle toggle-success m-4"
					checked={isConditionEnabled(condition.id)}
					onclick={() => onToggleCondition(condition.id)}
					disabled={isConditionInUse(condition.id)}
				/>
				<button
					class="btn btn-error btn-sm mr-2 w-14"
					onclick={() => onDeleteCustomCondition(condition.id)}
					disabled={isConditionInUse(condition.id)}
				>
					<Trash aria-hidden />
				</button>
			</div>
		{/each}
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
