import { describe, it, expect, beforeEach } from 'vitest';
import {
	getSceneDataForExport,
	loadScene,
	moveCombatantByTicks,
	moveCombatantToTick,
	sceneData,
	setCombatantCombatStateToDead,
	setCombatantCombatStateToExpecting,
	setCombatantCombatStateToWaiting,
	type Combatant,
	type Scene
} from './scene_data.svelte';
import { TEST_SCENE_BIG, TEST_SCENE_EMPTY, TEST_SCENE_SMALL } from './test_scenes';

function givenScene(scene: Scene) {
	Object.assign(sceneData, JSON.parse(JSON.stringify(scene)));
}

function resetStore() {
	givenScene(TEST_SCENE_EMPTY);
}

beforeEach(() => {
	resetStore();
});

describe('loadScene', () => {
	it('assigns scene and sorts combatants', () => {
		loadScene(TEST_SCENE_SMALL);

		expect(sceneData).toMatchObject({
			...TEST_SCENE_SMALL,
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
			]
		});
	});
});

describe('getSceneDataForExport', () => {
	it('returns scene data', () => {
		givenScene(TEST_SCENE_BIG);

		const scene = getSceneDataForExport();

		expect(scene).toEqual({
			...TEST_SCENE_BIG,
			mostRecentTick: 13
		});
	});
});

describe('moveCombatantByTicks', () => {
	it('adds ticks for first acting combatant', () => {
		givenScene(TEST_SCENE_SMALL);
		expect(sceneData).toEqual(TEST_SCENE_SMALL);

		moveCombatantByTicks('MerryId', 6);

		expect(sceneData).toMatchObject({
			...TEST_SCENE_SMALL,
			combatants: [
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
				},
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 9,
					combatState: 'Active'
				}
			],
			// Merry was moved from 3 to 9, thus mostRecentTick is expected to be 3
			mostRecentTick: 3
		});
	});

	it('adds ticks for non-first acting combatant', () => {
		givenScene(TEST_SCENE_SMALL);
		expect(sceneData).toEqual(TEST_SCENE_SMALL);

		moveCombatantByTicks('GandalfId', 6);

		expect(sceneData).toMatchObject({
			...TEST_SCENE_SMALL,
			combatants: [
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 3,
					combatState: 'Active'
				},
				{
					id: 'SarumanId',
					name: 'Saruman',
					initiative: 9,
					combatState: 'Active'
				},
				{
					id: 'GandalfId',
					name: 'Gandalf',
					initiative: 10,
					combatState: 'Active'
				}
			],
			// Gandalf was moved from 4 to 10, but Merry is the first active combatant, thus mostRecentTick stays unchanged
			mostRecentTick: 0
		});
	});

	it('subtracts ticks', () => {
		givenScene(TEST_SCENE_SMALL);
		expect(sceneData).toEqual(TEST_SCENE_SMALL);

		moveCombatantByTicks('MerryId', -8);

		expect(sceneData).toMatchObject({
			...TEST_SCENE_SMALL,
			combatants: [
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: -5,
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
			// Merry was moved from 3 to -5
			mostRecentTick: 3
		});
	});
});

describe('moveCombatantToTick', () => {
	it.each(['ArwenId', 'OrcCommanderId', 'UrukId'])(
		'Moves combatant from special state to Active',
		(combatantId: string) => {
			givenScene(TEST_SCENE_BIG);

			moveCombatantToTick(combatantId, 42);

			const combatant = sceneData.combatants.find((c) => c.id === combatantId);
			expect(combatant).toBeDefined();
			expect((combatant as Combatant).initiative).toEqual(42);
			expect((combatant as Combatant).combatState).toEqual('Active');

			// Combatant is expected to be at the last position of all active combatants
			const lastActiveCombatant = sceneData.combatants
				.filter((c) => c.combatState === 'Active')
				.slice(-1)[0];
			expect(combatant).toEqual(lastActiveCombatant);
		}
	);
});

describe('set combat states', () => {
	describe('setCombatantCombatStateToWaiting', () => {
		it('sets combat state to waiting', () => {
			givenScene(TEST_SCENE_SMALL);

			setCombatantCombatStateToWaiting('SarumanId');

			expect(sceneData.combatants).toMatchObject([
				{
					id: 'SarumanId',
					name: 'Saruman',
					initiative: 9,
					combatState: 'Waiting'
				},
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
				}
			]);
		});

		it('sets multiple combat states to waiting', () => {
			givenScene(TEST_SCENE_SMALL);

			setCombatantCombatStateToWaiting('SarumanId');
			setCombatantCombatStateToWaiting('MerryId');

			expect(sceneData.combatants).toMatchObject([
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 3,
					combatState: 'Waiting'
				},
				{
					id: 'SarumanId',
					name: 'Saruman',
					initiative: 9,
					combatState: 'Waiting'
				},
				{
					id: 'GandalfId',
					name: 'Gandalf',
					initiative: 4,
					combatState: 'Active'
				}
			]);
		});
	});

	describe('setCombatantCombatStateToExpecting', () => {
		it('sets combat state to expecting', () => {
			givenScene(TEST_SCENE_SMALL);

			setCombatantCombatStateToExpecting('GandalfId');

			expect(sceneData.combatants).toMatchObject([
				{
					id: 'GandalfId',
					name: 'Gandalf',
					initiative: 4,
					combatState: 'Expecting'
				},
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 3,
					combatState: 'Active'
				},
				{
					id: 'SarumanId',
					name: 'Saruman',
					initiative: 9,
					combatState: 'Active'
				}
			]);
		});
	});

	describe('setCombatantCombatStateToDead', () => {
		it('sets combat state to dead', () => {
			givenScene(TEST_SCENE_SMALL);

			setCombatantCombatStateToDead('MerryId');

			expect(sceneData.combatants).toMatchObject([
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
				},
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 3,
					combatState: 'Dead'
				}
			]);
		});
	});

	describe('set multiple states', () => {
		it('sorts correctly', () => {
			givenScene(TEST_SCENE_SMALL);

			setCombatantCombatStateToDead('SarumanId');
			setCombatantCombatStateToWaiting('GandalfId');
			setCombatantCombatStateToExpecting('MerryId');

			expect(sceneData.combatants).toMatchObject([
				{
					id: 'GandalfId',
					name: 'Gandalf',
					initiative: 4,
					combatState: 'Waiting'
				},
				{
					id: 'MerryId',
					name: 'Merry',
					initiative: 3,
					combatState: 'Expecting'
				},
				{
					id: 'SarumanId',
					name: 'Saruman',
					initiative: 9,
					combatState: 'Dead'
				}
			]);
		});
	});
});
