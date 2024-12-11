<script lang="ts">
	import { loadAttribute, saveAttribute } from '$lib/state/localstorage';
	import { Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	const ThemeMode = {
		Light: 'LIGHT',
		Dark: 'DARK'
	};

	const ThemesForThemeMode = {
		[ThemeMode.Light]: 'splitter_light',
		[ThemeMode.Dark]: 'splitter_dark'
	};
	const KEY_THEME_MODE: string = 'theme_mode';
	const DEFAULT_THEME_MODE: string = ThemeMode.Light;

	onMount(() => {
		const recoveredThemeMode = loadAttribute<string>(KEY_THEME_MODE);
		themeMode = recoveredThemeMode || DEFAULT_THEME_MODE;
	});

	let themeMode: string = $state(ThemeMode.Light);
	$effect(() => {
		setTheme(ThemesForThemeMode[themeMode]);
		saveAttribute(KEY_THEME_MODE, themeMode);
	});

	function setTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
	}

	function toggleThemeMode() {
		themeMode = themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
	}
</script>

<div id="ThemeToggle">
	<button
		class="btn btn-ghost"
		onclick={() => toggleThemeMode()}
		aria-label={$_('toggle_theme', { values: { n: Number(themeMode === ThemeMode.Light) } })}
	>
		{#if themeMode === ThemeMode.Light}
			<Moon aria-hidden />
		{:else}
			<Sun aria-hidden />
		{/if}
	</button>
</div>
