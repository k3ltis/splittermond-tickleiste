import type { Scene } from './scene_data.svelte';

function migrationStep1(scene: Scene): Scene {
	const version = 1;
	if (scene.version && scene.version >= version) {
		return scene;
	} else {
		scene.version = version;
	}

	scene.combatants.forEach((c) => {
		if (c.conditionStates === undefined) {
			c.conditionStates = [];
		}
	});
	return scene;
}

function migrationStep2(scene: Scene): Scene {
	const version = 2;
	if (scene.version && scene.version >= version) {
		return scene;
	} else {
		scene.version = version;
	}

	if (!scene.settings) {
		scene.settings = { customConditions: [], disabledConditions: [] };
	}
	return scene;
}

function migrationStep3(scene: Scene): Scene {
	const version = 3;
	if (scene.version && scene.version >= version) {
		return scene;
	} else {
		scene.version = version;
	}

	scene.combatants.forEach((c) => {
		c.color = null;
	});

	return scene;
}

export function migrateScene(scene: Scene): Scene {
	scene = migrationStep1(scene);
	scene = migrationStep2(scene);
	scene = migrationStep3(scene);
	return scene;
}
