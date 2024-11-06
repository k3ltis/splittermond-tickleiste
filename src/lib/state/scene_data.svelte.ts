import { v4 as uuid } from 'uuid';
import { saveSceneToLocalStorage } from './localstorage';

// Types
export type CombatState = 'Active' | 'Dead' | 'Waiting' | 'Expecting';

export type Scene = {
	name: string;
	combatants: Combatant[];
	mostRecentTick: number;
};

export type Combatant = {
	id: string;
	name: string;
	initiative: number;
	combatState: CombatState;
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
	name: 'My Scene',
	combatants: [] as Combatant[],
	mostRecentTick: 0
});

export const sessionData: SessionData = $state({
	activeCombatant: null,
	ticks: []
});

// Functions
export function determineNextActingCombatant(): Combatant | null {
	return sceneData.combatants.find((c) => c.combatState === 'Active') || null;
}

export const createNewCombatant = (): Combatant => {
	return {
		id: uuid(),
		name: '',
		initiative: 0,
		combatState: 'Active'
	};
};

export const loadScene = (_sceneData: Scene) => {
	console.log(`Load scene ${JSON.stringify(_sceneData)}`);
	Object.assign(sceneData, _sceneData);
	sortCombatantsByInitiative();
};

export const saveScene = () => {
	saveSceneToLocalStorage(sceneData);
};

export function getSceneDataForExport(): Scene {
	const _sceneData: Scene = JSON.parse(JSON.stringify(sceneData));
	_sceneData.mostRecentTick = getMinimalActiveInitiative();
	return _sceneData;
}

export const moveCombatantByTicks = (combatant: Combatant, ticks: number) => {
	if (
		sceneData.combatants.length > 0 &&
		combatant === sceneData.combatants.find((c) => c.combatState === 'Active')
	) {
		setMostRecentTick(combatant.initiative);
	}
	combatant.initiative += ticks;
	sortCombatantsByInitiative(combatant);
};

export const moveCombatantToTick = (combatant: Combatant, tick: number) => {
	const oldCombatState = combatant.combatState;
	combatant.initiative = tick;
	combatant.combatState = 'Active';
	setMostRecentTick(combatant.initiative);
	if (oldCombatState === 'Expecting') {
		sortCombatantsByInitiative(null, combatant);
	} else {
		sortCombatantsByInitiative(combatant);
	}
};

export const setCombatantCombatStateToActive = (combatant: Combatant) => {
	combatant.combatState = 'Active';
	sortCombatantsByInitiative(combatant);
};

export const setCombatantCombatStateToWaiting = (combatant: Combatant) => {
	combatant.combatState = 'Waiting';
	setMostRecentTick(combatant.initiative);
	sortCombatantsByInitiative(combatant);
};

export const setCombatantCombatStateToExpecting = (combatant: Combatant) => {
	combatant.combatState = 'Expecting';
	setMostRecentTick(combatant.initiative);
	sortCombatantsByInitiative(combatant);
};

export const setCombatantCombatStateToDead = (combatant: Combatant) => {
	combatant.combatState = 'Dead';
	sortCombatantsByInitiative(combatant);
};

export function resetActiveCombatant() {
	sessionData.activeCombatant = null;
}

export function setMostRecentTick(tick: number) {
	sceneData.mostRecentTick = tick;
}

export function getMinimalActiveInitiative(): number {
	const validInitiatives = sceneData.combatants
		.filter((c) => c !== sessionData.activeCombatant && c.combatState === 'Active')
		.map((c) => c.initiative);
	return validInitiatives.length === 0
		? sceneData.mostRecentTick || 0
		: Math.min(...validInitiatives);
}

export function setMostRecentTickToMinimalActiveInitiative() {
	const mostRecentTick = getMinimalActiveInitiative();
	setMostRecentTick(mostRecentTick);
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

function hasTickCombatantsAssigned(tickNumber: number, combatants: Array<Combatant>): boolean {
	return combatants.some((c) => c.initiative === tickNumber);
}

export const sortCombatantsByInitiative = (
	combatantWithLowPriority: Combatant | null = null,
	combatantwithHighPriority: Combatant | null = null
) => {
	// Create a non-reactive clone of combatants
	const combatants: Combatant[] = JSON.parse(JSON.stringify(sceneData.combatants));

	// Partition combatants by their combat state
	const combatantPartitions: CombatantsPartition = combatants.reduce<CombatantsPartition>(
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
};
