import { type ISong, ILib } from '../../types'
import { writeFileSync } from 'node:fs'

export function createLibrary(songs: ISong[], lib: ILib, dir: string): ILib {
  const ret: ILib = lib
  if (
    ret.dirs.find((val) => {
      return val === dir
    }) === undefined
  ) {
    lib.dirs.push(dir)
  }

  songs.forEach((song) => {
    // If song has data
    if (song.data !== undefined) {
      // If library doesn't already have artist, add artist
      if (
        ret.artists.find((artist) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          return artist.name === song.data.common.artist
        }) === undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ret.artists = [{ name: song.data.common.artist, albums: [] }, ...ret.artists]
        ret.artists.sort((a, b) => a.name.localeCompare(b.name))
      }
      // Create Album
      if (
        ret.artists[
          ret.artists.findIndex(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return name === song.data.common.artist
          })
        ].albums.find(({ name }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return name === song.data.common.album
        }) === undefined
      ) {
        ret.artists[
          ret.artists.findIndex(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return name === song.data.common.artist
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
        ].albums.push({ name: song.data.common.album, songs: [] })
        ret.artists[
          ret.artists.findIndex(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return name === song.data.common.artist
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
        ].albums.sort((a, b) => a.name.localeCompare(b.name))
      }
      ret.artists[
        ret.artists.findIndex(({ name }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return name === song.data.common.artist
        })
      ].albums[
        ret.artists[
          ret.artists.findIndex(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return name === song.data.common.artist
          })
        ].albums.findIndex(({ name }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return name === song.data.common.album
        })
      ].songs.push({ path: song.path, name: song.data.common.title })
      ret.artists[
        ret.artists.findIndex(({ name }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return name === song.data.common.artist
        })
      ].albums[
        ret.artists[
          ret.artists.findIndex(({ name }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return name === song.data.common.artist
          })
        ].albums.findIndex(({ name }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return name === song.data.common.album
        })
      ].songs.sort((a, b) => a.path.localeCompare(b.path))
    }
  })

  return ret
}

export function writeLib(path: string, lib: ILib): void {
  writeFileSync(path + '/library.mint.json', JSON.stringify(lib, null, '\t'))
}
