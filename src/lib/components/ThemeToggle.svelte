<script lang="ts">
	import { loadAttribute, saveAttribute } from '$lib/state/localstorage';
	import { Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';

    const ThemeMode = {
        Light: 'LIGHT',
        Dark: 'DARK'
    };

    const ThemesForThemeMode = {
        [ThemeMode.Light]: 'light',
        [ThemeMode.Dark]: 'dark'
    };
	const KEY_THEME_MODE: string = 'theme_mode';
    const DEFAULT_THEME_MODE: string = ThemeMode.Light

	onMount(() => {
		const recoveredThemeMode = loadAttribute<string>(KEY_THEME_MODE);
        themeMode = recoveredThemeMode || DEFAULT_THEME_MODE
	});

	let themeMode: string = $state(ThemeMode.Light);
	$effect(() => {
		setTheme(ThemesForThemeMode[themeMode]);
        saveAttribute(KEY_THEME_MODE, themeMode)
	});

	function setTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
	}

	function toggleThemeMode() {
		themeMode = themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
	}
</script>

<div id="ThemeToggle">
	<button class="btn btn-ghost" onclick={() => toggleThemeMode()}>
		{#if themeMode === ThemeMode.Light}
			<Moon />
		{:else}
			<Sun />
		{/if}
	</button>
</div>
