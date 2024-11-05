<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { loadScene, saveScene, sceneData } from '$lib/state/scene.svelte';
	import { onMount } from 'svelte';
	import { loadSceneFromLocalStorage, saveSceneToLocalStorage } from '$lib/state/localstorage';
	import Scene from '$lib/components/Scene.svelte';

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

<Header />
<Scene />
