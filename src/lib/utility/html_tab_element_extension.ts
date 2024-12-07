/*
 *   Typescript version of the w3.org suggested tab-behaviour
 *   https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
 */

class TabsAutomatic {
	private tablistNode: HTMLElement;
	private tabs: HTMLElement[];
	private tabpanels: HTMLElement[];
	private firstTab: HTMLElement | null;
	private lastTab: HTMLElement | null;

	constructor(groupNode: HTMLElement) {
		this.tablistNode = groupNode;

		this.tabs = [];
		this.tabpanels = [];
		this.firstTab = null;
		this.lastTab = null;

		// Query all tabs
		this.tabs = Array.from(this.tablistNode.querySelectorAll<HTMLElement>('[role=tab]'));

		for (let i = 0; i < this.tabs.length; i += 1) {
			const tab = this.tabs[i];
			const tabpanel = document.getElementById(tab.getAttribute('aria-controls')!);

			if (tabpanel) {
				tab.tabIndex = -1;
				tab.setAttribute('aria-selected', 'false');
				this.tabpanels.push(tabpanel);

				tab.addEventListener('keydown', this.onKeydown.bind(this));
				tab.addEventListener('click', this.onClick.bind(this));

				if (!this.firstTab) {
					this.firstTab = tab;
				}
				this.lastTab = tab;
			} else {
				console.error(`Tabpanel with id "${tab.getAttribute('aria-controls')}" not found.`);
			}
		}

		if (this.firstTab) {
			this.setSelectedTab(this.firstTab, false);
		}
	}

	private setSelectedTab(currentTab: HTMLElement, setFocus: boolean = true): void {
		for (let i = 0; i < this.tabs.length; i += 1) {
			const tab = this.tabs[i];
			const tabpanel = this.tabpanels[i];

			if (currentTab === tab) {
				tab.setAttribute('aria-selected', 'true');
				tab.removeAttribute('tabindex');
				tabpanel.classList.remove('hidden');
				if (setFocus) {
					tab.focus();
				}
			} else {
				tab.setAttribute('aria-selected', 'false');
				tab.tabIndex = -1;
				tabpanel.classList.add('hidden');
			}
		}
	}

	private setSelectedToPreviousTab(currentTab: HTMLElement): void {
		if (currentTab === this.firstTab) {
			if (this.lastTab) {
				this.setSelectedTab(this.lastTab);
			}
		} else {
			const index = this.tabs.indexOf(currentTab);
			if (index > 0) {
				this.setSelectedTab(this.tabs[index - 1]);
			}
		}
	}

	private setSelectedToNextTab(currentTab: HTMLElement): void {
		if (currentTab === this.lastTab) {
			if (this.firstTab) {
				this.setSelectedTab(this.firstTab);
			}
		} else {
			const index = this.tabs.indexOf(currentTab);
			if (index < this.tabs.length - 1) {
				this.setSelectedTab(this.tabs[index + 1]);
			}
		}
	}

	private onKeydown(event: KeyboardEvent): void {
		const tgt = event.currentTarget as HTMLElement;
		let flag = false;

		switch (event.key) {
			case 'ArrowLeft':
				this.setSelectedToPreviousTab(tgt);
				flag = true;
				break;

			case 'ArrowRight':
				this.setSelectedToNextTab(tgt);
				flag = true;
				break;

			case 'Home':
				if (this.firstTab) {
					this.setSelectedTab(this.firstTab);
				}
				flag = true;
				break;

			case 'End':
				if (this.lastTab) {
					this.setSelectedTab(this.lastTab);
				}
				flag = true;
				break;

			default:
				break;
		}

		if (flag) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	private onClick(event: MouseEvent): void {
		this.setSelectedTab(event.currentTarget as HTMLElement);
	}
}

// Initialize tablist
export function addAccesibleBehaviourToTabs() {
	window.addEventListener('load', function () {
		const tablists = document.querySelectorAll<HTMLElement>('[role=tablist]');
		for (let i = 0; i < tablists.length; i++) {
			new TabsAutomatic(tablists[i]);
		}
	});
}
