<script lang="ts">
  import type { ILib } from '../../../../types'

  export let library: ILib
</script>

<table class="table">
  <tbody>
    {#each library.artists as artist}
      <tr>
        <div class="w-full p-5 flex flex-row">
          <div class="w-1/2">
            <h1 class="text-3xl">{artist.name}</h1>
          </div>
          <div class="w-1/2">
            {#each artist.albums as album}
              <h1 class="text-2xl">{album.name}</h1>
              <table class="table w-full">
                <tbody>
                  {#each album.songs as song}
                    <tr class="hover">{song.name}</tr>
                  {/each}
                </tbody>
              </table>
            {/each}
          </div>
        </div>
      </tr>
    {/each}
  </tbody>
</table>
