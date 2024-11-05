<script lang="ts">
	import { base } from '$app/paths';
	let dataPrivacyModal: HTMLDialogElement;
	import { _, locale } from 'svelte-i18n';

	function toggleLanguage() {
		$locale = $locale === 'en' ? 'de' : 'en';
	}
</script>

<footer class="footer flex items-center border-t-4 border-primary-content p-4 text-neutral">
	<aside class="flex-1">
		<p class="hidden sm:flex">Copyright © k3ltis {new Date().getFullYear()} - {__APP_NAME__} v{__APP_VERSION__}</p>
		<p class="sm:hidden">v{__APP_VERSION__}</p>
	</aside>
	<button onclick={() => toggleLanguage()}>Langauge</button>
	<button onclick={() => dataPrivacyModal.showModal()}>{$_("data_privacy")}</button>
	<nav class="flex-none">
		<a href="https://github.com/k3ltis/splittermond-tickleiste" target="_blank">
			<img width="30em" src="{base}/svg/github-142-svgrepo-com.svg" alt="github" />
		</a>
	</nav>
</footer>

<dialog id="dataPrivacyModal" bind:this={dataPrivacyModal} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">{$_("data_privacy_header")}</h3>
		<p class="py-4">{$_("data_privacy_content")}</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
