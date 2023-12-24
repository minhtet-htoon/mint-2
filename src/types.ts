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
