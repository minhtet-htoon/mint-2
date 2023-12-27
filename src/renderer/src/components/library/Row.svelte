<script lang="ts">
  import type { ISong } from '../../../../types'
  import Dialog from '../Dialog.svelte'
  import { current } from '../../utils/queue'
  import * as player from '../../utils/player'
  import { Playing } from '../../utils/player'
  import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-svelte'
  import Icon from '../Icon.svelte'
  import check from '../../assets/check.svg'
  import x from '../../assets/x.svg'
  import download from '../../assets/download.svg'
  import { lrcFileName, lrcSearch } from '../../utils/lrc'

  export let song: ISong

  let promise

  let downloadAttempted = false


  function handleDownloadButton(): void {
    promise = lrcSearch(song)
    downloadAttempted = true
  }

  function handleRowButton(): void {
    player.stop()
    current.set(song)
    player.play()
  }


  let dialog
</script>

<tr class="bg-white transition ease-in-out duration-300 hover:bg-gray-200">
  <th>
    <label>
      <button class="btn h-full btn-ghost btn-xs" on:click={handleRowButton}>
        {#if $Playing && $current === song}
          <IconPlayerPause class="h-full"></IconPlayerPause>
        {:else}
          <IconPlayerPlay class="h-full" />
        {/if}
      </button>
    </label>
  </th>
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-12 h-12">
          <img
            src={URL.createObjectURL(
              new Blob([song.data.common.picture[0].data], { type: 'image/jpeg' } /* (1) */)
            )}
            alt="Cover"
          />
        </div>
      </div>
      <div>
        <div class="font-bold">{song.data.common.title}</div>
      </div>
    </div>
  </td>
  <td>
    {song.data.common.artist}
  </td>
  <td>{song.data.common.album}</td>
  <td>
    <div class="w-full justify-center flex">
      {#await window.electron.fileExists(lrcFileName(song.path))}
        <span class="loading loading-bars" />
      {:then lrc}
        {#if lrc}
          <Icon path={check} class="w-6 h-6 stroke-green-500" />
        {:else if !downloadAttempted}
          <button
            class="btn transition ease-in-out duration-300 hover:scale-110"
            on:click={handleDownloadButton}
          >
            <Icon class="w-6 h-6 stroke-red-500" path={download} />
          </button>
        {:else}
          {#await promise}
            <span class="loading loading-bars" />
          {:then val}
            {#if val}
              <Icon path={check} class="w-6 h-6 stroke-green-500" />
            {:else}
              <Icon path={x} class="w-6 h-6 stroke-green-500" />
            {/if}
          {/await}
        {/if}
      {/await}
    </div>
  </td>
  <th>
    <button
      class="btn transition ease-in-out duration-300 hover:scale-110 btn-ghost btn-xs"
      on:click={() => dialog.showModal()}>Details</button
    >
  </th>
</tr>

<Dialog bind:dialog>
  <div class="p-5 flex-col">
    <div class="flex">
      <div class="flex items-center gap-3">
        <div class="avatar w-full pr-5">
          <div class="rounded-2xl">
            <img
              src={URL.createObjectURL(
                new Blob([song.data.common.picture[0].data], { type: 'image/jpeg' } /* (1) */)
              )}
              alt="Cover"
            />
          </div>
        </div>
      </div>
      <div class="overflow-x-auto w-full">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Title</td>
              <td>{song.data.common.title}</td>
            </tr>
            <!-- row 1 -->
            <tr>
              <td>Artist</td>
              <td>{song.data.common.artist}</td>
            </tr>
            <!-- row 2 -->
            <tr>
              <td>Album</td>
              <td>{song.data.common.album}</td>
            </tr>
            <!-- row 3 -->
            <tr>
              <td>Duration</td>
              <td
                >{`${Math.trunc(Math.trunc(song.data.format.duration) / 60)}:${
                  Math.trunc(song.data.format.duration) % 60 >= 10
                    ? Math.trunc(song.data.format.duration) % 60
                    : `0${Math.trunc(song.data.format.duration) % 60}`
                }`}</td
              >
            </tr>
            <tr>
              <td>Track Number</td>
              <td>{song.data.common.track.no}</td>
            </tr>
            <tr>
              <td>Release Year</td>
              <td>{song.data.common.year}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>{song.data.common.genre}</td>
            </tr>
            <tr>
              <td>Format</td>
              <td>{song.path.split('.').pop().toUpperCase()}</td>
            </tr>
            <tr>
              <td>Bitrate</td>
              <td>{song.data.format.bitrate}</td>
            </tr>
            <tr>
              <td>Sample Rate</td>
              <td>{song.data.format.sampleRate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</Dialog>
