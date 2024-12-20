export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
		const random = (Math.random() * 16) | 0; // Random number between 0 and 15
		const value = char === 'x' ? random : (random & 0x3) | 0x8; // Set bits for 'y' as per UUID v4 spec
		return value.toString(16); // Convert to hexadecimal
	});
}
