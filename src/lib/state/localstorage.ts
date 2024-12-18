import type { Scene } from './scene_data.svelte';

// Save a single attribute to local storage
export const saveAttribute = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value));
	console.info(`Data saved to localStorage with key: ${key}`);
};

// Load a single attribute from local storage
export const loadAttribute = <T>(key: string): T | null => {
	const dataRaw = localStorage.getItem(key);
	if (dataRaw) {
		console.info(`Data loaded from localStorage with key: ${key}`);
		return JSON.parse(dataRaw) as T;
	}
	console.info(`No data found in localStorage with key: ${key}`);
	return null;
};

// Remove a single attribute from local storage
export const removeAttribute = (key: string) => {
	localStorage.removeItem(key);
	console.info(`Data removed from localStorage with key: ${key}`);
};

export const saveSceneToLocalStorage = (scene: Scene) => {
	localStorage.setItem('scene', JSON.stringify(scene));
	console.info('Data saved to localStorage');
};

export const loadSceneFromLocalStorage = (): Scene | null => {
	const sceneDataRaw = localStorage.getItem('scene');
	if (sceneDataRaw) {
		const sceneData = JSON.parse(sceneDataRaw);
		console.info('Scene loaded from localStorage');
		return sceneData;
	}
	console.info('No scene found in localStorage');
	return null;
};
