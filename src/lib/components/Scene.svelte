<script lang="ts">
	import {
		CombatState,
		createNewCombatant,
		determineNextActingCombatant,
		sceneData,
		sessionData,
		sortCombatantsByInitiative,
		type Combatant
	} from '$lib/state/scene_data.svelte';
	import { fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import TickSelection from './TickSelection.svelte';
	import { _ } from 'svelte-i18n';
	import { Pencil, Play, Plus, Trash, Hourglass, ClockAlert, Skull, ArrowRight } from 'lucide-svelte';

	const AppMode = {
		Editing: 'EDITING',
		Running: 'RUNNING'
	};
	const DEFAULT_APP_MODE = AppMode.Running;

	let newCombatant: Combatant = $state(createNewCombatant());
	let nextActingCombatant: Combatant | null = $derived(determineNextActingCombatant())


	// Indicating that the combatants are edited
	let appMode: string = $state(DEFAULT_APP_MODE);

	// svelte-ignore non_reactive_update
	let combatantNameInput: HTMLInputElement;

	// svelte-ignore non_reactive_update
	let tickSelection: any;

	function addCombatant(combatant: Combatant) {
		if (combatant.name === '') {
			return;
		}
		sceneData.combatants.push(combatant);

		// Restore default combatant for new input
		newCombatant = createNewCombatant();

		// Restore focus on the name input
		combatantNameInput.focus();
		combatantNameInput.select();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addCombatant(newCombatant);
		}
	}

	function editScene() {
		appMode = AppMode.Editing;
	}

	function deleteCombatant(combatantId: string) {
		sceneData.combatants = sceneData.combatants.filter((c) => c.id !== combatantId);
	}

	function runScene() {
		appMode = AppMode.Running;
		sortCombatantsByInitiative()
	}

	function combatantClicked(combatant: Combatant) {
		if (appMode === AppMode.Running) {
			sessionData.activeCombatant = combatant;
			tickSelection.show()
		}
	}

	function selectInputText(event?: FocusEvent) {
		const target = event?.target as HTMLInputElement;
		target.select();
	}
</script>

<TickSelection bind:this={tickSelection} />

<div
	class="
		m-auto
		mt-16
		h-full
		w-full
		px-2
		py-4
		md:w-11/12
		lg:w-10/12
		xl:w-10/12
		2xl:w-[1200px]"
>
	<div class="navbar bg-base-100 px-0">
		<!-- Scene Title -->
		<div id="sceneTitle" class="flex-1">
			<input
				type="text"
				placeholder="Scene name..."
				disabled={appMode === AppMode.Running}
				class="input mr-4 w-full text-3xl {appMode === AppMode.Editing
					? 'input-bordered'
					: 'disabled input-ghost'}"
				bind:value={sceneData.name}
			/>
		</div>
		<!-- Change Scene Mode Buttons -->
		<div class="flex-none space-x-2">
			<button
				id="runSceneBtn"
				class="btn btn-primary text-xl"
				class:hidden={appMode == AppMode.Running}
				onclick={runScene}
			>
				<Play />
				<span class="hidden lg:flex">{$_('run_scene_button')}</span>
			</button>
			<button
				id="editSceneBtn"
				class="btn btn-primary text-xl"
				class:hidden={appMode === AppMode.Editing}
				onclick={editScene}
			>
				<Pencil />
				<span class="hidden lg:flex">{$_('edit_scene_button')}</span>
			</button>
		</div>
	</div>
	<div id="combatantsTable" class="mt-4 grid w-full grid-cols-[99fr_1fr_1fr]">
		<!-- Table Header -->
		<div
			class="col-span-3 grid grid-cols-subgrid items-center gap-2 bg-primary-content px-6 py-2 text-xl font-bold"
			class:rounded-t-lg={appMode === AppMode.Editing}
			class:rounded-lg={appMode === AppMode.Running}
		>
			<div>{$_('column_name')}</div>
			<div id="initiativeColumn">{$_('column_initiative')}</div>
			<div></div>
			<!-- Spacer for buttons column -->
		</div>

		<!-- Combatant Input Fields -->
		{#if appMode === AppMode.Editing}
			<div
				transition:slide
				class="col-span-3 grid grid-cols-subgrid items-center gap-2 rounded-b-lg bg-primary-content px-6 pb-4"
			>
				<div>
					<input
						type="text"
						placeholder={$_('placeholder_name')}
						class="input input-bordered w-full text-3xl"
						bind:value={newCombatant.name}
						bind:this={combatantNameInput}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div>
					<input
						type="number"
						placeholder={$_('placeholder_initiative')}
						class="
							input
							input-bordered
							w-20
							px-1
							text-center
							text-3xl"
						bind:value={newCombatant.initiative}
						onfocus={(event: FocusEvent) => selectInputText(event)}
						onkeydown={handleKeyDown}
					/>
				</div>
				<div class="w-16 justify-center">
					<button onclick={() => addCombatant(newCombatant)} class="btn btn-primary">
						<Plus strokeWidth={3} />
					</button>
				</div>
			</div>
		{/if}

		<div class="my-2"></div>

		<!-- Combatant List -->
		{#each sceneData.combatants as combatant, index (combatant.id)}
			<div
				animate:flip={{ delay: 100, duration: 500 }}
				class="
					col-span-3
					grid
					grid-cols-subgrid
					items-center
					gap-2
					rounded-none
					p-6
					focus:outline-none
					{appMode === AppMode.Running ? 'cursor-pointer hover:bg-primary-content' : 'cursor-default'}
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
						disabled={appMode === AppMode.Running}
						class="
						input
						{appMode === AppMode.Editing ? 'input-bordered' : 'disabled input-ghost'}
						w-full
						text-3xl"
						bind:value={combatant.name}
					/>
					{#if combatant === nextActingCombatant && appMode === AppMode.Running}
						<div class="absolute -left-4 top-2.5" in:fade={{ duration: 200 }}>
							<ArrowRight size="32" />
						</div>
					{/if}
				</div>
				<div>
					{#if combatant.combatState === CombatState.Active || appMode === AppMode.Editing }
						<input
							type="number"
							disabled={appMode === AppMode.Running}
							class="
								input
								{appMode === AppMode.Editing ? 'input-bordered' : 'disabled input-ghost'}
								w-20
								px-1
								text-center
								text-3xl"
							onfocus={(event: FocusEvent) => selectInputText(event)}
							bind:value={combatant.initiative}
						/>
					{:else}
					<div in:fade={{ duration: 200 }}>
						{#if combatant.combatState === CombatState.Waiting}
							<Hourglass class="text-info text-center w-full" size={48} strokeWidth={1} />
						{:else if combatant.combatState === CombatState.Expecting}
							<ClockAlert class="text-info text-center w-full" size={48} strokeWidth={1} />
						{:else if combatant.combatState === CombatState.Dead}
							<Skull class="text-error text-center w-full" size={48} strokeWidth={1} />
						{/if}
					</div>
					{/if}
				</div>
				<div class="w-16 justify-center">
					{#if appMode === AppMode.Editing}
						<button
							in:fade={{ duration: 200 }}
							class="btn btn-outline btn-error"
							onclick={() => deleteCombatant(combatant.id)}
						>
							<Trash />
						</button>
					{:else if appMode === AppMode.Running}
						<div></div>
					{/if}
				</div>
			</div>
		{/each}
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
