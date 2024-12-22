<script lang="ts">
	import { X } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { loadAttribute, saveAttribute } from '$lib/state/localstorage';
	import { _, locale } from 'svelte-i18n';
	import { DEFAULT_LOCALE, KEY_LOCALE, Locale } from '$lib/utility/locale';

	let dataPrivacyModal: HTMLDialogElement;
	// eslint-disable-next-line no-undef
	const APP_NAME = __APP_NAME__;
	// eslint-disable-next-line no-undef
	const APP_VERSION = __APP_VERSION__;

	let selected_locale: string = $state(loadAttribute<string>(KEY_LOCALE) || DEFAULT_LOCALE);
	let isModalOpen: boolean = $state(false);

	function toggleLanguage() {
		selected_locale = selected_locale === Locale.German ? Locale.English : Locale.German;
		saveAttribute(KEY_LOCALE, selected_locale);
		$locale = selected_locale;
		document.title = $_('app_title');
	}

	function openDataPrivacy() {
		isModalOpen = true;
		dataPrivacyModal.showModal();
	}
</script>

<footer
	class="footer flex items-center border-t-4 border-primary bg-primary-content/10 p-4 text-base-content"
>
	<div class="flex-1">
		<p class="hidden sm:flex">
			Copyright © k3ltis {new Date().getFullYear()} - {APP_NAME} v{APP_VERSION}
		</p>
		<p class="sm:hidden">v{APP_VERSION}</p>
	</div>
	<button onclick={openDataPrivacy}>{$_('data_privacy')}</button>
	<button id="ToggleLanguageBtn" onclick={() => toggleLanguage()}>
		{#if $locale === 'en'}
			<img
				width="30em"
				src="{base}/svg/flag-for-flag-germany-svgrepo-com.svg"
				alt="Sprache auf Deutsch stellen"
			/>
		{:else}
			<img
				width="30em"
				src="{base}/svg/flag-for-flag-united-kingdom-svgrepo-com.svg"
				alt="Set language to English"
			/>
		{/if}
	</button>
	<nav class="flex-none">
		<a href="https://github.com/k3ltis/splittermond-tickleiste">
			<span class="sr-only">Github project</span>
			<svg
				width="24px"
				height="24px"
				viewBox="0 0 20 20"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				class="custom-icon"
				aria-hidden="true"
			>
				<title>Github</title>
				<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g transform="translate(-140.000000, -7559.000000)" fill="#000000">
						<g id="icons" transform="translate(56.000000, 160.000000)">
							<path
								d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
								id="github-[#142]"
							>
							</path>
						</g>
					</g>
				</g>
			</svg>
		</a>
	</nav>
</footer>

<dialog
	id="dataPrivacyModal"
	bind:this={dataPrivacyModal}
	class="modal"
	class:hidden={!isModalOpen}
	onclose={() => (isModalOpen = false)}
	aria-labelledby="footerDialogTitle"
	aria-describedby="dialogDesc"
>
	<div class="modal-box">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
		<h3 class="text-lg font-bold" id="footerDialogTitle">{$_('data_privacy_header')}</h3>
		<div class="py-4" id="dialogDesc">
			<p>{$_('data_privacy_content_1')}</p>
			<p class="mt-6">{$_('data_privacy_content_2')}</p>
		</div>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
