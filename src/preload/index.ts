import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

contextBridge.exposeInMainWorld('electron', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  getBuffer: (path: string) => ipcRenderer.invoke('file:buffer', path),
  getLyric: (path: string) => ipcRenderer.invoke('lyric:read', path),
  openBrowser: (path: string) => ipcRenderer.invoke('dialog:link', path),
  writeLyric: (path: string, lyrics: string) => ipcRenderer.invoke('lyric:write', path, lyrics),
  fileExists: (path: string) => ipcRenderer.invoke('file:exists', path),
  downloadCheck: (path: string) => ipcRenderer.invoke('lyric:check', path),
  getLib: (path: string) => ipcRenderer.invoke('file:lib', path),
  updateRPC: (album: string, song: string, artist: string) =>
    ipcRenderer.invoke('rpc', album, song, artist),
  libAdd: (lib: string, offset?: number) => ipcRenderer.invoke('dialog:add', lib, offset)
})
contextBridge.exposeInMainWorld('info', electronAPI)
