import type { Scene } from './scene_data.svelte';

function migrationStep1(scene: Scene): Scene {
	const version = 1;
	if (scene.version === undefined) {
		scene.version = version;
	}
	scene.combatants.forEach((c) => {
		if (c.conditionStates === undefined) {
			c.conditionStates = [];
		}
	});
	return scene;
}

export function migrateScene(scene: Scene): Scene {
	scene = migrationStep1(scene);
	return scene;
}
