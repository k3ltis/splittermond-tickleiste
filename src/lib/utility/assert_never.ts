// Function to help with the exhaustiveness check
export function assertNever(value: never): never {
	throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}
