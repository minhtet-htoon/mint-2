import { type ILyric, type ISong } from '../../../types'

export function lrcFileName(musicPath: string): string {
  const array = musicPath.split('.')
  array.pop()
  console.log(''.concat(...array, '.lrc'))
  return ''.concat(...array, '.lrc')
}
/**
 * Finds attempts to find lrc file in the same directory with the same path
 * Expects lrc files without metadata
 * @param {string} path
 * @returns {Promise<ILyric[]>}
 * */
export async function getLyrics(path: string): Promise<ILyric[]> {
  if (!path) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const file: string = await window.electron.getLyric(path)
  console.log(file)

  if (!file) {
    return []
  }
  const ret: ILyric[] = []

  const lines: string[] = file.split('\n').filter((val) => {
    return val.charAt(0) === '['
  })

  lines.forEach((val) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ret.push({
      time:
        +val.split(']')[0].slice(1).split('.')[0].split(':').pop() +
        +val.split(']')[0].slice(1).split('.')[0].split(':')[0] * 60,
      line: val.split(']').pop()
    })
  })
  if (ret.length === 0) {
    throw 'No File'
  }
  console.log(ret)
  return ret
}

/**
 * Returns the lyric to display at any given time
 * @param {number} time
 * @param {ILyric[]} lrcs
 * @returns string
 */
export function lyrFromTime(time: number, lrcs: ILyric[]): string {
  try {
    return lrcs
      .filter((v) => {
        return v.time <= time
      })
      .pop().line
  } catch (e) {
    console.log(e)
    return ' '
  }
}

/**
 * Returns all lyrics after given time
 * @param {number} time
 * @param {ILyric[]} lrcs
 * @returns {ILyric[]}
 */
export function linesAfter(time: number, lrcs: ILyric[]): ILyric[] {
  try {
    return lrcs.filter((v) => {
      return v.time >= time
    })
  } catch (e) {
    return []
  }
}

export function linesBefore(time: number, lrcs: ILyric[]): ILyric[] {
  try {
    const ret = lrcs.filter((v) => {
      return v.time < time
    })
    ret.pop()
    return ret
  } catch (e) {
    return []
  }
}
/**
 * Returns boolean promise of whether a lrc file can be found and written
 * @param {ISong} song
 * @returns {Promise<boolean>}
 * */
export async function lrcSearch(song: ISong): Promise<boolean> {
  console.log(
    `https://lrclib.net/api/get?track_name=${song.data.common.title}&artist_name=${
      song.data.common.artist
    }&album_name=${song.data.common.album}&duration=${Math.trunc(
      song.data.format.duration
    ).toString()}`
  )
  const res = await fetch(
    `https://lrclib.net/api/get?track_name=${song.data.common.title}&artist_name=${
      song.data.common.artist
    }&album_name=${song.data.common.album}&duration=${Math.trunc(
      song.data.format.duration
    ).toString()}`
  )
  const text = await res.text()

  if (res.ok) {
    const obj = JSON.parse(text)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.electron.writeLyric(song.path, obj.syncedLyrics)
    return true
  } else {
    return false
  }
}
