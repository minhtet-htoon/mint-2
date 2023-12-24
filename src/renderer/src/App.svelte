<script lang="ts">
  import imgURL from './assets/Files.png'
  import { current, init, queue } from './utils/queue'
  import Row from './components/library/Row.svelte'
  import type { ISong } from '../../types'
  import Player from './components/Player.svelte'
  import './utils/player'
  import Navbar from './components/Navbar.svelte'
  import { page, Pages } from './utils/pages'
  import MiniPlayer from './components/MiniPlayer.svelte'
  import { getLyrics } from './utils/lrc'
  import fileSad from './assets/file-sad.svg'
  import Icon from './components/Icon.svelte'
  import LyricDisplay from './components/LyricDisplay.svelte'

  let promise

  let search: boolean

  current.subscribe(() => {
    search = false
  })

  const initiateImport = async function (): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      queue.set(await init(await window.electronAPI.openFile(), false))
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      queue.set(await init(await window.electronAPI.openFolder(), false))
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

  function fileImport(): void {
    promise = initiateImport()
  }
  function folderImport(): void {
    promise = importFolder()
  }

  function handleSearchClick(): void {
    promise = lrcSearch()
    search = true
  }

  async function lrcSearch(): Promise<boolean> {
    console.log(
      `https://lrclib.net/api/get?track_name=${$current.data.common.title}&artist_name=${
        $current.data.common.artist
      }&album_name=${$current.data.common.album}&duration=${Math.trunc(
        $current.data.format.duration
      ).toString()}`
    )
    const res = await fetch(
      `https://lrclib.net/api/get?track_name=${$current.data.common.title}&artist_name=${
        $current.data.common.artist
      }&album_name=${$current.data.common.album}&duration=${Math.trunc(
        $current.data.format.duration
      ).toString()}`
    )
    const text = await res.text()

    if (res.ok) {
      const obj = JSON.parse(text)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      window.electronAPI.writeLyric($current.path, obj.syncedLyrics)
      return true
    } else {
      return false
    }
  }
</script>

<div class="flex items-center justify-center h-screen">
  <div class="flex-col content-center">
    {#if $queue.length === 0}
      <div class="flex flex-row p-4">
        <div class="flex-1" />
        <h1 class="left-auto right-auto text-8xl">No Files Present</h1>
        <div class="flex-1" />
      </div>
      <img src={imgURL} class="p-5" alt="File Icon" />
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
          <progress class="progress w-full grow" />
        {/await}
      {/if}
    {:else}
      <div class="flex space-x-5 flex-row w-screen">
        <div class="flex w-[15vw]">
          <Navbar />
        </div>
        {#if $page === Pages.Player}
          <div class="flex flex-col flex-1">
            <Player />
            <div class="overflow-x-auto h-[50vh] overflow-y-auto">
              <table class="table table-zebra table-pin-rows">
                <thead>
                  <tr>
                    <th> </th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
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
          <div class="flex flex-col w-full">
            <div class="grow justify-center align-middle flex flex-col flex-1">
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
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        window.electronAPI.openBrowser(
                          'https://en.wikipedia.org/wiki/LRC_(file_format)'
                        )
                      }}
                      class="text-blue-500 underline">Wikipedia Article</button
                    >
                  </p>
                  <p>{_err}</p>
                  <button class="btn" on:click={handleSearchClick} disabled={search}
                    >Try to Find Lrc Online and Make New File</button
                  >
                </div>
              {/await}
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
