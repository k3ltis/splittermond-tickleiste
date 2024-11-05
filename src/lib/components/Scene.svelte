<script lang="ts">
	import { base } from '$app/paths';
	import {
		createNewCombatant,
		sceneData,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene.svelte';
	import TickSelection from "./TickSelection.svelte";

	const AppMode = {
		Editing: "EDITING",
		Running: "RUNNING",
	}

	let newCombatant: Combatant = $state(createNewCombatant());

	// Indicating that the combatants are edited
	let appMode: string = $state(AppMode.Editing);

	// svelte-ignore non_reactive_update
	let combatantNameInput: HTMLInputElement;

	// svelte-ignore non_reactive_update
	let tickSelection: any

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
		appMode = AppMode.Editing
	}

	function deleteCombatant(combatantId: string) {
		sceneData.combatants = sceneData.combatants.filter((c) => c.id !== combatantId);
	}

	function runScene() {
		appMode = AppMode.Running
		sortCombatantsByInitiative();
	}
	
	function combatantClicked(combatant: Combatant) {
		if (appMode === AppMode.Running) {
			tickSelection.show().then((ticks: number) => {
				combatant.initiative += ticks
				sortCombatantsByInitiative();
			})
		}
	}
</script>

<TickSelection bind:this={tickSelection} />

<div class="mx-48 mt-12 overflow-x-auto">
	<div class="navbar bg-base-100">
		<!-- Scene Title -->
		<div id="sceneTitle" class="flex-1">
			{#if appMode === AppMode.Editing}
				<input
					type="text"
					placeholder="Scene name..."
					class="input input-bordered w-full max-w-xs"
					bind:value={sceneData.name}
				/>
			{:else}
				{sceneData.name}
			{/if}
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="flex-none space-x-2">
			<button id="runSceneBtn" class="btn" class:btn-active={appMode === AppMode.Running} onclick={runScene}>
				<img width="30em" src="{base}/svg/circle-play-svgrepo-com.svg" alt="download" />
				Run Scene
			</button>
			<button id="editSceneBtn" class="btn" class:btn-active={appMode === AppMode.Editing} onclick={editScene}>
				<img width="30em" src="{base}/svg/pencil-svgrepo-com.svg" alt="toggle edit" />
				Edit Scene
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="w-full">
		<!-- Header -->
		<div class="flex font-bold py-2 px-4 bg-gray-200" class:rounded-t-lg={appMode === AppMode.Editing} class:rounded-lg={appMode === AppMode.Running}>
			<div class="flex-1">Name</div>
			<div class="flex-1" id="initiativeColumn">Initiative</div>
			<div class="w-16"></div> <!-- Spacer for buttons column -->
		</div>
	
		<!-- Combatant Input Fields -->
		{#if appMode === AppMode.Editing}
			<div class="flex items-center bg-gray-200 p-2 rounded-b-lg mb-2">
				<div class="flex-1">
					<input
						type="text"
						placeholder="Name..."
						class="input input-bordered w-full max-w-xs"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="flex-1">
					<input
						type="number"
						placeholder="Initiative..."
						class="input input-bordered w-full max-w-xs"
						bind:value={newCombatant.initiative}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="w-16 flex justify-center">
					<button onclick={() => addCombatant(newCombatant)} class="btn">
						<img width="30" src="{base}/svg/plus-svgrepo-com.svg" alt="add" />
					</button>
				</div>
			</div>
		{/if}
	
		<!-- Combatant List -->
		{#each sceneData.combatants as combatant}
			<div 
				class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
				onclick={() => combatantClicked(combatant)}
				onkeydown={() => combatantClicked(combatant)}
				onkeyup={() => combatantClicked(combatant)}
				role="button"
				tabindex="0"
			>
				<div class="flex-1">
					{#if appMode === AppMode.Editing}
						<input
							type="text"
							class="input input-bordered w-full max-w-xs"
							bind:value={combatant.name}
						/>
					{:else}
						{combatant.name}
					{/if}
				</div>
				<div class="flex-1">
					{#if appMode === AppMode.Editing}
						<input
							type="number"
							class="input input-bordered w-full max-w-xs"
							bind:value={combatant.initiative}
						/>
					{:else}
						{combatant.initiative}
					{/if}
				</div>
				<div class="w-16 flex justify-center">
					{#if appMode === AppMode.Editing}
						<button class="btn" onclick={() => deleteCombatant(combatant.id)}>
							<img width="30" src="{base}/svg/trash-svgrepo-com.svg" alt="delete" />
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>	
</div>
