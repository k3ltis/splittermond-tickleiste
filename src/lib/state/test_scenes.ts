import type { Combatant, Scene } from './scene_data.svelte';

export const TEST_SCENE_EMPTY: Scene = {
	name: 'My Scene',
	combatants: [] as Combatant[],
	mostRecentTick: 0,
	version: 0,
	settings: { customConditions: [], disabledConditions: [] }
};
export const TEST_SCENE_SMALL: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 3,
			combatState: 'Active',
			conditionStates: [],
			color: null
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 4,
			combatState: 'Active',
			conditionStates: [],
			color: null
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 9,
			combatState: 'Active',
			conditionStates: [],
			color: null
		}
	],
	mostRecentTick: 0,
	version: 0,
	settings: { customConditions: [], disabledConditions: [] }
};
export const TEST_SCENE_BIG: Scene = {
	name: 'Fighting Saruman',
	combatants: [
		{
			id: 'ArwenId',
			name: 'Arwen',
			initiative: 7,
			combatState: 'Waiting',
			conditionStates: [],
			color: null
		},
		{
			id: 'OrcCommanderId',
			name: 'Orc Commander',
			initiative: -3,
			combatState: 'Expecting',
			conditionStates: [],
			color: null
		},
		{
			id: 'SarumanId',
			name: 'Saruman',
			initiative: 19,
			combatState: 'Active',
			conditionStates: [],
			color: null
		},
		{
			id: 'MerryId',
			name: 'Merry',
			initiative: 13,
			combatState: 'Active',
			conditionStates: [],
			color: null
		},
		{
			id: 'GandalfId',
			name: 'Gandalf',
			initiative: 14,
			combatState: 'Active',
			conditionStates: [],
			color: null
		},
		{
			id: 'UrukId',
			name: 'Uruk',
			initiative: 14,
			combatState: 'Dead',
			conditionStates: [],
			color: null
		}
	],
	mostRecentTick: 0,
	version: 0,
	settings: { customConditions: [], disabledConditions: [] }
};
export const TEST_SCENE_WITH_CONDITIONS: Scene = {
	name: 'TEST_SCENE_WITH_CONDITIONS',
	combatants: [
		{
			id: 'combatant_1',
			name: 'Combatant 1',
			initiative: 7,
			combatState: 'Active',
			conditionStates: [{ id: 'custom_condition_id', activeLevel: 1, activeSinceTick: 3 }],
			color: null
		},
		{
			id: 'combatant_2',
			name: 'Combatant 2',
			initiative: -3,
			combatState: 'Active',
			conditionStates: [{ id: 'burning', activeLevel: 2, activeSinceTick: 3 }],
			color: null
		}
	],
	mostRecentTick: 0,
	version: 0,
	settings: {
		customConditions: [
			{ i18n: 'custom condition', id: 'custom_condition_id', maxLevel: 4 },
			{ i18n: 'custom condition 2', id: 'custom_condition_2_id', maxLevel: 4 }
		],
		disabledConditions: ['bleeding', 'custom_condition_2_id']
	}
};
