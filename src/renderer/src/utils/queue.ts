import type { ILib, ISong } from '../../../types'
import { type Writable, writable } from 'svelte/store'

export const queue: Writable<ISong[]> = writable([])
export const current: Writable<ISong> = writable()
export const shuffled: Writable<boolean> = writable(false)
export const lib: Writable<ILib> = writable()
export async function init(songs: ISong[], rand: boolean): Promise<ISong[]> {
  songs.forEach((v) => {
    if (v.data === undefined) {
      throw 'No Data'
    }
  })
  shuffled.set(rand)
  return rand
    ? shuffle(songs)
    : songs.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
}

export function regen(songs: ISong[], rand: boolean, playing: number): ISong[] {
  const current = songs.find((i) => i.id == playing)
  shuffled.set(rand)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return rand
    ? [
        current,
        ...shuffle(
          songs.filter((a) => {
            return a != current
          })
        )
      ]
    : songs.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
}

const shuffle = (array: ISong[]): ISong[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
