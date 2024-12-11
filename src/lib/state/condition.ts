// Missing conditions: 'sleeping', 'wasting', 'struggling'
export type ConditionType =
	| 'fearful'
	| 'dazed'
	| 'unconscious'
	| 'bleeding'
	| 'burning'
	| 'exhausted'
	| 'blinded'
	| 'crisis_of_faith'
	| 'sick'
	| 'crippled'
	| 'panicked'
	| 'frenzied'
	| 'dying'
	| 'sleeping'
	| 'wasting'
	| 'struggling'
	| 'wounded';

export type Condition = {
	id: ConditionType;
	i18n: string;
};
export const conditions: Condition[] = [
	{
		id: 'fearful',
		i18n: 'condition.fearful'
	},
	{
		id: 'dazed',
		i18n: 'condition.dazed'
	},
	{
		id: 'unconscious',
		i18n: 'condition.unconscious'
	},
	{
		id: 'bleeding',
		i18n: 'condition.bleeding'
	},
	{
		id: 'burning',
		i18n: 'condition.burning'
	},
	{
		id: 'exhausted',
		i18n: 'condition.exhausted'
	},
	{
		id: 'blinded',
		i18n: 'condition.blinded'
	},
	{
		id: 'crisis_of_faith',
		i18n: 'condition.crisis_of_faith'
	},
	{
		id: 'sick',
		i18n: 'condition.sick'
	},
	{
		id: 'crippled',
		i18n: 'condition.crippled'
	},
	{
		id: 'panicked',
		i18n: 'condition.panicked'
	},
	{
		id: 'frenzied',
		i18n: 'condition.frenzied'
	},
	{
		id: 'dying',
		i18n: 'condition.dying'
	},
	{
		id: 'sleeping',
		i18n: 'condition.sleeping'
	},
	{
		id: 'wasting',
		i18n: 'condition.wasting'
	},
	{
		id: 'struggling',
		i18n: 'condition.struggling'
	},
	{
		id: 'wounded',
		i18n: 'condition.wounded'
	}
];
