<script lang="ts">
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	let settingsModal: HTMLDialogElement;
	let isModalOpen: boolean = $state(true);

	export function show() {
		settingsModal.showModal();
		isModalOpen = true;
	}
</script>

<dialog
	id="settingsModal"
	bind:this={settingsModal}
	class="modal modal-open"
	class:hidden={!isModalOpen}
	onclose={() => (isModalOpen = false)}
	aria-labelledby="settingsDialogTitle"
	aria-describedby="dialogDesc"
>
	<div class="modal-box w-11/12 max-w-5xl">
		<!-- Allow closing by clicking the "X" -->
		<form method="dialog">
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
				aria-label={$_('close')}
			>
				<X aria-hidden size={24} />
			</button>
		</form>
		<h3 class="text-lg font-bold" id="settingsDialogTitle">__SETTINGS_HEADER__</h3>
	</div>
	<!-- Allows closing by clicking the free area around the modal -->
	<form method="dialog" class="modal-backdrop">
		<button>{$_('close')}</button>
	</form>
</dialog>
