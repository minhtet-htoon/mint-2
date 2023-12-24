<script lang="ts">
  import { page, Pages } from '../utils/pages'
  import settings from '../assets/settings.svg'
  import heart from '../assets/heart.svg'
  import Dialog from './Dialog.svelte'
  import Icon from './Icon.svelte'
  import { version } from '../utils/info'

  let dialog
  let modalPage: number = 0
</script>

<ul class="menu flex-col space-y-3 bg-base-200 h-screen w-full rounded-box">
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
    <button
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        page.set(Pages.Library)
      }}>Library</button
    >
  </li>
  <li>
    <button
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        page.set(Pages.Library)
      }}>Metadata Editor</button
    >
  </li>
  <div class="flex grow" />
  <li class="w-full flex">
    <button
      class="w-full flex grow"
      on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        dialog.showModal()
      }}
    >
      <div class="flex-row grow space-x-3 justify-between flex">
        <p class="flex h-full align-middle">Mint Music v{version.mint}</p>
      </div>
      <Icon path={settings} class="align-middle w-6 h-6" />
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
            <p class="flex w-full">
              Made with <Icon class="w-3 h-3" path={heart} /> by MintyH and Contributors
            </p>
          </li>
        </ul>
      </div>
      <div class="grow w-full space-y-5 flex flex-col">
        {#if modalPage === 0}
          <h1 class="text-6xl">About</h1>
          <h2 class="text-3xl">Version Info</h2>
          <p>Mint Music v{version.mint}</p>
          <p>Node JS {version.node}</p>
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
          <a
            href="#"
            on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.electronAPI.openBrowser('https://lrclib.net')
            }}>Lyrics API by LRCLib.net</a
          >
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
