<script lang="ts">
	import { createNewCombatant, scene, type Combatant } from "$lib/state/combatants.svelte";

	let newCombatant: Combatant = $state(createNewCombatant())
	let editing: boolean = $state(false);

	function addCombatant(combatant: Combatant) {
		if (combatant.name === '') {
			return;
		}
		scene.combatants.push(combatant)
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addCombatant(newCombatant);
			newCombatant = createNewCombatant()
		}
	}

	function editCombatants() {
		editing = true;
	}

	function saveCombatants() {
		editing = false;
	}

	function deleteCombatant(combatantId: string){
		scene.combatants = scene.combatants.filter(c => c.id !== combatantId)
	}
</script>

<div class="mx-48 mt-12 overflow-x-auto">
	<button class="btn" onclick={editCombatants}>Edit</button>
	<button class="btn" onclick={saveCombatants}>Save Edit</button>
	<div class="mb-6">
		<button onclick={() => addCombatant(newCombatant)} class="btn"> Add Combatant </button>
		<input
			type="text"
			placeholder="Name..."
			class="input input-bordered w-full max-w-xs"
			bind:value={newCombatant.name}
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
			{#each scene.combatants as combatant}
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
