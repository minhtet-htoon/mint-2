<script lang="ts">
  export let path: string
</script>

<svg class={$$props.class ?? ''}>
  <image xlink:href={path} height="100%" width="100%"></image>
</svg>
