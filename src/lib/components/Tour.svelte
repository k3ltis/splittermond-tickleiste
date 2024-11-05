<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { driver } from 'driver.js';
	import { CircleHelp } from 'lucide-svelte';
	import { sessionData } from "$lib/state/scene_data.svelte";

	const forceOpenDropdown = (element?: Element) => {
		let dropdownElement = element?.closest('.dropdown');
		dropdownElement?.classList.add('dropdown-open');
	};

	const closeDropdown = (element?: Element) => {
		let dropdownElement = element?.closest('.dropdown');
		dropdownElement?.classList.remove('dropdown-open');
	};

	const forceOpenTickSelectionModal = () => {
		let modal = document.getElementById("tickSelectionModal")
		modal?.classList.add('modal-open');
	};

	const closeTickSelectionModal = () => {
		let modal = document.getElementById("tickSelectionModal")
		modal?.classList.remove('modal-open');
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
					element: '.change-scene-mode',
					popover: {
						title: $_('edit_scene'),
						description: $_('edit_scene_description')
					}
				},
				{
					element: '.change-scene-mode',
					popover: {
						title: $_('run_scene'),
						description: $_('run_scene_description')
					}
				},
                {
					element: '#tickSelectionModalInner',
					popover: {
						title: $_('tour.tick_selection_modal.overview.title'),
						description: $_('tour.tick_selection_modal.overview.content')
					},
                    onHighlightStarted: () => {
						forceOpenTickSelectionModal();
                        sessionData.ticks = [
                            {
                                number: 1,
                                hasCombatants: false,
                                mode: "relative",
                            },
                            {
                                number: 2,
                                hasCombatants: true,
                                mode: "relative",
                            },
                            {
                                number: -3,
                                hasCombatants: false,
                                mode: "relative",
                            },
                            {
                                number: 42,
                                hasCombatants: false,
                                mode: "absolute",
                            }
                        ]
					},
					onDeselected: () => {
                        sessionData.ticks = []
						closeTickSelectionModal();
					}
                },
				{
					element: '#downloadBtn',
					popover: {
						title: $_('download_scene'),
						description: $_('download_scene_description')
					},
					onHighlightStarted: (element?: Element) => {
						forceOpenDropdown(element);
					},
					onDeselected: (element?: Element) => {
						closeDropdown(element);
					}
				},
				{
					element: '#uploadButton',
					popover: {
						title: $_('upload_scene'),
						description: $_('upload_scene_description')
					},
					onHighlightStarted: (element?: Element) => {
						forceOpenDropdown(element);
					},
					onDeselected: (element?: Element) => {
						closeDropdown(element);
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
</script>

<button onclick={() => explainPage()} class="btn btn-ghost">
	<CircleHelp />
</button>
