import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";

import en from "./locales/en.json";
import de from "./locales/de.json";

addMessages("en", en);
addMessages("de", de);

init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
});