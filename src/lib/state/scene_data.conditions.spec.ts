import { describe, it, expect, beforeEach } from 'vitest';
import { moveCombatantByTicks, sceneData, type Scene } from './scene_data.svelte';
import { TEST_SCENE_EMPTY, TEST_SCENE_SMALL, TEST_SCENE_WITH_CONDITIONS } from './test_scenes';
import {
	addCustomCondition,
	deleteCustomCondition,
	getAllConditions,
	getConditionById,
	toggleCondition,
	toggleConditionVisibility
} from './scene_data.conditions.svelte';
import { conditions } from './condition';

function givenScene(scene: Scene) {
	Object.assign(sceneData, JSON.parse(JSON.stringify(scene)));
}

function resetStore() {
	givenScene(TEST_SCENE_EMPTY);
}

beforeEach(() => {
	resetStore();
});

describe('Condition tests', () => {
	describe('getConditionById', () => {
		it('finds default condition by ID', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);

			expect(getConditionById('bleeding')).toEqual({
				i18n: 'condition.bleeding',
				id: 'bleeding',
				maxLevel: 3
			});
		});

		it('finds custom condition by ID', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);

			expect(getConditionById('custom_condition_id')).toEqual({
				i18n: 'custom condition',
				id: 'custom_condition_id',
				maxLevel: 4
			});
		});
	});

	describe('getAllConditions', () => {
		it('returns default and custom conditions', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);

			expect(getAllConditions()).toEqual([
				...conditions,
				{
					i18n: 'custom condition',
					id: 'custom_condition_id',
					maxLevel: 4
				},
				{
					i18n: 'custom condition 2',
					id: 'custom_condition_2_id',
					maxLevel: 4
				}
			]);
		});

		it('returns only active default and custom conditions when parameter is set', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);
			const activeConditions = conditions.filter((condition) => {
				return condition.id !== 'bleeding';
			});

			expect(getAllConditions({ onlyActive: true })).toEqual([
				...activeConditions,
				{
					i18n: 'custom condition',
					id: 'custom_condition_id',
					maxLevel: 4
				}
			]);
		});
	});

	describe('toggleConditionVisibility', () => {
		it('adds condition to disabledList, when currently enabled', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);
			expect(sceneData.settings.disabledConditions).not.toContain('fearful');

			toggleConditionVisibility('fearful');
			expect(sceneData.settings.disabledConditions).toContain('fearful');
		});

		it('removes condition from disabledList, when currently disabled', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);
			expect(sceneData.settings.disabledConditions).toContain('bleeding');

			toggleConditionVisibility('bleeding');
			expect(sceneData.settings.disabledConditions).not.toContain('bleeding');
		});
	});

	describe('addCustomCondition', () => {
		it('adds custom condition', () => {
			givenScene(TEST_SCENE_SMALL);
			const customCondition = { i18n: 'my_custom_condition', maxLevel: 2 };

			addCustomCondition(customCondition);

			expect(sceneData.settings.customConditions).toHaveLength(1);
			expect(sceneData.settings.customConditions[0]).toMatchObject(customCondition);
		});
	});

	describe('deleteCustomCondition', () => {
		it('deletes custom condition', () => {
			givenScene(TEST_SCENE_WITH_CONDITIONS);
			expect(sceneData.settings.customConditions[0]).toMatchObject({
				id: 'custom_condition_id'
			});
			expect(sceneData.settings.customConditions).toHaveLength(2);

			deleteCustomCondition('custom_condition_id');

			expect(sceneData.settings.customConditions[0]).not.toMatchObject({
				id: 'custom_condition_id'
			});
			expect(sceneData.settings.customConditions).toHaveLength(1);
		});
	});

	describe('toggleCondition', () => {
		it('toggle condition', () => {
			givenScene(TEST_SCENE_SMALL);

			// Add bleeding I
			toggleCondition('MerryId', 'bleeding');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([
				{
					activeLevel: 1,
					id: 'bleeding',
					activeSinceTick: 3
				}
			]);

			// Change to bleeding level III
			toggleCondition('MerryId', 'bleeding');
			toggleCondition('MerryId', 'bleeding');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([
				{
					activeLevel: 3,
					id: 'bleeding',
					activeSinceTick: 3
				}
			]);

			// Toggle one more time to remove bleeding
			toggleCondition('MerryId', 'bleeding');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([]);
		});

		it('toggle condition and continue ticks', () => {
			givenScene(TEST_SCENE_SMALL);

			// Add bleeding II for Merry
			toggleCondition('MerryId', 'bleeding');
			toggleCondition('MerryId', 'bleeding');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([
				{
					activeLevel: 2,
					id: 'bleeding',
					activeSinceTick: 3
				}
			]);
			expect(sceneData.combatants.find((c) => c.id === 'GandalfId')?.conditionStates).toEqual([]);

			// Verify that Gandals condition is unaffected by Merry's tick progression
			moveCombatantByTicks('MerryId', 5);
			toggleCondition('GandalfId', 'burning');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([
				{
					activeLevel: 2,
					id: 'bleeding',
					activeSinceTick: 3
				}
			]);
			expect(sceneData.combatants.find((c) => c.id === 'GandalfId')?.conditionStates).toEqual([
				{
					activeLevel: 1,
					id: 'burning',
					activeSinceTick: 4
				}
			]);

			// Advance Gandalf and verify both combatants
			moveCombatantByTicks('GandalfId', 5);
			toggleCondition('GandalfId', 'burning');
			toggleCondition('GandalfId', 'burning');
			expect(sceneData.combatants.find((c) => c.id === 'MerryId')?.conditionStates).toEqual([
				{
					activeLevel: 2,
					id: 'bleeding',
					activeSinceTick: 3
				}
			]);
			expect(sceneData.combatants.find((c) => c.id === 'GandalfId')?.conditionStates).toEqual([
				{
					activeLevel: 3,
					id: 'burning',
					activeSinceTick: 4
				}
			]);

			// Toggle burning away from Gandalf
			toggleCondition('GandalfId', 'burning');
			expect(sceneData.combatants.find((c) => c.id === 'GandalfId')?.conditionStates).toEqual([]);

			// When burning is readded it starts at Gandalfs current offset
			toggleCondition('GandalfId', 'burning');
			expect(sceneData.combatants.find((c) => c.id === 'GandalfId')?.conditionStates).toEqual([
				{
					activeLevel: 1,
					id: 'burning',
					activeSinceTick: 9
				}
			]);
		});
	});
});
