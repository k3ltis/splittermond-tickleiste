import type { Combatant, Scene } from './scene_data.svelte';

export const TEST_SCENE_EMPTY: Scene = {
	name: 'My Scene',
	combatants: [] as Combatant[],
	mostRecentTick: 0
};
export const TEST_SCENE_SMALL: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 3,
			combatState: 'Active'
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 4,
			combatState: 'Active'
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 9,
			combatState: 'Active'
		}
	],
	mostRecentTick: 0
};
export const TEST_SCENE_BIG: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'ArwenId',
			name: 'Arwen',
			initiative: 7,
			combatState: 'Waiting'
		},
		{
			id: 'OrcCommanderId',
			name: 'Orc Commander',
			initiative: -3,
			combatState: 'Expecting'
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 19,
			combatState: 'Active'
		},
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 13,
			combatState: 'Active'
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 14,
			combatState: 'Active'
		},
		{
			id: 'UrukId',
			name: 'Uruk',
			initiative: 14,
			combatState: 'Dead'
		}
	],
	mostRecentTick: 0
};
