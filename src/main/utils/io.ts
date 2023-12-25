import { dialog } from 'electron'
import { parseFile } from 'music-metadata'
import type { ILib, ISong } from "../../types";
import * as fs from 'fs'
import { globSync } from 'glob'
import { createLibrary, writeLib } from './library'

export async function load(): Promise<ISong[]> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Audio', extensions: ['mp3', 'flac'] }],
    properties: ['multiSelections']
  })
  if (!canceled) {
    return createSongs(filePaths)
  } else {
    return [
      {
        path: 'Error',
        data: undefined,
        id: -1,
        error: 'Operation Canceled'
      }
    ]
  }
}

export async function createSongs(paths: string[]): Promise<ISong[]> {
  const ret: ISong[] = []
  const tot = new Date()
  for (let i = 0; i < paths.length; i++) {
    const time = new Date()
    const dat = await parseFile(paths[i]).catch(() => {
      return undefined
    })
    ret.push({
      path: paths[i],
      data: dat,
      id: dat === undefined ? -1 : i,
      error: dat === undefined ? 'Failed to Parse' : undefined
    })
    console.log(`Finished with ${paths[i]} in ${new Date().getTime() - time.getTime()} ms`)
  }
  console.log(`Loaded ${paths.length} songs in ${new Date().getTime() - tot.getTime()} ms`)
  return ret
}

export async function loadFolder(): Promise<{ songs: ISong[]; dir: string }> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['multiSelections', 'openDirectory']
  })
  console.log(`Found Paths: ${filePaths[0]}/**/*`)
  console.log(globSync(filePaths[0].concat('/**/*'), { absolute: true }))
  if (!canceled) {
    const songs = createSongs(
      globSync(filePaths[0].concat('/**/*'),{ absolute: true })
        .filter((value) => {
          const ext = value.split('.').pop()
          return ext === 'mp3' || ext === 'flac'
        })
        .reverse()
    )
    writeLib(filePaths[0], createLibrary(await songs))
    return { songs: await songs, dir: filePaths[0] }
  } else {
    return {
      songs: [],
      dir: filePaths[0]
    }
  }
}

export function loadBuffer(_event, path: string): Buffer {
  return fs.readFileSync(path)
}

export function loadLyric(_event, path: string): string {
  console.log(fs.readFileSync(path.split('.')[0].concat('.lrc'), { encoding: 'utf8' }))
  const split = path.split('.')
  split.pop()
  return fs.existsSync(''.concat(...split, '.lrc'))
    ? fs.readFileSync(path.split('.')[0].concat('.lrc'), { encoding: 'utf8' })
    : 'error'
}

export async function writeLyric(_event, path: string, lyrics: string): Promise<void> {
  fs.writeFile(path.split('.')[0] + '.lrc', lyrics, (err) => {
    console.log(err)
  })
}

export async function getLib(_event, path: string): Promise<ILib> {
  return JSON.parse(fs.readFileSync(path + '/library.mint.json', 'utf-8'))
}
