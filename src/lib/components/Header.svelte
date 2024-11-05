<script lang="ts">
    import { base } from '$app/paths';
	import { loadScene, sceneData, type Scene } from '$lib/state/scene.svelte';
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
        // Reset target value to allow uploading the same file multiple times
        // see https://stackoverflow.com/a/56258902 for details
        target.value = ""
    }
};

const downloadScene = () => {
    let filename = sceneData.name.toLowerCase().trim().replace(/\s+/g, "_");
    downloadJSON(sceneData, filename)
}

const explainPage = () => {
    
}
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl">Splittermond Tickleiste</a>
	</div>
	<div class="flex-none space-x-2">
        <label for="battleScene" class="btn">
            <img width="30em" src="{base}/svg/upload-svgrepo-com.svg" alt="download" />
            Upload Scene
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
            Download Scene
        </button>
        <button onclick={() => explainPage()} class="btn">
            <img width="30em" src="{base}/svg/question-svgrepo-com.svg" alt="download" />
        </button>
	</div>
</div>

<style>
    .battle-scene-file-input {
        display: none;
    }
</style>