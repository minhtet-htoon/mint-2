import { type ILyric } from '../../../types'
/**
 * Finds attempts to find lrc file in the same directory with the same path
 * Expects lrc files without metadata
 * @param {string} path
 * @returns {string}
 * */
export async function getLyrics(path: string): Promise<ILyric[]> {
  if (!path) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const file: string = await window.electronAPI.getLyric(path)
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
 * Returns the next n lyric to display (e.g. n = 1 for next line and n = 2 for the one after that)
 * @param {number} time
 * @param {ILyric[]} lrcs
 * @param {number} n
 * @returns string
 */
export function nextLine(time: number, lrcs: ILyric[], n: number): string {
  try {
    return lrcs.filter((v) => {
      return v.time >= time
    })[n - 1].line
  } catch (e) {
    return '--'
  }
}

