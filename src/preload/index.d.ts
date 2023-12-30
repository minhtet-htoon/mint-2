import { ISettings } from "../types";

interface Window {
    electron: {
      openFile()
      openFolder()
      getBuffer(path: string)
      getLyric(path: string)
      openBrowser(path: string)
      writeLyric(path: string)
      fileExists(path: string)
      downloadCheck(path: string)
      getLib(path: string)
      updateRPC(album: string, title: string, artist: string)
      libAdd(lib: string, offset?: number),
      onSettingsLoad(callback: function(value: ISettings))
    }
  }
