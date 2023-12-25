import { type ISong, ILib } from '../../types'
import { writeFileSync } from 'node:fs'

export function createLibrary(songs: ISong[]): ILib {
  const ret: ILib = { ver: '1.0.0', artists: [], playlists: [] }

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
    }
  })
  return ret
}

export function writeLib(path: string, lib: ILib): void {
  writeFileSync(path + '/library.mint.json', JSON.stringify(lib))
}
