<script lang="ts">
	import { loadScene, sceneData, type Scene } from '$lib/state/scene_data.svelte';
	import { extractFileContentAsJSON, downloadJSON } from '$lib/state/fileio.svelte';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';
	import { _ } from "svelte-i18n";
	import { Download, Upload, CircleHelp  } from 'lucide-svelte';

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
					popover: { title: $_('scene_title'), description: $_('scene_title_description') }
				},
				{
					element: '#combatantsTable',
					popover: {
						title: $_('combatants_list'),
						description: $_('combatants_list_description')
					}
				},
				{
					element: '#editSceneBtn',
					popover: {
						title: $_('edit_scene'),
						description: $_('edit_scene_description')
					}
				},
				{
					element: '#runSceneBtn',
					popover: {
						title: $_('run_scene'),
						description: $_('run_scene_description')
					}
				},
				{
					element: '#downloadBtn',
					popover: {
						title: $_('download_scene'),
						description: $_('download_scene_description')
					}
				},
				{
					element: '#uploadButton',
					popover: {
						title: $_('upload_scene'),
						description: $_('upload_scene_description')
					}
				}
			]
		});

		driverObj.drive();
	};
</script>

<div class="navbar border-b-4 border-primary-content fixed backdrop-blur-xl bg-primary-content/20 top-0 ">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl">{$_("app_title")}</a>
	</div>
	<div class="flex-none space-x-2">
		<label id="uploadButton" for="battleScene" class="btn text-xl btn-neutral">
			<Upload />
			<span class="hidden lg:flex">{$_("upload_scene")}</span>
		</label>
		<input
			type="file"
			id="battleScene"
			name="battleScene"
			accept="application/json"
			class="battle-scene-file-input file-input w-full max-w-xs"
			onchange={uploadScene}
		/>
		<button id="downloadBtn" onclick={() => downloadScene()} class="btn btn-neutral">
			<Download />
			<span class="hidden lg:flex text-xl">{$_("download_scene")}</span>
		</button>
		<button onclick={() => explainPage()} class="btn btn-neutral">
			<CircleHelp />
		</button>
	</div>
</div>

<style>
	.battle-scene-file-input {
		display: none;
	}
</style>
