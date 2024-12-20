<script lang="ts">
	import { conditions } from '$lib/state/condition';
	import { sceneData, toggleConditionVisibility } from '$lib/state/scene_data.svelte';
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	let settingsModal: HTMLDialogElement;
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
	<div class="modal-box w-11/12 max-w-5xl">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
		<h3 class="text-lg font-bold" id="settingsDialogTitle">__SETTINGS_HEADER__</h3>

		{#each conditions as condition}
			<div class="flex flex-row">
				<label for={condition.id} class="flex-1 text-xl">{$_(condition.i18n)}</label>
				<input
					type="checkbox"
					id={condition.id}
					class="toggle toggle-success"
					checked={isConditionEnabled(condition.id)}
					onclick={() => onToggleCondition(condition.id)}
				/>
			</div>
		{/each}
		<!-- Allows closing by clicking the free area around the modal -->
		<form method="dialog" class="modal-backdrop">
			<button>{$_('close')}</button>
		</form>
	</div>
</dialog>
