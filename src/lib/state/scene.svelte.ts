import { v4 as uuid } from "uuid"
import { saveSceneToLocalStorage } from "./localstorage"

export type Scene = {
    name: string
    combatants: Combatant[]
}

export type Combatant = {
    id: string
    name: string
    initiative: number
}


export let sceneData: Scene = $state({
    name: "name of scene",
    combatants: [],
});

export const createNewCombatant = (): Combatant => {
    return {
        id: uuid(),
        name: "",
        initiative: 0
    }
}

export const loadScene = (_sceneData: Scene) => {
    console.log(`Load scene ${JSON.stringify(_sceneData)}`)
    Object.assign(sceneData, _sceneData);
}

export const saveScene = () => {
    saveSceneToLocalStorage(sceneData);
}

export const sortCombatantsByInitiative = () => {
    sceneData.combatants.sort((a: Combatant, b: Combatant) => a.initiative - b.initiative)
}