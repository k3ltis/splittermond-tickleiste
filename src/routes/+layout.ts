import { DEFAULT_LOCALE } from '$lib/utility/locale';
import { waitLocale } from 'svelte-i18n';
export const prerender = true;
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	await waitLocale(DEFAULT_LOCALE);
};
