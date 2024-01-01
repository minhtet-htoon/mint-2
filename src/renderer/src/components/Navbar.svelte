<script lang="ts">
  import { page, Pages, theme } from '../utils/pages'
  import Dialog from './Dialog.svelte'
  import { version } from '../utils/info'
  import { IconAlertTriangle, IconAtom, IconHeart, IconSettings } from '@tabler/icons-svelte'

  const env = window.info.process.env
  const versions = window.info.process.versions

  let dialog
  let modalPage: number = 0
</script>

<ul class="menu resize-x flex flex-col space-y-3 bg-base-200 h-screen grow w-full rounded-box">
  <div class="bg-blue-600 flex rounded-box w-auto align-middle justify-center h-[10%] m-3">
    <p>Mint Music Logo</p>
  </div>
  <li>
    <button
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        page.set(Pages.Player)
      }}>Player</button
    >
  </li>
  <li>
    <button
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        page.set(Pages.Lyrics)
      }}>Lyrics</button
    >
  </li>
  <li>
    <details open>
      <summary>Library</summary>
      <ul>
        <li>
          <button
            on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            () => {
              page.set(Pages.Library)
            }}>Browse</button
          >
        </li>
        <li>
          <button
            on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            () => {
              page.set(Pages.FileManager)
            }}>Manage Files</button
          >
        </li>
      </ul>
    </details>
  </li>
  <li>
    <button
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        page.set(Pages.Editor)
      }}>Metadata Editor and FFMPEG</button
    >
  </li>
  <div class="flex grow" />
  <li class="w-full flex space-y-3">
    {#if env.NODE_ENV === 'development'}
      <div
        class="tooltip text-warning font-bold"
        data-tip="Warning: You are using a development version of Mint Music. The app may be unstable and behave in unexpected ways. Features may be removed in final version."
      >
        <p class="h-full justify-left">
          <IconAlertTriangle class="inline" />
          <span class="h-full">WARNING: DEVELOPMENT ENVIRONMENT</span>
        </p>
      </div>
    {/if}
    <button
      class="w-full flex grow"
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        dialog.showModal()

        modalPage = 0
      }}
    >
      <div class="flex-row grow space-x-3 justify-between flex">
        <p class="flex h-full align-middle font-bold">
          {env.NODE_ENV === 'development' ? 'DEV BUILD' : `Mint Music v${version.mint}`}
        </p>
      </div>
      <IconSettings class="stroke-primary" />
    </button>
  </li>
</ul>

<Dialog bind:dialog>
  <div class="p-5 flex-col">
    <div class="flex space-x-5 w-full">
      <div class="flex w-2/5">
        <ul class="menu flex-col space-y-3 h-full bg-base-200 w-full rounded-box">
          <li>
            <button
              on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              () => {
                modalPage = 0
              }}>About</button
            >
          </li>
          <li>
            <button
              on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              () => {
                modalPage = 1
              }}>Settings</button
            >
          </li>
          <div class="flex grow" />
          <li class="w-full flex flex-row">
            <div class="flex w-full">
              <span> Made with </span>
              <IconHeart class="stroke-primary" />
              <span>and designed with</span>
              <IconAtom class="stroke-primary" />
              <span> by MintyH and Contributors </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="w-3/5 space-y-5 flex flex-col">
        {#if modalPage === 0}
          <h1 class="text-6xl">About</h1>
          <h2 class="text-3xl">Copyright and License Declarations</h2>
          <p>&copy; {new Date().getFullYear()} MintyH and Contributors</p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy of this
            software and associated documentation files (the "Software"), to deal in the Software
            without restriction, including without limitation the rights to use, copy, modify,
            merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
            permit persons to whom the Software is furnished to do so, subject to the following
            conditions:
          </p>
          <p>
            The above copyright notice and this permission notice shall be included in all copies or
            copies or substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
            HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
            CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
            THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
          <h2 class="text-3xl">Acknowledgements</h2>
          <button
            class="text-left link-info"
            on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.electron.openBrowser('https://lrclib.net')
            }}>Lyrics API by LRCLib.net</button
          >
          <h2 class="text-3xl">Version Info</h2>
          <p>{env.NODE_ENV === 'development' ? 'DEV BUILD' : `Mint Music v${version.mint}`}</p>
          <p>Node JS v{versions.node}</p>
          <p>Electron v{versions.electron}</p>
          <p>V8 v{versions.v8}</p>
          <p>Chromium v{versions.chrome}</p>
        {:else if modalPage === 1}
          <h1>Theme</h1>
          <select class="select border-primary" bind:value={$theme}>
            <option disabled>Light Themes</option>
            <option value="light">Light</option>
            <option value="winter">Winter</option>
            <option value="pastel">Pastel</option>
            <option value="nord">Nord</option>
            <option value="emerald">Emerald</option>
            <option disabled>Dark Themes</option>
            <option value="dark">Dark</option>
            <option value="black">Black</option>
            <option value="sunset">Sunset</option>
          </select>
        {/if}
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
