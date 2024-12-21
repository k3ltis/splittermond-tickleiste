export const LEVEL_NUMBER_TO_STRING: {
	[level: number]: string;
} = {
	1: 'I',
	2: 'II',
	3: 'III',
	4: 'IV',
	5: 'V'
};

export type Condition = {
	id: string;
	i18n: string;
	// The maximum condition level for this condition.
	maxLevel: number;
};
export const conditions: Condition[] = [
	{
		id: 'fearful',
		i18n: 'condition.fearful',
		maxLevel: 0
	},
	{
		id: 'dazed',
		i18n: 'condition.dazed',
		maxLevel: 3
	},
	{
		id: 'unconscious',
		i18n: 'condition.unconscious',
		maxLevel: 0
	},
	{
		id: 'bleeding',
		i18n: 'condition.bleeding',
		maxLevel: 3
	},
	{
		id: 'burning',
		i18n: 'condition.burning',
		maxLevel: 3
	},
	{
		id: 'exhausted',
		i18n: 'condition.exhausted',
		maxLevel: 3
	},
	{
		id: 'blinded',
		i18n: 'condition.blinded',
		maxLevel: 4
	},
	{
		id: 'crisis_of_faith',
		i18n: 'condition.crisis_of_faith',
		maxLevel: 3
	},
	{
		id: 'sick',
		i18n: 'condition.sick',
		maxLevel: 0
	},
	{
		id: 'crippled',
		i18n: 'condition.crippled',
		maxLevel: 0
	},
	{
		id: 'panicked',
		i18n: 'condition.panicked',
		maxLevel: 0
	},
	{
		id: 'frenzied',
		i18n: 'condition.frenzied',
		maxLevel: 0
	},
	{
		id: 'dying',
		i18n: 'condition.dying',
		maxLevel: 3
	},
	{
		id: 'sleeping',
		i18n: 'condition.sleeping',
		maxLevel: 0
	},
	{
		id: 'wasting',
		i18n: 'condition.wasting',
		maxLevel: 3
	},
	{
		id: 'struggling',
		i18n: 'condition.struggling',
		maxLevel: 0
	},
	{
		id: 'wounded',
		i18n: 'condition.wounded',
		maxLevel: 3
	}
];
