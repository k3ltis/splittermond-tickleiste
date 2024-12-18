<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { driver } from 'driver.js';
	import { CircleHelp } from 'lucide-svelte';
	import { sessionData } from '$lib/state/scene_data.svelte';

	const COMBATANT_MODAL_ELEMENT_ID = 'tickSelectionModal';
	const TICKS_BUTTON_ELEMENT_ID = 'tab-tick-selection';
	const CONDITIONS_BUTTON_ELEMENT_ID = 'tab-condition-selection';
	const HEADER_MENU_DROPDOWN_ELEMENT_ID = 'header-menu-dropdown';

	const forceOpenDropdown = () => {
		let dropdownElement = document.getElementById(HEADER_MENU_DROPDOWN_ELEMENT_ID);
		dropdownElement?.setAttribute('open', 'open');
	};

	const closeDropdown = () => {
		let dropdownElement = document.getElementById(HEADER_MENU_DROPDOWN_ELEMENT_ID);
		dropdownElement?.removeAttribute('open');
	};

	const forceOpenTickSelectionModal = () => {
		let modal = document.getElementById(COMBATANT_MODAL_ELEMENT_ID);
		modal?.classList.add('modal-open');
		modal?.classList.remove('hidden');
	};

	const closeTickSelectionModal = () => {
		let modal = document.getElementById(COMBATANT_MODAL_ELEMENT_ID);
		modal?.classList.remove('modal-open');
		modal?.classList.add('hidden');
	};

	function selectTicksButton() {
		let tickbutton = document.getElementById(TICKS_BUTTON_ELEMENT_ID);
		tickbutton?.setAttribute('aria-selected', 'true');
		let conditionButton = document.getElementById(CONDITIONS_BUTTON_ELEMENT_ID);
		conditionButton?.setAttribute('aria-selected', 'false');
	}

	function selectConditionButton() {
		let tickbutton = document.getElementById(TICKS_BUTTON_ELEMENT_ID);
		tickbutton?.setAttribute('aria-selected', 'false');
		let conditionButton = document.getElementById(CONDITIONS_BUTTON_ELEMENT_ID);
		conditionButton?.setAttribute('aria-selected', 'true');
	}

	const explainPage = () => {
		const driverObj = driver({
			popoverClass: 'driverjs-theme',
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
						title: $_('tour.toggle_scene_mode.title'),
						description: $_('tour.toggle_scene_mode.content')
					}
				},
				{
					element: '#tickSelectionModalInner',
					popover: {
						title: $_('tour.combatant_modal.ticks.title'),
						description: $_('tour.combatant_modal.ticks.content')
					},
					onHighlightStarted: () => {
						forceOpenTickSelectionModal();
						selectTicksButton();
						sessionData.ticks = [
							{
								number: 1,
								hasCombatants: false,
								mode: 'relative'
							},
							{
								number: 2,
								hasCombatants: true,
								mode: 'relative'
							},
							{
								number: -3,
								hasCombatants: false,
								mode: 'relative'
							},
							{
								number: 42,
								hasCombatants: false,
								mode: 'absolute'
							}
						];
					},
					onDeselected: () => {
						sessionData.ticks = [];
						closeTickSelectionModal();
					}
				},
				{
					element: '#tickSelectionModalInner',
					popover: {
						title: $_('tour.combatant_modal.conditions.title'),
						description: $_('tour.combatant_modal.conditions.content')
					},
					onHighlightStarted: () => {
						forceOpenTickSelectionModal();
						selectConditionButton();
					},
					onDeselected: () => {
						sessionData.ticks = [];
						closeTickSelectionModal();
					}
				},
				{
					element: '#downloadBtn',
					popover: {
						title: $_('download_scene'),
						description: $_('download_scene_description')
					},
					onHighlightStarted: () => {
						forceOpenDropdown();
					},
					onDeselected: () => {
						closeDropdown();
					}
				},
				{
					element: '#uploadButton',
					popover: {
						title: $_('upload_scene'),
						description: $_('upload_scene_description')
					},
					onHighlightStarted: () => {
						forceOpenDropdown();
					},
					onDeselected: () => {
						closeDropdown();
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

<button onclick={() => explainPage()} class="btn btn-ghost" aria-label={$_('start_tour')}>
	<CircleHelp aria-hidden />
</button>

<style lang="postcss">
	:global(.driverjs-theme) {
		background-color: theme(colors.primary);
		color: theme(colors.primary-content);
	}

	:global(.driver-popover-progress-text) {
		color: theme(colors.primary-content);
	}

	:global(.driver-popover-navigation-btns > button) {
		color: theme(colors.info-content);
		text-shadow: 0px 0px 0 #fff;
		background-color: theme(colors.info);
	}

	:global(.driver-popover-close-btn) {
		color: theme(colors.primary-content);
	}
</style>
