import type { Scene } from './scene_data.svelte';

// Save a single attribute to local storage
export const saveAttribute = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value));
	console.log(`Data saved to localStorage with key: ${key}`);
};

// Load a single attribute from local storage
export const loadAttribute = <T>(key: string): T | null => {
	const dataRaw = localStorage.getItem(key);
	if (dataRaw) {
		console.log(`Data loaded from localStorage with key: ${key}`);
		return JSON.parse(dataRaw) as T;
	}
	console.log(`No data found in localStorage with key: ${key}`);
	return null;
};

// Remove a single attribute from local storage 
export const removeAttribute = (key: string) => {
	localStorage.removeItem(key);
	console.log(`Data removed from localStorage with key: ${key}`);
};

export const saveSceneToLocalStorage = (scene: Scene) => {
	localStorage.setItem('scene', JSON.stringify(scene));
	console.log('Data saved to localStorage');
};

export const loadSceneFromLocalStorage = (): Scene | null => {
	const sceneDataRaw = localStorage.getItem('scene');
	if (sceneDataRaw) {
		const sceneData = JSON.parse(sceneDataRaw);
		console.log('scene loaded from localStorage');
		return sceneData;
	}
	console.log('no scene found in localStorage');
	return null;
};
