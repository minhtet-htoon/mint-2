<script lang="ts">
  import type { ISong } from '../../../../types'
  import Dialog from '../Dialog.svelte'
  import {
    IconArrowDown,
    IconArrowUp,
    IconCheck,
    IconCircleRectangle,
    IconDotsVertical,
    IconDownload,
    IconPlayerPlay,
    IconPlayerSkipForward,
    IconX
  } from '@tabler/icons-svelte'
  import { lrcFileName, lrcSearch } from '../../utils/lrc'
  import { queue, current, albumImage } from "../../utils/queue";
  import { play, stop } from '../../utils/player'

  export let song: ISong

  let promise

  let downloadAttempted = false
  function handleDownloadButton(): void {
    promise = lrcSearch(song)
    downloadAttempted = true
  }
  function playNow(): void {
    stop()
    current.set(
      $queue[
        $queue.findIndex((s) => {
          return song.id === s.id
        })
      ]
    )
    play()
  }
  function remove(): void {
    const temp = $queue
    temp.splice(
      temp.findIndex((s) => {
        return song.id === s.id
      }),
      1
    )
    queue.set(temp)
  }
  function down(): void {
    let tempArr = $queue
    const temp =
      tempArr[
        tempArr.findIndex((s) => {
          return song.id === s.id
        })
      ]
    const target = tempArr.findIndex((s) => {
      return song.id === s.id
    })
    tempArr[target] = tempArr[target + 1]
    tempArr[target + 1] = temp
    queue.set(tempArr)
  }
  function up(): void {
    let tempArr = $queue
    const temp =
      tempArr[
        tempArr.findIndex((s) => {
          return song.id === s.id
        })
      ]
    const target = tempArr.findIndex((s) => {
      return song.id === s.id
    })
    tempArr[target] = tempArr[target - 1]
    tempArr[target - 1] = temp
    queue.set(tempArr)
  }
  function next(): void {
    let tempArr = $queue
    const temp =
      tempArr[
        tempArr.findIndex((s) => {
          return song.id === s.id
        })
      ]
    const target = tempArr.findIndex((s) => {
      return song.id === s.id
    })
    tempArr[target] =
      tempArr[
        tempArr.findIndex((s) => {
          return $current.id === s.id
        }) + 1
      ]
    tempArr[
      tempArr.findIndex((s) => {
        return $current.id === s.id
      }) + 1
    ] = temp
    queue.set(tempArr)
  }
  let dialog
</script>

<tr
  class={`${
    $current.id === song.id
      ? 'bg-base-200 transition ease-in-out duration-200 hover:bg-base-300'
      : 'bg-base-100 transition ease-in-out duration-200 hover:bg-base-200'
  }`}
>
  <th>
    <label>
      <div class="dropdown dropdown-right">
        <button tabindex="0">
          <IconDotsVertical class="stroke-primary" />
        </button>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex-->
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <button on:click={playNow} class="flex">
              <IconPlayerPlay class="stroke-primary" />
              <span>Play</span>
            </button>
          </li>
          <li>
            <button on:click={remove} class="flex">
              <IconCircleRectangle class="stroke-primary" />
              <span>Remove</span>
            </button>
          </li>
          <li>
            <button on:click={up} disabled={$queue.indexOf(song) === 0} class="flex">
              <IconArrowUp class="stroke-primary" />
              <span>Move Up</span>
            </button>
          </li>
          <li>
            <button
              on:click={down}
              disabled={$queue.indexOf(song) === $queue.length - 1}
              class="flex"
            >
              <IconArrowDown class="stroke-primary" />
              <span>Move Down</span>
            </button>
          </li>
          <li>
            <button
              on:click={next}
              disabled={$queue.indexOf(song) === $queue.length - 1}
              class="flex"
            >
              <IconPlayerSkipForward class="stroke-primary" />
              <span>Play Next</span>
            </button>
          </li>
        </ul>
      </div>
    </label>
  </th>
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-12 h-12">
          <img
            src={albumImage(song)}
            alt="Cover"
          />
        </div>
      </div>
      <div>
        {#if $current.id === song.id}
          <div class="font-extrabold text-primary">{song.data.common.title}</div>
        {:else}
          <button class="font-semibold hover:underline" on:click={playNow}
            >{song.data.common.title}</button
          >
        {/if}
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
          <IconCheck class="stroke-success" />
        {:else if !downloadAttempted}
          <button
            class="btn transition ease-in-out duration-300 hover:scale-110"
            on:click={handleDownloadButton}
          >
            <IconDownload class="stroke-primary" />
          </button>
        {:else}
          {#await promise}
            <span class="loading loading-bars" />
          {:then val}
            {#if val}
              <IconCheck class="stroke-primary" />
            {:else}
              <IconX class="stroke-primary" />
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
              src={albumImage(song)}
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
