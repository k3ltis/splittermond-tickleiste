<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { loadScene, saveScene, sceneData } from '$lib/state/scene_data.svelte';
	import { onMount } from 'svelte';
	import { loadSceneFromLocalStorage } from '$lib/state/localstorage';
	import Scene from '$lib/components/Scene.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { initI18n } from '../i18n';
	import { _ } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';

	let loading = $state(true);

	onMount(async () => {
		await initI18n();

		const _scene = loadSceneFromLocalStorage();
		if (_scene) {
			loadScene(_scene);
		}
		// hide loading state after everything has been initialized
		loading = false;
		// ensure that title of HTML is set in correct language
		document.title = $_('app_title');
	});

	$inspect(sceneData);

	$effect(() => {
		if (!loading) saveScene();
	});
</script>

<div>
	<!-- <Debug /> -->
	{#if loading}
		<div
			class="absolute flex h-full w-full flex-col items-center justify-center bg-base-300"
			out:fade
		>
			<img class="max-h-20" src="{base}/logo.png" alt="splittermond logo" />
			<span class="loading loading-ring loading-lg my-8 text-primary"></span>
		</div>
	{:else}
		<div in:fade={{ delay: 200 }} class="flex min-h-screen flex-col">
			<Header />
			<Scene />
			<Footer />
		</div>
	{/if}
</div>
