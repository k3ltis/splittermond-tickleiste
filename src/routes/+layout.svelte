<script module>
	import { DEFAULT_LOCALE } from '$lib/utility/locale';
	import { waitLocale } from 'svelte-i18n';

	export async function preload() {
		// awaits for the loading of the default locale ('de') dictionary
		return waitLocale(DEFAULT_LOCALE);
	}
</script>

<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
