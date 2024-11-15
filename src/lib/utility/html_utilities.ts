export function selectInputText(event?: FocusEvent) {
	const target = event?.target as HTMLInputElement;
	target.select();
}
