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
		<div class="flex-1">
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
		<div class="flex-none space-x-2">
			<button class="btn" class:btn-active={appMode === AppMode.Running} onclick={runScene}>
				<img width="30em" src="{base}/svg/circle-play-svgrepo-com.svg" alt="download" />
				Run Scene
			</button>
			<button class="btn" class:btn-active={appMode === AppMode.Editing} onclick={editScene}>
				<img width="30em" src="{base}/svg/pencil-svgrepo-com.svg" alt="toggle edit" />
				Edit Scene
			</button>
		</div>
	</div>
	<table class="table">
		<thead>
			<tr>
				<th>Name</th>
				<th>Initiative</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#if appMode === AppMode.Editing}
				<tr>
					<td>
						<input
							type="text"
							placeholder="Name..."
							class="input input-bordered w-full max-w-xs"
							bind:value={newCombatant.name}
							bind:this={combatantNameInput}
							onkeydown={handleKeyDown}
						/>
					</td>
					<td>
						<input
							type="number"
							placeholder="Iniative..."
							class="input input-bordered w-full max-w-xs"
							bind:value={newCombatant.initiative}
							onkeydown={handleKeyDown}
						/>
					</td>
					<td>
						<button onclick={() => addCombatant(newCombatant)} class="btn">
							<img width="30em" src="{base}/svg/plus-svgrepo-com.svg" alt="add" />
						</button>
					</td>
				</tr>
			{/if}
			{#each sceneData.combatants as combatant}
				<tr class:hover={appMode === AppMode.Running} onclick={() => combatantClicked(combatant)}>
					<td>
						{#if appMode === AppMode.Editing}
							<input
								type="text"
								class="input input-bordered w-full max-w-xs"
								bind:value={combatant.name}
							/>
						{:else}
							{combatant.name}
						{/if}
					</td>
					<td>
						{#if appMode === AppMode.Editing}
							<input
								type="number"
								class="input input-bordered w-full max-w-xs"
								bind:value={combatant.initiative}
							/>
						{:else}
							{combatant.initiative}
						{/if}
					</td>
					<td>
						{#if appMode === AppMode.Editing}
							<button class="btn" onclick={() => deleteCombatant(combatant.id)}>
								<img width="30em" src="{base}/svg/trash-svgrepo-com.svg" alt="delete" />
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
