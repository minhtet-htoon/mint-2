import type { IAudioMetadata } from 'music-metadata'
export interface ISong {
  path: string
  data?: IAudioMetadata
  id: number
  error?: string
}
export interface ILyric {
  time: number
  line: string
}
export interface ILib {
  ver: string
  artists: {
    name: string
    albums: {
      name: string
      songs: {
        path: string
        name?: string
      }[]
    }[]
  }[]
  playlists: {
    name: string
    paths: string[]
  }[]
}
