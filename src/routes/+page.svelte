<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { loadScene, saveScene, sceneData } from '$lib/state/scene_data.svelte';
	import { onMount } from 'svelte';
	import { loadSceneFromLocalStorage, saveSceneToLocalStorage } from '$lib/state/localstorage';
	import Scene from '$lib/components/Scene.svelte';
	import Footer from "$lib/components/Footer.svelte";
	import "../i18n"
	import Debug from "$lib/components/Debug.svelte";

	onMount(() => {
		const _scene = loadSceneFromLocalStorage();
		if (_scene) {
			loadScene(_scene)
		}
	});

	$inspect(sceneData)

	$effect(() => {
		saveScene()
	});
</script>

<div class="flex flex-col min-h-screen">
	<!-- <Debug /> -->
	<Header />
	<Scene />
	<Footer />
</div>
