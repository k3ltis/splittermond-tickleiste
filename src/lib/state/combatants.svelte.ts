import exp from "constants"
import { v4 as uuid } from "uuid"

export type Scene = {
    name: string
    combatants: Combatant[]
}

export type Combatant = {
    id: string
    name: string
    initiative: number
}


export let scene: Scene = $state({
    name: "name of scene",
    combatants: [
        // { id: uuid(), name: "Laurent", initiative: 0 },
        // { id: uuid(), name: "Fredolin", initiative: 3 },
        // { id: uuid(), name: "Gwynnyfere", initiative: 6 },
    ],
});

export const createNewCombatant = (): Combatant => {
    return {
        id: uuid(),
        name: "",
        initiative: 0
    }
}

export const loadScene = (sceneData: Scene) => {
    Object.assign(scene, sceneData);
}

