import { v4 as uuid } from 'uuid';
import { saveSceneToLocalStorage } from './localstorage';

export type CombatState = 'Active' | 'Dead' | 'Waiting' | 'Expecting';

export type Scene = {
	name: string;
	combatants: Combatant[];
};

export type Combatant = {
	id: string;
	name: string;
	initiative: number;
	combatState: CombatState;
};

export type SessionData = {
	activeCombatant: Combatant | null;
	mostRecentTick: number;
	ticks: Array<Tick>;
};

type TickMode = 'relative' | 'absolute';
export type Tick = {
	number: number;
	hasCombatants: boolean;
	mode: TickMode;
};

export const sceneData: Scene = $state({
	name: 'My Scene',
	combatants: [] as Combatant[]
});

export function determineNextActingCombatant(): Combatant | null {
	return sceneData.combatants.find((c) => c.combatState === 'Active') || null;
}

export const sessionData: SessionData = $state({
	activeCombatant: null,
	mostRecentTick: 0,
	ticks: []
});

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

	// After loading scene, set most recent tick to the smallest possible initiative among active combatants
	const activeCombatants = sceneData.combatants
		.filter((c) => c.combatState === 'Active')
		.map((c) => c.initiative);
	sessionData.mostRecentTick = activeCombatants.length ? Math.min(...activeCombatants) : 0;
};

export const saveScene = () => {
	saveSceneToLocalStorage(sceneData);
};

export const moveCombatantByTicks = (combatant: Combatant, ticks: number) => {
	if (
		sceneData.combatants.length > 0 &&
		combatant === sceneData.combatants.find((c) => c.combatState === 'Active')
	) {
		sessionData.mostRecentTick = combatant.initiative;
	}
	combatant.initiative += ticks;
	sortCombatantsByInitiative(combatant);
};

export const moveCombatantToTick = (combatant: Combatant, tick: number) => {
	const oldCombatState = combatant.combatState;
	combatant.initiative = tick;
	combatant.combatState = 'Active';
	sessionData.mostRecentTick = combatant.initiative;
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
	sessionData.mostRecentTick = combatant.initiative;
	sortCombatantsByInitiative(combatant);
};

export const setCombatantCombatStateToExpecting = (combatant: Combatant) => {
	combatant.combatState = 'Expecting';
	sessionData.mostRecentTick = combatant.initiative;
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
	sessionData.mostRecentTick = tick;
}

export function getMinimalActiveInitiative(): number {
	const validInitiatives = sceneData.combatants
		.filter((c) => c !== sessionData.activeCombatant && c.combatState === 'Active')
		.map((c) => c.initiative);
	return validInitiatives.length === 0
		? sessionData.mostRecentTick || 0
		: Math.min(...validInitiatives);
}

type CombatantsPartition = {
	[state in CombatState]: Combatant[];
};

export const sortCombatantsByInitiative = (
	combatantWithLowPriority: Combatant | null = null,
	combatantwithHighPriority: Combatant | null = null
) => {
	// The combatant with low priority will be pushed to the end of its initiative-wise equivalence group
	const combatants: Combatant[] = JSON.parse(JSON.stringify(sceneData.combatants));
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

	// Sort ascending
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

	// Concatenate again
	sceneData.combatants = ([] as Combatant[]).concat(
		...combatantPartitions.Waiting,
		...combatantPartitions.Expecting,
		...combatantPartitions.Active,
		...combatantPartitions.Dead
	);
};
