<script lang="ts">
	import { base } from '$app/paths';
	import {
		createNewCombatant,
		sceneData,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import { fade, slide } from "svelte/transition";
	import TickSelection from "./TickSelection.svelte";
	import { _ } from 'svelte-i18n'
	import { Pencil, Play, Plus, Trash } from "lucide-svelte";

	const AppMode = {
		Editing: 'EDITING',
		Running: 'RUNNING'
	};

	let newCombatant: Combatant = $state(createNewCombatant());

	// Indicating that the combatants are edited
	let appMode: string = $state(AppMode.Running);

	// svelte-ignore non_reactive_update
	let combatantNameInput: HTMLInputElement;

	// svelte-ignore non_reactive_update
	let tickSelection: any;

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
		appMode = AppMode.Editing;
	}

	function deleteCombatant(combatantId: string) {
		sceneData.combatants = sceneData.combatants.filter((c) => c.id !== combatantId);
	}

	function runScene() {
		appMode = AppMode.Running;
		sortCombatantsByInitiative();
	}

	function combatantClicked(combatant: Combatant) {
		if (appMode === AppMode.Running) {
			tickSelection.show().then((ticks: number) => {
				combatant.initiative += ticks;
				sortCombatantsByInitiative(combatant);
			});
		}
	}
</script>

<TickSelection bind:this={tickSelection} />

<div class="h-full w-full overflow-x-auto p-4 m-auto md:w-11/12 lg:w-10/12 xl:w-10/12 2xl:w-[1200px]">
	<div class="navbar bg-base-100">
		<!-- Scene Title -->
		<div id="sceneTitle" class="flex-1">
			<input
				type="text"
				placeholder="Scene name..."
				disabled={appMode === AppMode.Running}
				class="text-3xl input mr-4 w-full max-w-md {appMode === AppMode.Editing
							? 'input-bordered'
							: 'input-ghost disabled'}"
				bind:value={sceneData.name}
			/>
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="flex-none space-x-2">
			<button
				id="runSceneBtn"
				class="btn"
				class:btn-active={appMode === AppMode.Running}
				onclick={runScene}
			>
				<Play />
				<span class="hidden lg:flex">{$_("run_scene_button")}</span>
			</button>
			<button
				id="editSceneBtn"
				class="btn"
				class:btn-active={appMode === AppMode.Editing}
				onclick={editScene}
			>
				<Pencil />
				<span class="hidden lg:flex">{$_("edit_scene_button")}</span>
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="mt-4 grid w-full grid-cols-[6fr_1fr_1fr]">
		<!-- Header -->
		<div
			class="col-span-3 grid grid-cols-subgrid gap-2 bg-gray-200 px-6 py-2 font-bold items-center"
			class:rounded-t-lg={appMode === AppMode.Editing}
			class:rounded-lg={appMode === AppMode.Running}
		>
			<div class="">{$_("column_name")}</div>
			<div class="" id="initiativeColumn">{$_("column_initiative")}</div>
			<div class=""></div>
			<!-- Spacer for buttons column -->
		</div>

		<!-- Combatant Input Fields -->
		{#if appMode === AppMode.Editing}
			<div
				transition:slide
				class="col-span-3 grid grid-cols-subgrid items-center gap-2 rounded-b-lg bg-gray-200 px-6 pb-4"
			>
				<div class="">
					<input
						type="text"
						placeholder="{$_("placeholder_name")}"
						class="input input-bordered w-full max-w-md text-3xl"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="">
					<input
						type="number"
						placeholder="{$_("placeholder_initiative")}"
						class="input input-bordered text-5xl w-28 text-center"
						bind:value={newCombatant.initiative}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="w-16 justify-center">
					<button onclick={() => addCombatant(newCombatant)} class="btn">
						<Plus />
					</button>
				</div>
			</div>
		{/if}

		<div class="my-2"></div>

		<!-- Combatant List -->
		{#each sceneData.combatants as combatant, index}
			<div
				class="grid col-span-3 grid-cols-subgrid items-center gap-2 rounded-none p-6 focus:outline-none {appMode ===
				AppMode.Running
					? 'cursor-pointer hover:bg-gray-100'
					: 'cursor-default'} {appMode == AppMode.Running && index === 0
					? 'border-4 border-green-300/100'
					: ''} {index >= (appMode === AppMode.Running ? 2 : 1)
					? 'border-t-4 border-primary-content'
					: ''}"
				onclick={() => combatantClicked(combatant)}
				onkeydown={() => {}}
				onkeyup={() => {}}
				role="button"
				tabindex="0"
			>
				<div class="">
					<input
						type="text"
						disabled={appMode === AppMode.Running}
						class="input {appMode === AppMode.Editing
							? 'input-bordered'
							: 'input-ghost disabled'} w-full max-w-md text-3xl"
						bind:value={combatant.name}
					/>
				</div>
				<div class="w-28">
					<input
						type="number"
						disabled={appMode === AppMode.Running}
						class="input {appMode === AppMode.Editing
							? 'input-bordered'
							: 'input-ghost disabled'} w-full max-w-md text-5xl w-28 text-center"
						bind:value={combatant.initiative}
					/>
				</div>
				<div class="w-16 justify-center">
					{#if appMode === AppMode.Editing}
						<button transition:fade={{ duration: 200 }} class="btn btn-outline btn-error" onclick={() => deleteCombatant(combatant.id)}>
							<Trash />
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
}

/* disabled:bg-transparent disabled:border-none disabled:text-base-content disabled:cursor-default */
input.disabled {
	background: var(--bg-transparent);
	border: none;
	color: var(--text-base-content);
	cursor: default;
	pointer-events: none;
	user-select: none;
}
</style>