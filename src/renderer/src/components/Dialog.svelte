<script>
  export let dialog
</script>

<dialog class="rounded-2xl min-w-[20vw] w-[50vw]" bind:this={dialog} on:close>
  <slot />
</dialog>
