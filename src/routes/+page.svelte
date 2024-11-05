<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { loadScene, saveScene, sceneData } from '$lib/state/scene_data.svelte';
	import { onMount } from 'svelte';
	import { loadSceneFromLocalStorage } from '$lib/state/localstorage';
	import Scene from '$lib/components/Scene.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../i18n';

	onMount(() => {
		const _scene = loadSceneFromLocalStorage();
		if (_scene) {
			loadScene(_scene);
		}
	});

	$inspect(sceneData);

	$effect(() => {
		saveScene();
	});
</script>

<div class="flex min-h-screen flex-col">
	<!-- <Debug /> -->
	<Header />
	<Scene />
	<Footer />
</div>
