import { addMessages, init } from 'svelte-i18n';
import en from './locales/en.json';
import de from './locales/de.json';
import { loadAttribute } from '$lib/state/localstorage';
import { KEY_LOCALE, DEFAULT_LOCALE, Locale } from '$lib/utility/locale';

addMessages(Locale.German, de);
addMessages(Locale.English, en);

export async function initI18n() {
	return await Promise.allSettled([
		init({
			fallbackLocale: Locale.German,
			initialLocale: loadAttribute<string>(KEY_LOCALE) || DEFAULT_LOCALE
		})
	]);
}
