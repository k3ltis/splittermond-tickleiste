// Add additional accesibility functionality to detail HTML elements
// 1. close on esc
// 2. close on click outisde
// 3. close on tab outside

export function addToggleListener(details: HTMLDetailsElement) {
	if (!details) return;
	// Add those functionalities when a details-element is open and
	// destroy them when the element is closed again
	details.addEventListener('toggle', () => {
		if (details.open) {
			addListenersForDetailsElement(details);
			details.querySelector('summary')?.classList.add('btn-active');
		} else {
			destroyListenersForDetailsElement(details);
			details.querySelector('summary')?.classList.remove('btn-active');
		}
	});
}

function mouseListener(details: HTMLDetailsElement) {
	return function (e: MouseEvent) {
		const targetEl = e.target as HTMLElement;
		if (targetEl && !details.contains(targetEl)) {
			// Click was outside the dropdown, close it
			details.open = false;
		}
	};
}

function keyListener(details: HTMLDetailsElement) {
	return function (e: KeyboardEvent) {
		if (e.key === 'Escape') {
			details.open = false;
		}
	};
}

function tabListener(details: HTMLDetailsElement) {
	return function (event: KeyboardEvent) {
		if (event.key !== 'Tab' || !window.document.activeElement) return;

		const focusableElements = details.querySelectorAll('summary, li, button');
		console.log(focusableElements);
		const focusedElementIndex = Array.from(focusableElements).indexOf(
			window.document.activeElement
		);

		// close when shift + tab was pressed and summary was focused
		if (event.shiftKey && focusedElementIndex === 0) {
			details.open = false;
			// close tab was pressed and activeElement does not represent contents of details element
		} else if (!event.shiftKey && focusedElementIndex === -1) {
			details.open = false;
		}
	};
}

function addListenersForDetailsElement(details: HTMLDetailsElement) {
	window.addEventListener('click', mouseListener(details));
	window.addEventListener('keydown', keyListener(details));
	window.addEventListener('keydown', tabListener(details));
}

function destroyListenersForDetailsElement(details: HTMLDetailsElement) {
	window.removeEventListener('click', mouseListener(details));
	window.removeEventListener('keydown', keyListener(details));
	window.removeEventListener('keydown', tabListener(details));
}
