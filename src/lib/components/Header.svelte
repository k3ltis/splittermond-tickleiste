<script lang="ts">
	import { base } from '$app/paths';
	import { loadScene, sceneData, type Scene } from '$lib/state/scene.svelte';
	import { extractFileContentAsJSON, downloadJSON } from '$lib/state/fileio.svelte';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';
	import { onMount } from 'svelte';

	const uploadScene = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target && target.files) {
			const file = target.files[0];
			if (file) {
				extractFileContentAsJSON(file).then((scene: Scene) => {
					loadScene(scene);
				});
			}
			// Reset target value to allow uploading the same file multiple times
			// see https://stackoverflow.com/a/56258902 for details
			target.value = '';
		}
	};

	const downloadScene = () => {
		let filename = sceneData.name.toLowerCase().trim().replace(/\s+/g, '_');
		downloadJSON(sceneData, filename);
	};

	const explainPage = () => {
		const driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: '#sceneTitle',
					popover: { title: 'Scene Title', description: "Shows the current scene's name." }
				},
				{
					element: '#combatantsTable',
					popover: {
						title: 'Combatants List',
						description: 'Displays the list of combatants part of the scene.'
					}
				},
				{
					element: '#editSceneBtn',
					popover: {
						title: 'Edit Scene',
						description: 'Toggles edit mode to change the scene name and combatants list.'
					}
				},
				{
					element: '#runSceneBtn',
					popover: {
						title: 'Run Scene',
						description:
							"Ends edit mode and runs the scene which effectively means that all combatants will be ordered by ascending initiative. <b>When clicking a combatant in run mode, let's your choose a number of ticks</b> to be added to the combatants initiative value, followed by a reordering. <br/><br/> You can re-enter <b>edit mode</b> any time."
					}
				},
				{
					element: '#downloadBtn',
					popover: {
						title: 'Download Scene',
						description: 'Lets you download the current scene as JSON file.'
					}
				},
				{
					element: '#uploadButton',
					popover: {
						title: 'Upload Scene',
						description: 'Lets you choose a scene to load that was previously saved to your device.'
					}
				}
			]
		});

		driverObj.drive();
	};
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl">Splittermond Tickleiste</a>
	</div>
	<div class="flex-none space-x-2">
		<label id="uploadButton" for="battleScene" class="btn">
			<img width="30em" src="{base}/svg/upload-svgrepo-com.svg" alt="download" />
			<span class="hidden md:flex">Upload Scene</span>
		</label>
		<input
			type="file"
			id="battleScene"
			name="battleScene"
			accept="application/json"
			class="battle-scene-file-input file-input w-full max-w-xs"
			onchange={uploadScene}
		/>
		<button id="downloadBtn" onclick={() => downloadScene()} class="btn">
			<img width="30em" src="{base}/svg/download-svgrepo-com.svg" alt="download" />
			<span class="hidden md:flex">Download Scene</span>
		</button>
		<button onclick={() => explainPage()} class="btn">
			<img width="30em" src="{base}/svg/circle-question-svgrepo-com.svg" alt="download" />
		</button>
	</div>
</div>

<style>
	.battle-scene-file-input {
		display: none;
	}
</style>
