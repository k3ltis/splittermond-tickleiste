<script lang="ts">
	import { createNewCombatant, sceneData, sortCombatantsByInitiative, type Combatant } from '$lib/state/scene.svelte';

	let newCombatant: Combatant = $state(createNewCombatant());
	let editing: boolean = $state(false);
	let combatantNameInput: HTMLInputElement;

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

	function editCombatants() {
		editing = true;
	}

	function saveCombatants() {
		editing = false;
	}

	function deleteCombatant(combatantId: string) {
		sceneData.combatants = sceneData.combatants.filter((c) => c.id !== combatantId);
	}

	function runScene() {
		sortCombatantsByInitiative()
	}
</script>

<div class="mx-48 mt-12 overflow-x-auto">
	<div class="p-6">
		<input
			type="text"
			placeholder="Scene name..."
			class="input w-full max-w-xs"
			bind:value={sceneData.name}
		/>
	</div>
	<button class="btn" onclick={runScene}>RunScene</button>
	<button class="btn" onclick={editCombatants}>Edit</button>
	<button class="btn" onclick={saveCombatants}>Save Edit</button>
	<div class="mb-6">
		<button onclick={() => addCombatant(newCombatant)} class="btn"> Add Combatant </button>
		<input
			type="text"
			placeholder="Name..."
			class="input input-bordered w-full max-w-xs"
			bind:value={newCombatant.name}
			bind:this={combatantNameInput}
			onkeydown={handleKeyDown}
		/>
		<input
			type="number"
			placeholder="Iniative..."
			class="input input-bordered w-full max-w-xs"
			bind:value={newCombatant.initiative}
			onkeydown={handleKeyDown}
		/>
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
			{#each sceneData.combatants as combatant}
				<tr>
					<td>
						{#if editing}
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
						{#if editing}
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
						<button class="btn" onclick={() => deleteCombatant(combatant.id)}>X</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
