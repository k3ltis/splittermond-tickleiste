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
	import CombatantModal from './combatant_modal/CombatantModal.svelte';
	import CombatantEntry from './CombatantEntry.svelte';
	import { _ } from 'svelte-i18n';
	import { Pencil, Play, Plus } from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';
	import { onMount } from 'svelte';

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

	onMount(() => {
		if (sceneData.combatants.length === 0) {
			appMode = 'EDITING';
		}
	});
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
			{#if appMode === 'EDITING'}
				<input
					type="text"
					placeholder={$_('scene_title')}
					class="input input-bordered mr-4 w-full text-2xl md:text-3xl"
					bind:value={sceneData.name}
				/>
			{:else}
				<p class="mr-4 w-full ps-[17px] text-2xl md:text-3xl" aria-label={$_('scene_title')}>
					{sceneData.name}
				</p>
			{/if}
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="change-scene-mode flex-none space-x-2">
			<button
				id="runSceneBtn"
				class="btn btn-primary"
				class:hidden={appMode == 'RUNNING'}
				disabled={sceneData.combatants.length === 0}
				onclick={runScene}
			>
				<Play />
				<span class="sr-only lg:not-sr-only lg:flex">{$_('run_scene')}</span>
			</button>
			<button
				id="editSceneBtn"
				class="btn btn-primary text-xl"
				class:hidden={appMode === 'EDITING'}
				onclick={editScene}
			>
				<Pencil aria-hidden />
				<span class="sr-only lg:not-sr-only lg:flex">{$_('edit_scene')}</span>
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="mb-2 mt-4">
		<!-- Table Header -->
		<div class="column rounded-lg bg-secondary p-3 md:p-6">
			<div class="flex w-full justify-between">
				<div class="pl-1 text-xl">{$_('column_name')}</div>
				<div class="mr-16 w-16 pl-1 text-xl md:w-20" id="initiativeColumn">
					{$_('column_initiative')}
				</div>
			</div>
			<!-- Combatant Input Fields -->
			{#if appMode === 'EDITING'}
				<div transition:slide class="col-span-3 flex w-full">
					<input
						type="text"
						placeholder={$_('placeholder_name')}
						class="input input-bordered w-full text-2xl md:text-3xl"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
					<input
						type="number"
						placeholder={$_('placeholder_initiative')}
						class="
						input
						input-bordered
						mx-1.5
						w-16
						px-1
						text-center
						text-2xl
						md:w-20
						md:text-3xl"
						bind:value={newCombatant.initiative}
						onfocus={(event: FocusEvent) => selectInputText(event)}
						onkeydown={handleKeyDown}
					/>
					<div class="justify-center">
						<button
							onclick={() => addCombatant(newCombatant)}
							class="btn btn-primary"
							aria-label={$_('add_combatant')}
						>
							<Plus strokeWidth={3} aria-hidden />
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Combatant List -->
		{#if sceneData.combatants.length === 0}
			<div class="card mt-8 bg-base-100">
				<div class="card-body text-center">
					<h2 class="card-title justify-center">{$_('scene.empty_combatants_info')}</h2>
					<p class="mt-6">
						{$_('scene.empty_combatants_hint')}
						<kbd class="kbd kbd-sm bg-primary text-base-100">+</kbd>
						{$_('scene.empty_combatants_hint_2')}
					</p>
				</div>
			</div>
		{/if}
	</div>
	{#each sceneData.combatants as combatant (combatant.id)}
		<div animate:flip={{ delay: 100, duration: 500 }}>
			<CombatantEntry
				{appMode}
				{combatant}
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
</style>
