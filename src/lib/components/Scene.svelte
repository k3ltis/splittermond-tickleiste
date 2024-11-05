<script lang="ts">
	import { base } from '$app/paths';
	import {
		createNewCombatant,
		sceneData,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import TickSelection from './TickSelection.svelte';

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

<div class="w-full h-full overflow-x-auto p-4 md:m-auto md:w-[800px] md:px-20">
	<div class="navbar bg-base-100">
		<!-- Scene Title -->
		<div id="sceneTitle" class="flex-1 text-3xl">
			{#if appMode === AppMode.Editing}
				<input
					type="text"
					placeholder="Scene name..."
					class="input input-bordered mr-4 w-full max-w-md"
					bind:value={sceneData.name}
				/>
			{:else}
				{sceneData.name}
			{/if}
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="flex-none space-x-2">
			<button
				id="runSceneBtn"
				class="btn"
				class:btn-active={appMode === AppMode.Running}
				onclick={runScene}
			>
				<img width="30em" src="{base}/svg/circle-play-svgrepo-com.svg" alt="download" />
				<span class="hidden md:flex">Run Scene</span>
			</button>
			<button
				id="editSceneBtn"
				class="btn"
				class:btn-active={appMode === AppMode.Editing}
				onclick={editScene}
			>
				<img width="30em" src="{base}/svg/pencil-svgrepo-com.svg" alt="toggle edit" />
				<span class="hidden md:flex">Edit Scene</span>
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="grid w-full grid-cols-[6fr_1fr_1fr] mt-4">
		<!-- Header -->
		<div
			class="col-span-3 grid grid-cols-subgrid gap-4 bg-gray-200 px-4 py-2 font-bold"
			class:rounded-t-lg={appMode === AppMode.Editing}
			class:rounded-lg={appMode === AppMode.Running}
		>
			<div class="">Name</div>
			<div class="" id="initiativeColumn">Initiative</div>
			<div class=""></div>
			<!-- Spacer for buttons column -->
		</div>

		<!-- Combatant Input Fields -->
		{#if appMode === AppMode.Editing}
			<div
				class="col-span-3 grid grid-cols-subgrid items-center gap-4 rounded-b-lg bg-gray-200 p-2"
			>
				<div class="flex-1">
					<input
						type="text"
						placeholder="Name..."
						class="input input-bordered w-full max-w-md"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="flex-1">
					<input
						type="number"
						placeholder="Initiative..."
						class="input input-bordered w-full max-w-20"
						bind:value={newCombatant.initiative}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="flex w-16 justify-center">
					<button onclick={() => addCombatant(newCombatant)} class="btn">
						<img width="30" src="{base}/svg/plus-svgrepo-com.svg" alt="add" />
					</button>
				</div>
			</div>
		{/if}

		<!-- Combatant List -->
		{#each sceneData.combatants as combatant, index}
			<div
				class="col-span-3 grid grid-cols-subgrid items-center gap-4 p-6 rounded-lg {appMode === AppMode.Running
					? 'cursor-pointer hover:bg-gray-100'
					: 'cursor-default'} {appMode == AppMode.Running && index === 0 ? 'border-4 border-green-300/100' : ''} {appMode == AppMode.Running && index >= 2 ? 'border-t-4 border-primary-content rounded-none' : ''}"
				onclick={() => combatantClicked(combatant)}
				onkeydown={() => combatantClicked(combatant)}
				onkeyup={() => combatantClicked(combatant)}
				role="button"
				tabindex="0"
			>
				<div class="flex-1 text-3xl">
					{#if appMode === AppMode.Editing}
						<input
							type="text"
							class="input input-bordered w-full max-w-md"
							bind:value={combatant.name}
						/>
					{:else}
						{combatant.name}
					{/if}
				</div>
				<div class="flex-1 text-5xl">
					{#if appMode === AppMode.Editing}
						<input
							type="number"
							class="input input-bordered w-full max-w-20"
							bind:value={combatant.initiative}
						/>
					{:else}
						{combatant.initiative}
					{/if}
				</div>
				<div class="flex w-16 justify-center">
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