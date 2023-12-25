<script lang="ts">
  import type { ILib } from '../../../../types'

  export let library: ILib
</script>

{#each library.artists as artist}
  <div class="w-full flex flex-row">
    <div class="w-1/2">
      <h1 class="text-3xl">{artist.name}</h1>
    </div>
    <div class="w-1/2">
      {#each artist.albums as album}
        <h1 class="text-2xl">{album.name}</h1>
        <ul>
          {#each album.songs as song}
            <li>{song.name}</li>
          {/each}
        </ul>
      {/each}
    </div>
  </div>
{/each}
