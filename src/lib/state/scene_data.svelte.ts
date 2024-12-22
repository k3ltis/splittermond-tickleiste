import { v4 as uuid } from 'uuid';
import { saveSceneToLocalStorage } from './localstorage';
import { type Condition } from './condition';
import { migrateScene as migrateSceneData } from './data_migration';

// Types
export type CombatState = 'Active' | 'Dead' | 'Waiting' | 'Expecting';

export type Settings = {
	disabledConditions: string[];
	customConditions: Condition[];
};

export type Scene = {
	version: number;
	name: string;
	combatants: Combatant[];
	mostRecentTick: number;
	settings: Settings;
};

export type ConditionState = {
	id: string;
	activeSinceTick: number;
	// 1-based condition level
	activeLevel: number;
};

export type Combatant = {
	id: string;
	name: string;
	initiative: number;
	combatState: CombatState;
	conditionStates: ConditionState[];
};

export type SessionData = {
	activeCombatant: Combatant | null;
	ticks: Array<Tick>;
};

type TickMode = 'relative' | 'absolute';

export type Tick = {
	number: number;
	hasCombatants: boolean;
	mode: TickMode;
};

type CombatantsPartition = {
	[state in CombatState]: Combatant[];
};

// Reactive States
export const sceneData: Scene = $state({
	version: 0,
	name: 'My Scene',
	combatants: [] as Combatant[],
	mostRecentTick: 0,
	settings: { customConditions: [], disabledConditions: [] }
});

export const sessionData: SessionData = $state({
	activeCombatant: null,
	ticks: []
});

// Functions
export function determineNextActingCombatant(): Combatant | null {
	return sceneData.combatants.find((c) => c.combatState === 'Active') || null;
}

export function createNewCombatant(): Combatant {
	return {
		id: uuid(),
		name: '',
		initiative: 0,
		combatState: 'Active',
		conditionStates: []
	};
}

export function loadScene(_sceneData: Scene) {
	console.info('Load scene:');
	console.dir(_sceneData);
	Object.assign(sceneData, migrateSceneData(_sceneData));
	sortCombatantsByInitiative();
}

export function saveScene() {
	saveSceneToLocalStorage(sceneData);
}

export function getSceneDataForExport(): Scene {
	const _sceneData: Scene = JSON.parse(JSON.stringify(sceneData));
	_sceneData.mostRecentTick = getMinimalActiveInitiative();
	return _sceneData;
}

export function moveCombatantByTicks(combatantId: string, ticks: number) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}

	// Check whether moving combatant is the next one in order
	if (
		sceneData.combatants.length > 0 &&
		combatant === sceneData.combatants.find((c) => c.combatState === 'Active')
	) {
		sceneData.mostRecentTick = combatant.initiative;
	}
	combatant.initiative += ticks;
	sortCombatantsByInitiative(combatant);
}

export function moveCombatantToTick(combatantId: string, tick: number) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}

	const oldCombatState = combatant.combatState;
	combatant.initiative = tick;
	combatant.combatState = 'Active';
	sceneData.mostRecentTick = combatant.initiative;
	if (oldCombatState === 'Expecting') {
		sortCombatantsByInitiative(null, combatant);
	} else {
		sortCombatantsByInitiative(combatant);
	}
}

export function setCombatantCombatStateToWaiting(combatantId: string) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}

	combatant.combatState = 'Waiting';
	sceneData.mostRecentTick = combatant.initiative;
	sortCombatantsByInitiative(combatant);
}

export function setCombatantCombatStateToExpecting(combatantId: string) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}

	combatant.combatState = 'Expecting';
	sceneData.mostRecentTick = combatant.initiative;
	sortCombatantsByInitiative(combatant);
}

export function setCombatantCombatStateToDead(combatantId: string) {
	const combatant = sceneData.combatants.find((c) => c.id === combatantId);
	if (!combatant) {
		console.error('Cannot find combatant with id ' + combatantId);
		return;
	}

	combatant.combatState = 'Dead';
	sortCombatantsByInitiative(combatant);
}

export function resetActiveCombatant() {
	sessionData.activeCombatant = null;
}

export function setMostRecentTickToMinimalActiveInitiative() {
	sceneData.mostRecentTick = getMinimalActiveInitiative();
}

