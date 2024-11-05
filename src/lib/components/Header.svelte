<script lang="ts">
    import { base } from '$app/paths';
	import { loadScene, scene, type Scene } from '$lib/state/combatants.svelte';
import { extractFileContentAsJSON, downloadJSON } from "$lib/state/fileio.svelte";

const uploadScene = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
        const file = target.files[0];
        if (file) {
            extractFileContentAsJSON(file).then((scene: Scene) => {
                loadScene(scene)
            })
        }
    }
};

const downloadScene = () => {
    downloadJSON(scene)
}
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl">Splittermond Tickleiste</a>
	</div>
	<div class="flex-none space-x-2">
        <label for="battleScene" class="btn">
            <img width="30em" src="{base}/svg/upload-svgrepo-com.svg" alt="download" />
            Upload JSON
        </label>
        <input
            type="file"
            id="battleScene"
            name="battleScene"
            accept="application/json"
            class="file-input battle-scene-file-input w-full max-w-xs"
            onchange="{uploadScene}"
        />
        <button onclick={() => downloadScene()} class="btn">
            <img width="30em" src="{base}/svg/download-svgrepo-com.svg" alt="download" />
            Download JSON
        </button>
	</div>
</div>

<style>
    .battle-scene-file-input {
        display: none;
    }
</style>