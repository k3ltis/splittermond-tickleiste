import type { Combatant, Scene } from './scene_data.svelte';

export const TEST_SCENE_EMPTY: Scene = {
	name: 'My Scene',
	combatants: [] as Combatant[],
	mostRecentTick: 0,
	version: 0
};
export const TEST_SCENE_SMALL: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 3,
			combatState: 'Active',
			conditionStates: []
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 4,
			combatState: 'Active',
			conditionStates: []
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 9,
			combatState: 'Active',
			conditionStates: []
		}
	],
	mostRecentTick: 0,
	version: 0
};
export const TEST_SCENE_BIG: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'ArwenId',
			name: 'Arwen',
			initiative: 7,
			combatState: 'Waiting',
			conditionStates: []
		},
		{
			id: 'OrcCommanderId',
			name: 'Orc Commander',
			initiative: -3,
			combatState: 'Expecting',
			conditionStates: []
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 19,
			combatState: 'Active',
			conditionStates: []
		},
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 13,
			combatState: 'Active',
			conditionStates: []
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 14,
			combatState: 'Active',
			conditionStates: []
		},
		{
			id: 'UrukId',
			name: 'Uruk',
			initiative: 14,
			combatState: 'Dead',
			conditionStates: []
		}
	],
	mostRecentTick: 0,
	version: 0
};
