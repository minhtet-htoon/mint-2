import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  getBuffer: (path: string) => ipcRenderer.invoke('dialog:buffer', path),
  getLyric: (path: string) => ipcRenderer.invoke('lyric:read', path),
  openBrowser: (path: string) => ipcRenderer.invoke('dialog:link', path),
  writeLyric: (path: string, lyrics: string) => ipcRenderer.invoke('lyric:write', path, lyrics)
})
