import { type Writable, writable } from 'svelte/store'

export enum Pages {
  Files,
  Player,
  Library,
  Lyrics,
  FileManager,
  Editor
}

export const page: Writable<Pages> = writable(Pages.Files)
