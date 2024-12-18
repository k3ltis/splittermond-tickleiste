<script lang="ts">
	import { getSceneDataForExport, loadScene, type Scene } from '$lib/state/scene_data.svelte';
	import { extractFileContent, downloadJSON } from '$lib/state/fileio.svelte';
	import 'driver.js/dist/driver.css';
	import { _ } from 'svelte-i18n';
	import { Download, Upload, Menu } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { base } from '$app/paths';
	import Tour from './Tour.svelte';
	import { onMount } from 'svelte';
	import { addToggleListener } from '$lib/utility/html_details_element_extension';

	let details: HTMLDetailsElement;

	const uploadScene = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target && target.files) {
			const file = target.files[0];
			if (file) {
				extractFileContent<Scene>(file).then((scene: Scene) => {
					loadScene(scene);
				});
			}
			// Reset target value to allow uploading the same file multiple times
			// see https://stackoverflow.com/a/56258902 for details
			target.value = '';
		}
	};

	const downloadScene = () => {
		const sceneData = getSceneDataForExport();
		let filename = sceneData.name.toLowerCase().trim().replace(/\s+/g, '_');
		downloadJSON(sceneData, filename);
	};

	onMount(() => {
		addToggleListener(details);
	});
</script>

<div
	class="navbar fixed top-0 z-[1] border-b-4 border-primary bg-primary-content/20 backdrop-blur-xl"
>
	<div class="flex-1">
		<img class="max-h-12 md:max-h-16" src="{base}/logo.png" alt="splittermond logo" />
	</div>
	<div class="flex-none space-x-2">
		<ThemeToggle />
		<Tour />
		<details
			id="header-menu-dropdown"
			class="dropdown dropdown-end drop-shadow-xl"
			bind:this={details}
		>
			<summary class="btn btn-ghost" aria-label={$_('open_menu')}>
				<Menu aria-hidden />
			</summary>
			<ul
				class="menu dropdown-content z-[10] w-[350px] rounded-box bg-secondary p-2 font-bold text-secondary-content"
			>
				<li>
					<label id="uploadButton" for="battleScene" class="text-xl">
						<Upload aria-hidden />
						<span>{$_('upload_scene')}</span>
					</label>
					<input
						type="file"
						id="battleScene"
						name="battleScene"
						accept="application/json"
						class="battle-scene-file-input file-input w-full max-w-xs"
						onchange={uploadScene}
					/>
				</li>
				<li>
					<button id="downloadBtn" onclick={() => downloadScene()}>
						<Download aria-hidden />
						<span class="text-xl">{$_('download_scene')}</span>
					</button>
				</li>
			</ul>
		</details>
	</div>
</div>

<style>
	.battle-scene-file-input {
		display: none;
	}
</style>
