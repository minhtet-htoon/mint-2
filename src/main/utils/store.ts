import { ISettings } from '../../types'
import Store from 'electron-store'
const store = new Store()

function writeStore(settings: ISettings): void {
  store.set('settings', settings)
  console.log(store.get('settings'))
}

function getStore(): ISettings {
  return store.get('settings') as ISettings
}
