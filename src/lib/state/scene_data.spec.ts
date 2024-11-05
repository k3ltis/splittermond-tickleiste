import { describe, it, expect } from 'vitest';
import { createNewCombatant, sceneData, sortCombatantsByInitiative, type Combatant } from "./scene_data.svelte";

describe('sortCombatantsByInitiative test', () => {
	it('sorts combatants by initiative', () => {
		sceneData.combatants = [
			{id: "1", name: "Gandalf", initiative: 8},
			{id: "2", name: "Merry", initiative: 6},
			{id: "3", name: "Arwen", initiative: 6},
			{id: "4", name: "Eowyn", initiative: 12},
			{id: "5", name: "Saruman", initiative: 3},
		]
		
		sortCombatantsByInitiative()
		
		expect(sceneData.combatants).toEqual([
			{id: "5", name: "Saruman", initiative: 3},
			{id: "2", name: "Merry", initiative: 6},
			{id: "3", name: "Arwen", initiative: 6},
			{id: "1", name: "Gandalf", initiative: 8},
			{id: "4", name: "Eowyn", initiative: 12},
		])
	});

	it('within an equivalence class, recently active combatants are put to the end', () => {
		sceneData.combatants = [
			{id: "1", name: "Gandalf", initiative: 8},
			{id: "2", name: "Pippin", initiative: 6},
			{id: "3", name: "Merry", initiative: 6},
			{id: "4", name: "Eowyn", initiative: 3},
			{id: "5", name: "Legolas", initiative: 6},
			{id: "6", name: "Orc Commander", initiative: 12},
			{id: "7", name: "Saruman", initiative: 3},
			{id: "8", name: "Arwen", initiative: 3},
		]

		sortCombatantsByInitiative({id: "3", name: "Merry", initiative: 6})

		expect(sceneData.combatants).toEqual([
			{id: "4", name: "Eowyn", initiative: 3},
			{id: "7", name: "Saruman", initiative: 3},
			{id: "8", name: "Arwen", initiative: 3},
			{id: "2", name: "Pippin", initiative: 6},
			{id: "5", name: "Legolas", initiative: 6},
			{id: "3", name: "Merry", initiative: 6},
			{id: "1", name: "Gandalf", initiative: 8},
			{id: "6", name: "Orc Commander", initiative: 12},
		])
	});
});
