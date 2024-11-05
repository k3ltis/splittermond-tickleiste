<script lang="ts">
	import { loadScene, sceneData, type Scene } from '$lib/state/scene_data.svelte';
	import { extractFileContentAsJSON, downloadJSON } from '$lib/state/fileio.svelte';
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';
	import { _ } from 'svelte-i18n';
	import { Download, Upload, CircleHelp, Menu } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

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

	const forceOpenClosestDropdown = (element?: Element) => {
		let dropdownElement = element?.closest('.dropdown');
		dropdownElement?.classList.add('dropdown-open');
	};

	const closeClosestDropdown = (element?: Element) => {
		let dropdownElement = element?.closest('.dropdown');
		dropdownElement?.classList.remove('dropdown-open');
	};

	const explainPage = () => {
		const driverObj = driver({
			showProgress: true,
			nextBtnText: $_('tour_btn_next'),
			prevBtnText: $_('tour_btn_prev'),
			doneBtnText: $_('tout_btn_done'),
			progressText: $_('tour_progress_text'),
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
					},
					onHighlightStarted: (element?: Element) => {
						forceOpenClosestDropdown(element);
					},
					onDeselected: (element?: Element) => {
						closeClosestDropdown(element);
					}
				},
				{
					element: '#uploadButton',
					popover: {
						title: $_('upload_scene'),
						description: $_('upload_scene_description')
					},
					onHighlightStarted: (element?: Element) => {
						forceOpenClosestDropdown(element);
					},
					onDeselected: (element?: Element) => {
						closeClosestDropdown(element);
					}
				},
				{
					element: '#ThemeToggle',
					popover: {
						title: $_('tour.change_theme.title'),
						description: $_('tour.change_theme.content')
					}
				},
				{
					element: '#ToggleLanguageBtn',
					popover: {
						title: $_('tour.change_langauge.title'),
						description: $_('tour.change_langauge.content')
					}
				}
			]
		});

		driverObj.drive();
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
	class="navbar fixed top-0 border-b-4 border-primary-content bg-primary-content/20 backdrop-blur-xl"
>
	<div class="flex-1">
		<a class="btn btn-ghost text-xl sm:hidden">ST</a>
		<a class="btn btn-ghost hidden text-xl sm:flex">{$_('app_title')}</a>
	</div>
	<div class="flex-none space-x-2">
		<ThemeToggle />
		<button onclick={() => explainPage()} class="btn btn-ghost">
			<CircleHelp />
		</button>
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
