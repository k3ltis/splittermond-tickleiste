<script lang="ts">
    import { _, number } from 'svelte-i18n';
    type Condition = {
        id: string
        label: string
    }
    // let removed_conditions: string[] = ["sleeping", "wasting", "struggling"]
    let conditions: string[] = ["fearful", "dazed", "unconscious", "bleeding", "burning", "exhausted", "blinded", "crisis_of_faith", "sick", "crippled", "panicked", "frenzied", "dying", "wounded"]
    let conditionElements: Condition[] = conditions.map(condition => ({
        id: condition,
        label: $_(`condition.${condition}`)
    })).toSorted((a, b) => a.label > b.label ? 1 : -1);
</script>

<div class="grid grid-cols-2 gap-4">
{#each conditionElements as conditionElement}
    <button class="btn btn-outline btn-secondary">{ conditionElement.label }</button>
{/each}
</div>