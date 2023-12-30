<script lang="ts">
  import imgURL from './assets/Files.png'
  import { current, init, queue, lib, purgeImages } from './utils/queue'
  import Row from './components/library/Row.svelte'
  import type { ISong } from '../../types'
  import Player from './components/Player.svelte'
  import './utils/player'
  import Navbar from './components/Navbar.svelte'
  import { page, Pages, theme } from './utils/pages'
  import MiniPlayer from './components/MiniPlayer.svelte'
  import { getLyrics, lrcSearch } from './utils/lrc'
  import fileSad from './assets/file-sad.svg'
  import Icon from './components/Icon.svelte'
  import LyricDisplay from './components/LyricDisplay.svelte'
  import Library from './components/library/Library.svelte'
  import FileManager from './components/FileManager.svelte'
  import { onMount } from 'svelte'
  import { Progress } from './utils/player'
  import { themeChange } from 'theme-change'

  let promise

  let lrcFetch

  let search = false

  let dir: string
  current.subscribe(() => {
    search = false
    lrcFetch = undefined
    try {
      window.electron.updateRPC(
        $current.data.common.album ? $current.data.common.album : 'Unknown',
        $current.data.common.title ? $current.data.common.title : 'Unknown',
        $current.data.common.artist ? $current.data.common.artist : 'Unknown'
      )
    } catch {
      /* empty */
    }
  })

  onMount(() => {
    Progress.set(0)
    themeChange(false)
  })

  const initiateImport = async function (): Promise<void> {
    try {
      queue.set(await init(await window.electron.openFile(), false))
      $queue.forEach((value: ISong) => {
        console.log(value)
      })
      // current.update($queue[0])
    } catch (e) {
      console.log(e)
    }
    current.set($queue[0])
    page.set(Pages.Player)
  }

  async function importFolder(): Promise<void> {
    try {
      const obj = await window.electron.openFolder()
      dir = obj.dir
      queue.set(purgeImages(await init(obj.songs, false)))
      $queue.forEach((value: ISong) => {
        console.log(value)
      })

      lib.set(await window.electron.getLib(dir))
      current.set($queue[0])
      page.set(Pages.Player)
    } catch (e) {
      console.error(e)
    }
  }

  function fileImport(): void {
    promise = initiateImport()
  }
  function folderImport(): void {
    promise = importFolder()
  }

  function handleSearchClick(): void {
    lrcFetch = lrcSearch($current)
    search = true
  }
</script>

<html data-theme={$theme} lang="en">
  <div class="flex items-center justify-center h-screen">
    <div class="flex-col flex h-full content-center">
      {#if $queue.length === 0}
        <div class="flex flex-row p-4">
          <div class="flex-1" />
          <h1 class="left-auto right-auto text-8xl">No Files Present</h1>
          <div class="flex-1" />
        </div>
        <img src={imgURL} class="p-5 shrink" alt="File Icon" />
        <div class="flex flex-row">
          <div class="flex-1" />
          <h2 class="text-5xl">Import files or a library</h2>
          <div class="flex-1" />
        </div>
        <div class="flex flex-row space-x-5 p-5">
          <div class="flex-1" />
          <button class="btn top-4" on:click={fileImport}>Import Files</button>
          <button class="btn top-4" on:click={folderImport}>Import Folder</button>
          <div class="flex-1" />
        </div>
        {#if promise}
          {#await promise}
            <progress class="progress w-full" />
          {/await}
        {/if}
      {:else}
        <div class="flex space-x-5 h-full flex-row w-screen">
          <div class="w-96">
            <Navbar />
          </div>
          {#if $page === Pages.Player}
            <div class="flex flex-col h-full w-full flex-1">
              <Player />
              <div class="overflow-x-auto shrink overflow-y-auto">
                <table class="table table-pin-rows">
                  <thead>
                    <tr>
                      <th> </th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Album</th>
                      <th class="text-center">Lyrics</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each $queue as song}
                      <Row {song} />
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {:else if $page === Pages.Lyrics}
            <div class="flex-col flex justify-between h-full w-full">
              <div class="justify-center align-middle overflow-y-auto flex flex-col">
                {#await getLyrics($current.path) then lrc}
                  <LyricDisplay {lrc} />
                {:catch _err}
                  <div class="flex flex-col text-center space-y-5 justify-center align-middle">
                    <p class="text-5xl">Lyrics couldn't be loaded or failed to parse</p>
                    <div class="flex justify-center flex-row">
                      <Icon path={fileSad} />
                    </div>
                    <p>
                      Mint Music looks for lrc files with the same name as their corresponding music
                      file
                    </p>
                    <p>
                      For file {$current.path}, mint music will look for
                      {$current.path.split('.')[0] + '.lrc'}
                    </p>
                    <p>
                      For parsing problems, refer to this <button
                        on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        () => {
                          //@ts-ignore 2345
                          window.electron.openBrowser(
                            'https://en.wikipedia.org/wiki/LRC_(file_format)'
                          )
                        }}
                        class="text-blue-500 underline">Wikipedia Article</button
                      >
                    </p>
                    <p>{_err}</p>
                    <div class="w-full flex align-middle justify-center">
                      <button
                        class="btn w-1/5 justify-center align-middle flex"
                        on:click={handleSearchClick}
                        disabled={search}>Try to Find Lrc Online and Make New File</button
                      >
                    </div>
                    {#await lrcFetch}
                      <progress class="w-full progress" />
                    {:then status}
                      {#if status}
                        <p>
                          LRC File Found and Saved. Please exit page and come back to see lyrics
                        </p>
                      {:else}
                        <p>LRC File Not Found</p>
                      {/if}
                    {/await}
                  </div>
                {/await}
              </div>
              <div class="w-full flex">
                <MiniPlayer />
              </div>
            </div>
          {:else if $page === Pages.Library}
            <div class="flex flex-col w-full top-3 h-screen justify-between">
              <div class="justify-center shrink h-[90vh] overflow-y-scroll align-middle">
                <Library library={$lib} />
              </div>
              <div class="w-full flex">
                <MiniPlayer />
              </div>
            </div>
          {:else if $page === Pages.FileManager}
            <div class="flex flex-col w-full top-3 h-screen justify-between">
              <div class="justify-center shrink h-[90vh] overflow-y-auto align-middle">
                <FileManager lib={$lib} />
              </div>
              <div class="w-full flex">
                <MiniPlayer />
              </div>
            </div>
          {:else if $page === Pages.Editor}
            <div class="flex flex-col w-full">
              <div class="grow justify-center align-middle flex flex-col flex-1">
                <button
                  class="btn"
                  on:click={() => {
                    //@ts-ignore 2345
                    window.electron.openBrowser(
                      '"C:\\Program Files\\MusicBrainz Picard\\picard.exe"'
                    )
                  }}
                >
                  Launch External Editor
                </button>
              </div>
              <div class="w-full flex">
                <MiniPlayer />
              </div>
            </div>
          {/if}
          <div class="w-5" />
        </div>
      {/if}
    </div>
  </div>
</html>
