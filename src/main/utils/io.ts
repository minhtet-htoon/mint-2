import { dialog } from 'electron'
import { parseFile } from 'music-metadata'
import type { ILib, ISong } from '../../types'
import * as fs from 'fs'
import { globSync } from 'glob'
import { createLibrary, writeLib } from './library'
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

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
    properties: ['openDirectory']
  })
  console.log(`Found Paths: ${filePaths[0]}/**/*`)
  if (!canceled) {
    let songs: Promise<ISong[]>
    if (fs.existsSync(filePaths[0] + '/library.mint.json')) {
      console.log('library file found, importing from library')
      // @ts-ignore 2345
      const lib = await getLib(undefined, filePaths[0])
      const paths: string[] = []
      lib.artists.forEach((artist) => {
        artist.albums.forEach((album) => {
          album.songs.forEach((song) => {
            paths.push(song.path)
          })
        })
      })
      songs = createSongs(paths)
    } else {
      console.warn('No Library File')
      songs = createSongs(
        globSync(filePaths[0].concat('/**/*'), { absolute: true })
          .filter((value) => {
            const ext = value.split('.').pop()
            return ext === 'mp3' || ext === 'flac'
          })
          .reverse()
      )
      console.log(songs)
      writeLib(
        filePaths[0],
        createLibrary(
          await songs,
          { ver: '0.0.1', dirs: [filePaths[0]], artists: [], playlists: [] },
          filePaths[0]
        )
      )
    }
    return { songs: await songs, dir: filePaths[0] }
  } else {
    return {
      songs: [],
      dir: filePaths[0]
    }
  }
}

export async function libAdd(
  _event: IpcMainInvokeEvent,
  dir: string
): Promise<{ songs: ISong[]; dir: string }> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (!canceled) {
    const songs = await createSongs(
      globSync(filePaths[0].concat('/**/*'), { absolute: true })
        .filter((value) => {
          const ext = value.split('.').pop()
          return ext === 'mp3' || ext === 'flac'
        })
        .reverse()
    )
    if (fs.existsSync(dir.concat('/library.mint.json'))) {
      writeLib(
        dir,
        createLibrary(
          songs,
          JSON.parse(fs.readFileSync(dir + '/library.mint.json', 'utf-8')),
          filePaths[0]
        )
      )
    }
    return { songs: songs.reverse(), dir: dir }
  } else {
    return {
      songs: [],
      dir: filePaths[0]
    }
  }
}

export function loadBuffer(_event: IpcMainInvokeEvent, path: string): Buffer {
  return fs.readFileSync(path)
}

export function loadLyric(_event: IpcMainInvokeEvent, path: string): string {
  const array = path.split('.')
  array.pop()
  console.log(''.concat(...array, '.lrc'))
  const split = path.split('.')
  split.pop()
  return fs.existsSync(''.concat(...split, '.lrc'))
    ? fs.readFileSync(''.concat(...split, '.lrc'), { encoding: 'utf8' })
    : 'error'
}

export async function writeLyric(
  _event: IpcMainInvokeEvent,
  path: string,
  lyrics: string
): Promise<void> {
  const array = path.split('.')
  array.pop()
  console.log(''.concat(...array, '.lrc'))
  fs.writeFile(''.concat(...array, '.lrc'), lyrics, (err) => {
    console.log(err)
  })
}

export async function getLib(_event: IpcMainInvokeEvent, path: string): Promise<ILib> {
  return JSON.parse(fs.readFileSync(path + '/library.mint.json', 'utf-8'))
}