export function getAbsoluteTicks(): Array<Tick> {
	// determine last (largest) possible tick
	const lastPossibleTick: number = getMinimalActiveInitiative();

	// determine first (smallest) possible tick
	const firstPossibleTick = sceneData.mostRecentTick;

	if (
		firstPossibleTick > lastPossibleTick ||
		firstPossibleTick === Infinity ||
		lastPossibleTick === Infinity
	) {
		console.error(
			'Tick range invalid. First tick must not be larger than last tick. Neither must be Infinity.',
			firstPossibleTick,
			lastPossibleTick
		);
		return [
			{
				number: 0,
				hasCombatants: false,
				mode: 'absolute'
			}
		];
	}

	const ticks: Array<Tick> = [];
	for (let i = firstPossibleTick; i <= lastPossibleTick; i++) {
		ticks.push({
			number: i,
			hasCombatants: hasTickCombatantsAssigned(
				i,
				sceneData.combatants.filter((c) => c.id !== sessionData.activeCombatant?.id)
			),
			mode: 'absolute'
		});
	}
	return ticks;
}

export function getRelativeTicks(
	negation: boolean,
	comparisonInitiative: number,
	combatants: Array<Combatant>
): Array<Tick> {
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((number) => {
		const relativeTick = negation ? -number : number;
		const absoluteTick = relativeTick + comparisonInitiative;
		return {
			number: relativeTick,
			hasCombatants: hasTickCombatantsAssigned(absoluteTick, combatants),
			mode: 'relative'
		};
	});
}

/**
 * Sorts the scene combatants by two criterias:
 *   - By the combatants' scending initiatives
 *   - By the combatants' combat state in the following order: Waiting, Expecting, Active, Dead
 *
 * @param combatantWithLowPriority Combatant to put at the end of the sorted list
 * @param combatantwithHighPriority Combatant to put at the beginning of the sorted list
 */
export function sortCombatantsByInitiative(
	combatantWithLowPriority: Combatant | null = null,
	combatantwithHighPriority: Combatant | null = null
) {
	// Create a non-reactive clone of combatants
	const _combatants: Combatant[] = JSON.parse(JSON.stringify(sceneData.combatants));

	// Partition combatants by their combat state
	const combatantPartitions: CombatantsPartition = _combatants.reduce<CombatantsPartition>(
		(acc, curr: Combatant) => {
			acc[curr.combatState].push(curr);
			return acc;
		},
		{
			Active: [],
			Waiting: [],
			Expecting: [],
			Dead: []
		}
	);

	// Sort ascending and by priority
	combatantPartitions.Active.sort((a: Combatant, b: Combatant) => {
		// Default comparison by initiative
		if (a.initiative !== b.initiative) {
			return a.initiative - b.initiative;
		}

		if (a.initiative === b.initiative) {
			// If initiatives are the same, we need to handle the combatant with low priority
			if (combatantWithLowPriority) {
				if (a.id === combatantWithLowPriority.id) return 1; // Move combatant down
				if (b.id === combatantWithLowPriority.id) return -1; // Move combatant down
			}

			// If initiatives are the same, we need to handle the combatant with low priority
			if (combatantwithHighPriority) {
				if (a.id === combatantwithHighPriority.id) return -1; // Move combatant up
				if (b.id === combatantwithHighPriority.id) return 1; // Move combatant up
			}
		}

		// If both have the same initiative and are not the recently acting combatant, maintain original order
		return 0;
	});
	combatantPartitions.Waiting.sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);
	combatantPartitions.Expecting.sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);
	combatantPartitions.Dead.sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);

	// Concatenate sorted combatants again
	sceneData.combatants = ([] as Combatant[]).concat(
		...combatantPartitions.Waiting,
		...combatantPartitions.Expecting,
		...combatantPartitions.Active,
		...combatantPartitions.Dead
	);
}

function getMinimalActiveInitiative(): number {
	const validInitiatives = sceneData.combatants
		.filter((c) => c !== sessionData.activeCombatant && c.combatState === 'Active')
		.map((c) => c.initiative);
	return validInitiatives.length === 0
		? sceneData.mostRecentTick || 0
		: Math.min(...validInitiatives);
}

function hasTickCombatantsAssigned(tickNumber: number, combatants: Array<Combatant>): boolean {
	return combatants.some((c) => c.initiative === tickNumber);
}
