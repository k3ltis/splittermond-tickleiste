<script lang="ts">
	import { getSceneDataForExport, loadScene, type Scene } from '$lib/state/scene_data.svelte';
	import { extractFileContent, downloadJSON } from '$lib/state/fileio.svelte';
	import 'driver.js/dist/driver.css';
	import { _ } from 'svelte-i18n';
	import { Download, Upload, Menu } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { base } from '$app/paths';
	import Tour from './Tour.svelte';

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

	function checkAndCloseDropDown(e: MouseEvent) {
		// Remove "focus" from div that acts as button to open the dropdown.
		// See https://github.com/saadeghi/daisyui/issues/157#issuecomment-979073401
		let targetEl = e.currentTarget as HTMLElement;
		if (targetEl && targetEl.matches(':focus')) {
			setTimeout(function () {
				targetEl.blur();
			}, 0);
		}
	}
</script>

<div
	class="navbar fixed top-0 z-[1] border-b-4 border-primary-content bg-primary-content/20 backdrop-blur-xl"
>
	<div class="flex-1">
		<img class="max-h-12 md:max-h-16" src="{base}/logo.png" alt="splittermond logo" />
	</div>
	<div class="flex-none space-x-2">
		<ThemeToggle />
		<Tour />
		<div class="dropdown dropdown-end">
			<div tabindex="-1" role="button" class="btn btn-ghost" onmousedown={checkAndCloseDropDown}>
				<Menu />
			</div>
			<ul
				tabindex="-1"
				class="menu dropdown-content z-[10] w-[350px] rounded-box bg-primary-content p-2 text-primary shadow"
			>
				<li>
					<label id="uploadButton" for="battleScene" class="text-xl">
						<Upload />
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
					<button id="downloadBtn" onclick={() => downloadScene()} class="">
						<Download />
						<span class="text-xl">{$_('download_scene')}</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.battle-scene-file-input {
		display: none;
	}
</style>
