import { v4 as uuid } from "uuid";
import { saveSceneToLocalStorage } from "./localstorage";

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
};

export const saveScene = () => {
    saveSceneToLocalStorage(sceneData);
};

export const sortCombatantsByInitiative = (recentlyActingCombatant: Combatant | null = null) => {
    // Sort ascending
    sceneData.combatants.sort((a: Combatant, b: Combatant) => {
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
};