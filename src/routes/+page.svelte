<script lang="ts">
	let file: File | null = null;
	let jsonData: any = { name: '', combatants: [] };

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target && target.files) {
			file = target.files[0];
			uploadJSON();
		}
	}

	function uploadJSON() {
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					jsonData = JSON.parse(event.target?.result as string);
					console.log('Parsed JSON:', jsonData);
				} catch (e) {
					console.error('Error parsing JSON:', e);
					alert('Invalid JSON file');
				}
			};
			reader.readAsText(file);
		}
	}

	function downloadJSON() {
		if (jsonData) {
			const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			// Create a link to trigger the download
			const a = document.createElement('a');
			a.href = url;
			a.download = 'data.json';
			a.click();

			// Release the URL object
			URL.revokeObjectURL(url);
		} else {
			alert('No data to download');
		}
	}

	function addCombatant(name: string) {
		jsonData.combatants = [...jsonData.combatants, name];
	}

	// Save jsonData to localStorage
	function saveToLocalStorage() {
		localStorage.setItem('jsonData', JSON.stringify(jsonData));
		console.log('Data saved to localStorage');
	}

	// Load jsonData from localStorage
	function loadFromLocalStorage() {
		const savedData = localStorage.getItem('jsonData');
		if (savedData) {
			jsonData = JSON.parse(savedData);
			console.log('Data loaded from localStorage');
		} else {
			console.log('No data found in localStorage');
		}
	}
</script>

<h1>Splittermond Tickleisten Tool</h1>
<p>
	This is a test to see if most important functionalities of the tool can be used in a client-side
	only environment.
</p>

<label for="battleScene">Upload JSON</label>
<input
	type="file"
	id="battleScene"
	name="battleScene"
	accept="text/json"
	class="file-input w-full max-w-xs"
	onchange={handleFileChange}
/>
<button onclick={() => downloadJSON()} class="btn">
	<img width="30em" src="/svg/download-svgrepo-com.svg" alt="download" />
	Download JSON
</button>

<button class="btn" onclick={saveToLocalStorage}>Save</button>
<button class="btn" onclick={loadFromLocalStorage}>Load</button>

<button onclick={() => addCombatant('Marodeur')} class="btn"> Add Combatant </button>

{#if jsonData !== null}
	<div>
		<h2>Combatants:</h2>
		<ul>
			{#each jsonData.combatants as combatant}
				<li>{combatant}</li>
			{/each}
		</ul>
	</div>
{/if}
