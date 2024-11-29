<script lang="ts">
	import {
		createNewCombatant,
		sceneData,
		sessionData,
		setMostRecentTickToMinimalActiveInitiative,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import CombatantModal from './modal/CombatantModal.svelte';
	import CombatantEntry from './CombatantEntry.svelte';
	import { _ } from 'svelte-i18n';
	import { Pencil, Play, Plus } from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';

	const DEFAULT_APP_MODE: AppMode = 'RUNNING';

	let newCombatant: Combatant = $state(createNewCombatant());

	// Indicating that the combatants are edited
	let appMode: AppMode = $state(DEFAULT_APP_MODE);

	// svelte-ignore non_reactive_update
	let combatantNameInput: HTMLInputElement;

	let combatantModal: CombatantModal;

	function addCombatant(combatant: Combatant) {
		if (combatant.name === '') {
			return;
		}
		sceneData.combatants.push(combatant);

		// Restore default combatant for new input
		newCombatant = createNewCombatant();

		// Restore focus on the name input
		combatantNameInput.focus();
		combatantNameInput.select();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addCombatant(newCombatant);
		}
	}

	function editScene() {
		appMode = 'EDITING';
	}

	function deleteCombatant(combatantId: string) {
		sceneData.combatants = sceneData.combatants.filter((c) => c.id !== combatantId);
	}

	function runScene() {
		appMode = 'RUNNING';
		setMostRecentTickToMinimalActiveInitiative();
		sortCombatantsByInitiative();
	}

	function combatantClicked(combatant: Combatant) {
		if (appMode === 'RUNNING') {
			sessionData.activeCombatant = combatant;
			combatantModal.show();
		}
	}

	function conditionClicked(combatant: Combatant) {
		if (appMode === 'RUNNING') {
			sessionData.activeCombatant = combatant;
			combatantModal.show('conditions');
		}
	}
</script>

<CombatantModal bind:this={combatantModal} />

<div
	class="
		m-auto
		mt-16
		h-full
		w-full
		px-2
		py-4
		md:mt-20
		md:w-11/12
		lg:w-10/12
		xl:w-10/12
		2xl:w-[1200px]"
>
	<div class="navbar bg-base-100 px-0">
		<!-- Scene Title -->
		<div id="sceneTitle" class="flex-1">
			<input
				type="text"
				placeholder="Scene name..."
				disabled={appMode === 'RUNNING'}
				class="input mr-4 w-full text-3xl {appMode === 'EDITING'
					? 'input-bordered'
					: 'disabled input-ghost'}"
				bind:value={sceneData.name}
			/>
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="change-scene-mode flex-none space-x-2">
			<button
				id="runSceneBtn"
				class="btn btn-primary text-xl"
				class:hidden={appMode == 'RUNNING'}
				onclick={runScene}
			>
				<Play />
				<span class="hidden lg:flex">{$_('run_scene_button')}</span>
			</button>
			<button
				id="editSceneBtn"
				class="btn btn-primary text-xl"
				class:hidden={appMode === 'EDITING'}
				onclick={editScene}
			>
				<Pencil />
				<span class="hidden lg:flex">{$_('edit_scene_button')}</span>
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="mt-4 grid w-full grid-cols-[99fr_1fr_1fr]">
		<!-- Table Header -->
		<div
			class="col-span-3 grid grid-cols-subgrid items-center gap-2 bg-primary-content px-6 py-2 text-xl font-bold"
			class:rounded-t-lg={appMode === 'EDITING'}
			class:rounded-lg={appMode === 'RUNNING'}
		>
			<div>{$_('column_name')}</div>
			<div id="initiativeColumn">{$_('column_initiative')}</div>
			<div class="w-16"></div>
			<!-- Spacer for buttons column -->
		</div>

		<!-- Combatant Input Fields -->
		{#if appMode === 'EDITING'}
			<div
				transition:slide
				class="col-span-3 grid grid-cols-subgrid items-center gap-2 rounded-b-lg bg-primary-content px-6 pb-4"
			>
				<div>
					<input
						type="text"
						placeholder={$_('placeholder_name')}
						class="input input-bordered w-full text-3xl"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div>
					<input
						type="number"
						placeholder={$_('placeholder_initiative')}
						class="
							input
							input-bordered
							w-20
							px-1
							text-center
							text-3xl"
						bind:value={newCombatant.initiative}
						onfocus={(event: FocusEvent) => selectInputText(event)}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="w-16 justify-center">
					<button onclick={() => addCombatant(newCombatant)} class="btn btn-primary">
						<Plus strokeWidth={3} />
					</button>
				</div>
			</div>
		{/if}

		<!-- <div class="my-2"></div> -->

		<!-- Combatant List -->
		{#if sceneData.combatants.length === 0}
			<div class="text-l col-span-3 px-4 py-16 text-center">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html $_('scene.empty_combatants_list')}
			</div>
		{/if}
	</div>
	{#each sceneData.combatants as combatant, index (combatant.id)}
		<div animate:flip={{ delay: 100, duration: 500 }}>
			<CombatantEntry
				{appMode}
				{combatant}
				{index}
				{combatantClicked}
				{conditionClicked}
				{deleteCombatant}
			/>
		</div>
	{/each}
</div>

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

	/* disabled:bg-transparent disabled:border-none disabled:text-base-content disabled:cursor-default */
	input.disabled {
		background: var(--bg-transparent);
		border-color: transparent;
		color: var(--text-base-content);
		cursor: default;
		pointer-events: none;
		user-select: none;
	}
</style>
