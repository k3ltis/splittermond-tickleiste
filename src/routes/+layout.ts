import { browser } from "$app/environment";
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language)
	}
	await waitLocale()
}
