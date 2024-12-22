<script lang="ts">
	import { conditions, LEVEL_NUMBER_TO_STRING } from '$lib/state/condition';
	import { addCustomCondition } from '$lib/state/scene_data.conditions.svelte';
	import { sceneData } from '$lib/state/scene_data.svelte';
	import { Plus, X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import ConditionToggleList from './ConditionToggleList.svelte';

	const DEFAULT_CUSTOM_CONDITION_MAX_LEVEL = 1;
	let settingsModal: HTMLDialogElement;
	let customConditionName: string = $state('');
	let customConditionMaxLevel: number = $state(DEFAULT_CUSTOM_CONDITION_MAX_LEVEL);
	let isModalOpen: boolean = $state(false);

	export function show() {
		settingsModal.showModal();
		isModalOpen = true;
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

		<ConditionToggleList conditionList={conditions} deletableConditions={false} />

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
				aria-label={$_('settings.new_condition_name')}
			/>
			<select
				class="select select-bordered mr-4 text-center text-xl md:text-2xl"
				name="custom_condition_max_level"
				bind:value={customConditionMaxLevel}
				aria-label={$_('settings.new_condition_level')}
			>
				{#each getPossibleLevels() as level, index}
					<option value={index + 1}>{level}</option>
				{/each}
			</select>

			<button
				class="btn btn-primary mr-2"
				type="submit"
				disabled={customConditionName.length === 0}
				aria-label={$_('settings.add_new_condition')}><Plus strokeWidth={3} aria-hidden /></button
			>
		</form>

		<ConditionToggleList
			conditionList={sceneData.settings.customConditions}
			deletableConditions={true}
		/>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
