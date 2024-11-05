<script lang="ts">
	import { sessionData } from "$lib/state/scene_data.svelte";

	
</script>

<div class="absolute top-0 left-0 z-[100] bg-white p-1">
	<div>activeCombatant: {JSON.stringify(sessionData.activeCombatant)}</div>
	<div>mostRecentTick: {sessionData.mostRecentTick}</div>
</div>
