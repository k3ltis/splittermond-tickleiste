import type { Scene } from "./combatants.svelte";

export const saveSceneToLocalStorage = (scene: Scene) => {
    localStorage.setItem('scene', JSON.stringify(scene));
    console.log('Data saved to localStorage');
}

export const loadSceneFromLocalStorage = (): Scene | null => {
    const sceneDataRaw = localStorage.getItem('scene');
    if (sceneDataRaw) {
        const sceneData = JSON.parse(sceneDataRaw)
        console.log('scene loaded from localStorage');
        return sceneData
    }
    console.log('no scene found in localStorage');
    return null
}