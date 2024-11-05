<script lang="ts">
	import { base } from '$app/paths';
    let dataPrivacyModal: HTMLDialogElement;
</script>

<footer class="footer flex items-center p-4 text-neutral border-t-4 border-primary-content">
	<aside class="flex-1">
		<p>Copyright © k3ltis {new Date().getFullYear()}</p>
	</aside>
    <button onclick={() => dataPrivacyModal.showModal()}>Data Privacy</button>
	<nav class="flex-none">
		<a href="https://github.com/k3ltis/splittermond-tickleiste" target="_blank">
			<img width="30em" src="{base}/svg/github-142-svgrepo-com.svg" alt="github" />
		</a>
	</nav>
</footer>

<dialog id="dataPrivacyModal" bind:this={dataPrivacyModal} class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Data Privacy Information</h3>
      <p class="py-4">This page does utilize the browser's local storage to locally save the scene in the user's browser. This is done, so that the user does not lose information when closing the browser application. If you wish to delete this information you can either clear your browser's cached web data or simply delete all entries while in the scene's edit mode.</p>
      <p>No data is send to any remove server and no other user related data is processed by this page.</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
