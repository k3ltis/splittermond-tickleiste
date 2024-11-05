<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Combatants from '$lib/components/Combatants.svelte';
	import { loadScene, scene } from '$lib/state/combatants.svelte';
	import { onMount } from 'svelte';
	import { loadSceneFromLocalStorage, saveSceneToLocalStorage } from '$lib/state/localstorage';

	onMount(() => {
		const _scene = loadSceneFromLocalStorage();
		if (_scene) {
			loadScene(_scene)
		}
	});

	$inspect(scene)

	$effect(() => {
		saveSceneToLocalStorage(scene);
	});
</script>

<Header />
<Combatants />
