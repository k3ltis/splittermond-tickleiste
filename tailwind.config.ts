import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

const complementary_colors = {
	accent: '#4fd590',
	'accent-content': '#001505',
	info: '#67d2ff',
	'info-content': '#041016',
	success: '#00af66',
	'success-content': '#000b04',
	warning: '#fcc755',
	'warning-content': '#160b00',
	error: '#d35456',
	'error-content': '#160404'
};

const splitter_light = {
	primary: '#48b3d1',
	'primary-content': '#483A19',
	secondary: '#707070',
	'secondary-content': '#48b3d1',
	neutral: '#2b2f2b',
	'neutral-content': '#d0d1d0',
	'base-100': '#c5dbe0',
	'base-200': '#85837c',
	'base-300': '#696969',
	'base-content': '#141918',
	...complementary_colors
};

const splitter_dark = {
	primary: '#80C7E4',
	'primary-content': '#483A19',
	secondary: '#444440',
	'secondary-content': '#48b3d1',
	neutral: '#2b2f2b',
	'neutral-content': '#d0d1d0',
	'base-100': '#1f2624',
	'base-200': '#444440',
	'base-300': '#383834',
	'base-content': '#C7E7F1',
	...complementary_colors
};

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [forms, containerQueries, daisyui],

	daisyui: {
		themes: [{ splitter_dark, splitter_light }]
	}
} as Config;
