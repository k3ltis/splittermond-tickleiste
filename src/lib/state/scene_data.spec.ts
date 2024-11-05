import { describe, it, expect } from 'vitest';
import { CombatState, createNewCombatant, sceneData, sortCombatantsByInitiative, type Combatant } from "./scene_data.svelte";

function createCombatant(id: string, name: string, initiative: number): Combatant {
	return {id: id, name: name, initiative: initiative, combatState: CombatState.Active}
}

describe('sortCombatantsByInitiative test', () => {
	it('sorts combatants by initiative', () => {
		sceneData.combatants = [
			createCombatant("1", "Gandalf", 8),
			createCombatant("2", "Merry", 6),
			createCombatant("3", "Arwen", 6),
			createCombatant("4", "Eowyn", 12),
			createCombatant("5", "Saruman", 3),
		]
		
		sortCombatantsByInitiative()
		
		expect(sceneData.combatants).toEqual([
			createCombatant("5", "Saruman", 3),
			createCombatant("2", "Merry", 6),
			createCombatant("3", "Arwen", 6),
			createCombatant("1", "Gandalf", 8),
			createCombatant("4", "Eowyn", 12),
		])
	});

	it('within an equivalence class, recently active combatants are put to the end', () => {
		const merry = createCombatant("3", "Merry", 6)
		sceneData.combatants = [
			createCombatant("1", "Gandalf", 8),
			createCombatant("2", "Pippin", 6),
			merry,
			createCombatant("4", "Eowyn", 3),
			createCombatant("5", "Legolas", 6),
			createCombatant("6", "Orc Commander", 12),
			createCombatant("7", "Saruman", 3),
			createCombatant("8", "Arwen", 3),
		]

		sortCombatantsByInitiative(merry)

		expect(sceneData.combatants).toEqual([
			createCombatant("4", "Eowyn", 3),
			createCombatant("7", "Saruman", 3),
			createCombatant("8", "Arwen", 3),
			createCombatant("2", "Pippin", 6),
			createCombatant("5", "Legolas", 6),
			createCombatant("3", "Merry", 6),
			createCombatant("1", "Gandalf", 8),
			createCombatant("6", "Orc Commander", 12),
		])
	});
});
