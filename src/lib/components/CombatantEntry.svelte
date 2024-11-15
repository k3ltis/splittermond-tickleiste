<script lang="ts">
	import { determineNextActingCombatant, type Combatant } from '$lib/state/scene_data.svelte';
	import { fade } from 'svelte/transition';
	import { Trash, Hourglass, ClockAlert, Skull, ArrowRight } from 'lucide-svelte';
	import type { AppMode } from '$lib/domain/app';
	import { selectInputText } from '$lib/utility/html_utilities';

	interface Props {
		combatant: Combatant;
		appMode: AppMode;
		index: number;
		combatantClicked: (combatant: Combatant) => void;
		deleteCombatant: (combatantId: string) => void;
	}

	let { combatant, appMode, index, combatantClicked, deleteCombatant }: Props = $props();

	let nextActingCombatant: Combatant | null = $derived(determineNextActingCombatant());
</script>

<div
	class="
		grid
		grid-cols-[98fr_1fr_1fr]
		items-center
		gap-2
		rounded-none
		p-6
		focus:outline-none
		{appMode === 'RUNNING' ? 'cursor-pointer hover:bg-primary-content' : 'cursor-default'}
		{index >= 1 ? 'border-t-4 border-primary-content' : ''}"
	onclick={() => combatantClicked(combatant)}
	onkeydown={() => {}}
	onkeyup={() => {}}
	role="button"
	tabindex="0"
>
	<div class="relative">
		<input
			type="text"
			aria-label="Combatant name"
			disabled={appMode === 'RUNNING'}
			class="
				input
				{appMode === 'EDITING' ? 'input-bordered' : 'disabled input-ghost'}
				w-full
				text-3xl"
			bind:value={combatant.name}
		/>
		{#if combatant === nextActingCombatant && appMode === 'RUNNING'}
			<div class="absolute -left-4 top-2.5" in:fade={{ duration: 200 }}>
				<ArrowRight size="32" />
			</div>
		{/if}
	</div>
	<div>
		{#if combatant.combatState === 'Active' || appMode === 'EDITING'}
			<input
				type="number"
				aria-label="Combatant Initiative"
				disabled={appMode === 'RUNNING'}
				class="
					input
					{appMode === 'EDITING' ? 'input-bordered' : 'disabled input-ghost'}
					px-1
					text-3xl
					max-w-24
					text-center
					"
				onfocus={(event: FocusEvent) => selectInputText(event)}
				bind:value={combatant.initiative}
			/>
		{:else}
			<div in:fade={{ duration: 200 }} aria-label="Combatant Status">
				{#if combatant.combatState === 'Waiting'}
					<Hourglass class="text-center text-info min-w-12" size={48} strokeWidth={1} />
				{:else if combatant.combatState === 'Expecting'}
					<ClockAlert class="text-center text-info min-w-12" size={48} strokeWidth={1} />
				{:else if combatant.combatState === 'Dead'}
					<Skull class="text-center text-error min-w-12" size={48} strokeWidth={1} />
				{/if}
			</div>
		{/if}
	</div>
	<div class="text-center">
		{#if appMode === 'EDITING'}
			<button
				in:fade={{ duration: 200 }}
				class="btn btn-outline btn-error min-w-12"
				onclick={() => deleteCombatant(combatant.id)}
			>
				<Trash />
			</button>
		{:else if appMode === 'RUNNING'}
			<div class="min-w-12"></div>
		{/if}
	</div>
</div>

<style>
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}

	/* disabled:bg-transparent disabled:border-none disabled:text-base-content disabled:cursor-default */
	input.disabled {
		background: var(--bg-transparent);
		border-color: transparent;
		color: var(--text-base-content);
		cursor: default;
		pointer-events: none;
		user-select: none;
	}
</style>
