import { type Writable, writable } from "svelte/store";

export enum Pages {
  Files,
  Player,
  Library,
  Lyrics
}

export const page: Writable<Pages> = writable(Pages.Files)
