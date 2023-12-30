<script lang="ts">
  import type { ILib, ISong } from '../../../types'
  import { IconFolder, IconFolderMinus, IconFolderPlus, IconFolderRoot } from '@tabler/icons-svelte'
  import { queue } from '../utils/queue'
  import { stop } from '../utils/player'
  import { lib as globalLib } from '../utils/queue'

  export let lib: ILib
  async function loadFolder(): Promise<void> {
    try {
      const obj = await window.electron.libAdd($globalLib.dirs[0], $queue.length)
      queue.set([...$queue, ...obj.songs])
      $queue.forEach((value: ISong) => {
        console.log(value)
      })
      globalLib.set(await window.electron.getLib(lib.dirs[0]))
      // current.update($queue[0])
    } catch (e) {
      console.log(e)
    }
  }
  async function unload(): Promise<void> {
    $queue = []
    stop()
  }
</script>

<div class="w-full flex flex-col space-y-5 align-middle">
  <h1 class="text-5xl">Folders</h1>
  {#each lib.dirs as dir, i}
    <div class="w-full flex justify-center">
      <div class="h-56 w-3/4 flex flex-col justify-center bg-base-200 rounded-box">
        <div class="flex p-5 justify-center flex-row">
          {#if i === 0}
            <IconFolderRoot size={56} />
          {:else}
            <IconFolder size={56} />
          {/if}
          <div class="w-36" />
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl font-bold align-middle">{dir}{i === 0 ? ' (root)' : ''}</h2>
          </div>
        </div>
      </div>
    </div>
  {/each}
  <button class="w-full flex justify-center" on:click={loadFolder}>
    <div
      class="h-56 btn w-3/4 flex flex-col justify-center hover:scale-105 justify-items-start bg-base-200 rounded-box"
    >
      <div class="flex p-5 flex-row items-start">
        <IconFolderPlus size={56} />
        <div class="w-36" />
        <div class="flex flex-col justify-center">
          <h2 class="text-4xl font-bold align-middle">Add Folder to Library</h2>
        </div>
      </div>
    </div>
  </button>
  <button class="w-full flex justify-center" on:click={unload}>
    <div
      class="h-56 w-3/4 btn flex flex-col justify-center hover:scale-105 hover:bg-error justify-items-start bg-base-200 rounded-box"
    >
      <div class="flex p-5 flex-row items-start">
        <IconFolderMinus size={56} />
        <div class="w-36" />
        <div class="flex flex-col justify-center">
          <h2 class="text-4xl font-bold align-middle">Unload Library</h2>
        </div>
      </div>
    </div>
  </button>
</div>
