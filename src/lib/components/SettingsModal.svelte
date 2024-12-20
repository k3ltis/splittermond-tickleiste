<script lang="ts">
	import { conditions } from '$lib/state/condition';
	import {
		addCustomCondition,
		deleteCustomCondition,
		sceneData,
		toggleConditionVisibility
	} from '$lib/state/scene_data.svelte';
	import { Plus, Trash, X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	let settingsModal: HTMLDialogElement;
	let customConditionName: string = $state('');
	let customConditionMaxLevel: string = $state('0');
	let isModalOpen: boolean = $state(true);

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

	function onAddCustomCondition(event: Event) {
		event.preventDefault();

		addCustomCondition({
			i18n: String(customConditionName),
			maxLevel: Number(customConditionMaxLevel)
		});
	}

	function onDeleteCustomCondition(conditionId: string) {
		deleteCustomCondition(conditionId);
	}
</script>

<dialog
	id="settingsModal"
	bind:this={settingsModal}
	class="modal modal-open"
	class:hidden={!isModalOpen}
	onclose={() => (isModalOpen = false)}
	aria-labelledby="settingsDialogTitle"
	aria-describedby="dialogDesc"
>
	<div class="modal-box border-4 border-primary">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
		<h3 class="mb-6 text-xl font-bold" id="settingsDialogTitle">__SETTINGS_HEADER__</h3>

		{#each conditions as condition}
			<div class="my-2 flex flex-row">
				<label for={condition.id} class="flex-1 text-2xl hover:cursor-pointer"
					>{$_(condition.i18n)}</label
				>
				<input
					type="checkbox"
					id={condition.id}
					class="toggle toggle-success"
					checked={isConditionEnabled(condition.id)}
					onclick={() => onToggleCondition(condition.id)}
				/>
			</div>
		{/each}

		<div class="divider uppercase before:bg-secondary after:bg-secondary">Custom conditions</div>
		<form action="" class="flex" onsubmit={onAddCustomCondition}>
			<input
				type="text"
				bind:value={customConditionName}
				name="custom_condition_name"
				placeholder="_NAME OF CONDITION_"
				class="input input-bordered mr-4 w-full text-xl"
			/>
			<select
				class="select select-bordered mr-4 text-center text-xl"
				name="custom_condition_max_level"
				bind:value={customConditionMaxLevel}
			>
				<option value="0">I</option>
				<option value="2">II</option>
				<option value="3">III</option>
				<option value="4">IV</option>
				<option value="4">V</option>
			</select>

			<button class="btn btn-primary" type="submit" disabled={customConditionName.length === 0}
				><Plus strokeWidth={3} aria-hidden /></button
			>
		</form>

		{#each sceneData.settings.customConditions as condition (condition.id)}
			<div class="my-2 flex flex-row items-center">
				<label for={condition.id} class="flex-1 text-2xl hover:cursor-pointer"
					>{$_(condition.i18n)}</label
				>
				<input
					type="checkbox"
					id={condition.id}
					class="toggle toggle-success mr-4"
					checked={isConditionEnabled(condition.id)}
					onclick={() => onToggleCondition(condition.id)}
				/>
				<button class="btn btn-error" onclick={() => onDeleteCustomCondition(condition.id)}>
					<Trash aria-hidden />
				</button>
			</div>
		{/each}
		<!-- Allows closing by clicking the free area around the modal -->
		<form method="dialog" class="modal-backdrop">
			<button>{$_('close')}</button>
		</form>
	</div>
</dialog>
