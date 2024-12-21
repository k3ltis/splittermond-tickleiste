import { generateUUID } from '$lib/utility/uuid';
import { conditions, type Condition } from './condition';
import { sceneData, type ConditionState } from './scene_data.svelte';

export function getConditionById(id: string) {
	return getAllConditions().find((c) => c.id === id);
}

export function getAllConditions(
	{ onlyActive }: { onlyActive: boolean } = { onlyActive: false }
): Condition[] {
	const allConditions = [...conditions, ...sceneData.settings.customConditions];

	if (!onlyActive) return allConditions;

	const activeCondtions = allConditions.filter((condition: Condition) => {
		return !sceneData.settings.disabledConditions.includes(condition.id);
	});

	return activeCondtions;
}

export function toggleConditionVisibility(conditionId: string) {
	const disabledConditionIndex = sceneData.settings.disabledConditions.findIndex(
		(disabledConditionId: string) => {
			return disabledConditionId === conditionId;
		}
	);

	// Disable condition
	if (disabledConditionIndex < 0) {
		sceneData.settings.disabledConditions.push(conditionId);
		return;
	}

	// Enable condition
	sceneData.settings.disabledConditions.splice(disabledConditionIndex, 1);
}

export function addCustomCondition(condition: Pick<Condition, 'i18n' | 'maxLevel'>) {
	sceneData.settings.customConditions.push({
		i18n: condition.i18n,
		maxLevel: condition.maxLevel,
		id: generateUUID()
	});
}

export function deleteCustomCondition(conditionId: string) {
	const conditionToBeDeletedIndex = sceneData.settings.customConditions.findIndex(
		(condition: Condition) => {
			return condition.id === conditionId;
		}
	);

	// No condition with given ID found
	if (conditionToBeDeletedIndex < 0) {
		console.error(
			`Custom deletion unsuccessful: Condition with ID "${conditionId}" could not be found in custom conditions.`
		);
		return;
	}

	// delete custom condition
	sceneData.settings.customConditions.splice(conditionToBeDeletedIndex, 1);
}

export function toggleCondition(combatantId: string, conditionId: string) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}
	const condition = getConditionById(conditionId);
	if (!condition) {
		console.error('Cannot find condition with id ' + conditionId);
		return;
	}

	const conditionStateIndex = combatant.conditionStates.findIndex(
		(conditionState) => conditionState.id === conditionId
	);

	// condition did not exist yet
	if (conditionStateIndex < 0) {
		console.info(`Add condition ${conditionId} to combatant ${combatantId}`);
		const conditionLevel = condition.maxLevel > 0 ? 1 : 0;
		// create new condition
		const conditionState: ConditionState = {
			id: conditionId,
			activeSinceTick: combatant.initiative,
			activeLevel: conditionLevel
		};
		// add new condition
		combatant.conditionStates.push(conditionState);
		return;
	}

	// condition does exist
	const conditionState = combatant.conditionStates[conditionStateIndex];

	// max level was reached, remove the condition
	if (conditionState.activeLevel >= condition.maxLevel) {
		console.info(`Remove condition ${conditionId} from combatant ${combatantId}`);
		combatant.conditionStates.splice(conditionStateIndex, 1);
		return;
	}

	// condition exists and has not reached max level yet, increase level
	const previousLevel = conditionState.activeLevel;
	conditionState.activeLevel += 1;
	console.info(
		`Increase level of condition state ${conditionState.id} from ${previousLevel} to ${conditionState.activeLevel}`
	);
}
