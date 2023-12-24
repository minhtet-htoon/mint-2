import { queue, current } from './queue'
import { Howl } from 'howler'
import type { ISong } from '../../../types'
import { writable, type Writable } from 'svelte/store'

export let sound: Howl

export const Playing: Writable<boolean> = writable(false)

export const Progress: Writable<number> = writable(0)

export const LastEvent: Writable<Date> = writable(new Date())

let localQueue: ISong[], localCurrent: ISong

queue.subscribe((value) => {
  console.log(value)
  localQueue = value
})
current.subscribe((value) => {
  console.log(value)
  localCurrent = value
})

/**
 * Loads and plays music if not loaded or just plays
 */
export async function play(): Promise<void> {
  if (!sound) {
    sound = new Howl({
      src: [
        URL.createObjectURL(
          new Blob(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            [await window.electronAPI.getBuffer(localCurrent.path)],
            { type: 'audio/mpeg' } /* (1) */
          )
        )
      ],
      format: ['mp3'],
      onend: end
    })
  }
  if (!sound.playing()) {
    sound.play()
  }
  Playing.set(true)
  console.log('Playing (Main Play Method)')
  throw 'Stack Trace'
}

/**
 * Handles Common Button
 */
export function commonButton(): void {
  try {
    if (!sound) {
      play()
      console.log('Common Play')
    } else {
      if (sound.playing()) {
        pause()
      } else {
        play()
        console.log('Common Play 2')
      }
    }
    console.log('Common Button')
  } catch (e) {
    play()
    console.log('Common Catch Play')
  }
}
export function stop(): void {
  if (sound) {
    sound.stop()
    sound.unload()
    sound = undefined
    Playing.set(false)
  }
}

/**
 * Pauses playback
 */
export function pause(): void {
  sound.pause()
  Playing.set(false)
  console.log('Pause (Main Pause Method)')
}

/**
 * Advances to next track and plays
 */
export async function end(): Promise<void> {
  try {
    sound.stop()
    sound.unload()
    if (localQueue[getPlaying() + 1]) {
      current.set(localQueue[getPlaying() + 1])
    } else {
      current.set(localQueue[0])
    }
    console.log(
      localQueue.findIndex((value: ISong) => {
        return value.id === localCurrent.id
      }) + 1
    )

    sound = new Howl({
      src: [
        URL.createObjectURL(
          new Blob(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            [await window.electronAPI.getBuffer(localCurrent.path)],
            { type: 'audio/mpeg' } /* (1) */
          )
        )
      ],
      format: ['mp3'],
      onend: end
    })

    console.log(localCurrent)
    play()
    console.log('end play')
    console.log('End')
  } catch (e) {
    play()
    console.log('End Catch')
  }
}

/**
 * Goes back one track if time is less than 10s, goes to start if more than 10 s
 */
export async function back(): Promise<void> {
  try {
    if (sound.seek() > 10) {
      console.log(getPlaying() - 1)
      sound.pause()
      sound.seek(0)
      sound.play()
      console.log('Back Play')
    } else if (getPlaying() - 1 >= 0) {
      sound.stop()
      sound.unload()
      current.set(localQueue[getPlaying() - 1])
      sound = new Howl({
        src: [
          URL.createObjectURL(
            new Blob(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              [await window.electronAPI.getBuffer(localCurrent.path)],
              { type: 'audio/mpeg' } /* (1) */
            )
          )
        ],
        format: ['mp3'],
        onend: end
      })
      play()
      console.log('back play 2')
    }
    console.log('Back')
  } catch (e) {
    play()
    console.log('back catch')
  }
}

/**
 * Returns formatted time in mm:ss format
 * @param {number} time
 * @returns {string}
 */
export function formatTime(time: number): string {
  return `${Math.trunc(Math.trunc(time) / 60)}:${
    Math.trunc(time) % 60 >= 10 ? Math.trunc(time) % 60 : `0${Math.trunc(time) % 60}`
  }`
}

/**
 * Returns the index of the currently playing song
 * @returns {number}
 */
export function getPlaying(): number {
  return localQueue.findIndex((value) => {
    return value.id === localCurrent.id
  })
}
