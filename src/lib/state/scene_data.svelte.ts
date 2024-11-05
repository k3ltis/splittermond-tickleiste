import { v4 as uuid } from "uuid";
import { saveSceneToLocalStorage } from "./localstorage";

// export type CombatState = "Active" | "Waiting" | "Expecting" | "Dead";
export const CombatState = {
    Active: "ACTIVE",
    Dead: "DEAD",
    Waiting: "WAITING",
    Expecting: "EXPECTING",
}

export type Scene = {
    name: string;
    combatants: Combatant[];
};

export type Combatant = {
    id: string;
    name: string;
    initiative: number;
    combatState: string
};

export type SessionData =  {
    activeCombatant: Combatant | null 
    mostRecentTick: number
}

export const sceneData: Scene = $state({
    name: "My Scene",
    combatants: [],
});

export function determineNextActingCombatant(): Combatant | null {
    return sceneData.combatants.find(c => c.combatState === CombatState.Active) || null
}

export const sessionData: SessionData = $state({
    activeCombatant: null,
    mostRecentTick: 0,
}) 

export const createNewCombatant = (): Combatant => {
    return {
        id: uuid(),
        name: "",
        initiative: 0,
        combatState: CombatState.Active
    };
};

export const loadScene = (_sceneData: Scene) => {
    console.log(`Load scene ${JSON.stringify(_sceneData)}`);
    Object.assign(sceneData, _sceneData);
    sortCombatantsByInitiative()
    // After loading scene, set most recent tick to the smallest possible initiative among active combatants
    sessionData.mostRecentTick = Math.min(...sceneData.combatants.filter((c) => c.combatState === CombatState.Active).map((c) => c.initiative))
};

export const saveScene = () => {
    saveSceneToLocalStorage(sceneData);
};

export const moveCombatantByTicks = (combatant: Combatant, ticks: number) => {
    if (sceneData.combatants.length > 0 && combatant === sceneData.combatants.find(c => c.combatState === CombatState.Active)) {
        sessionData.mostRecentTick = combatant.initiative
    }
    combatant.initiative += ticks
    sortCombatantsByInitiative()
}

export const moveCombatantToTick = (combatant: Combatant, tick: number) => {
    combatant.initiative = tick
    sessionData.mostRecentTick = combatant.initiative
    setCombatantCombatStateToActive(combatant)
    sortCombatantsByInitiative()
}

export const setCombatantCombatStateToActive = (combatant: Combatant) => {
    combatant.combatState = CombatState.Active
    sortCombatantsByInitiative()
}

export const setCombatantCombatStateToWaiting = (combatant: Combatant) => {
    combatant.combatState = CombatState.Waiting
    sortCombatantsByInitiative()
}

export const setCombatantCombatStateToExpecting = (combatant: Combatant) => {
    combatant.combatState = CombatState.Expecting
    sortCombatantsByInitiative()
}

export const setCombatantCombatStateToDead = (combatant: Combatant) => {
    combatant.combatState = CombatState.Dead
    sortCombatantsByInitiative()
}

export function resetActiveCombatant() {
    sessionData.activeCombatant = null
}

export function setMostRecentTick(tick: number) {
    sessionData.mostRecentTick = tick
}

// export const moveCombatantToTick = (combatant: Combatant, tick: number) => {
//     combatant.initiative = tick
// }

export const sortCombatantsByInitiative = (recentlyActingCombatant: Combatant | null = null) => {
    const combatants: Combatant[] = JSON.parse(JSON.stringify(sceneData.combatants))
    const combatantPartitions = combatants.reduce<any>((acc, curr: Combatant) => {
        acc[curr.combatState].push(curr)
        return acc
    }, {
        [CombatState.Active]: [],
        [CombatState.Waiting]: [],
        [CombatState.Expecting]: [],
        [CombatState.Dead]: []
    })

    // Sort ascending
    combatantPartitions[CombatState.Active].sort((a: Combatant, b: Combatant) => {
        // Default comparison by initiative
        if (a.initiative !== b.initiative) {
            return a.initiative - b.initiative;
        }

        // If initiatives are the same, we need to handle recently acting combatant
        if (recentlyActingCombatant) {
            if (a.id === recentlyActingCombatant.id) return 1; // Move recently acting combatant down
            if (b.id === recentlyActingCombatant.id) return -1; // Move recently acting combatant down
        }

        // If both have the same initiative and are not the recently acting combatant, maintain original order
        return 0;
    });

    combatantPartitions[CombatState.Waiting].sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);
    combatantPartitions[CombatState.Expecting].sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);
    combatantPartitions[CombatState.Dead].sort((a: Combatant, b: Combatant) => a.initiative - b.initiative);

    sceneData.combatants = [].concat(
        ...combatantPartitions[CombatState.Waiting],
        ...combatantPartitions[CombatState.Expecting],
        ...combatantPartitions[CombatState.Active],
        ...combatantPartitions[CombatState.Dead],
    )
};

