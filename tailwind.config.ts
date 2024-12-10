import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

const complementary_colors = {
	accent: '#00fb7d',
	'accent-content': '#001505',
	info: '#67d2ff',
	'info-content': '#041016',
	success: '#00af66',
	'success-content': '#000b04',
	warning: '#ffb000',
	'warning-content': '#160b00',
	error: '#fe6b6e',
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
	'base-200': '#7b939a',
	'base-300': '#141918',
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
	'base-300': '#141918',
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
