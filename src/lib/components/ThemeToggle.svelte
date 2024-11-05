<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';

	const ThemeMode = {
		Light: 'LIGHT',
		Dark: 'DARK'
	};

    const ThemesForThemeMode = {
        [ThemeMode.Light]: "light",
        [ThemeMode.Dark]: "dark"
    }
	let themeMode: string = $state(ThemeMode.Light);
    $effect(() => {
        setTheme(ThemesForThemeMode[themeMode])   
    })

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
