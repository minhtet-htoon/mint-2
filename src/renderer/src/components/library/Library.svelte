<script lang="ts">
  import type { ILib } from '../../../../types'
  import { queue, current } from '../../utils/queue'
  import { stop, play } from '../../utils/player'
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
              <h1 class="text-2xl hover">{album.name}</h1>
              <table class="table w-full">
                <tbody>
                  {#each album.songs as song}
                    <tr
                      on:dblclick={() => {
                        stop()
                        current.set(
                          $queue[
                            $queue.findIndex((val) => {
                              return val.path === song.path
                            })
                          ]
                        )
                        play()
                      }}
                      class="hover"
                    >
                      {song.name}
                    </tr>
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
