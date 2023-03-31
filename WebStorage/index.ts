import type { WebStorageOptions } from './types'
import { WebStorage } from './WebStorage'

export const createLocalStorage = (options?: WebStorageOptions) => {
  return new WebStorage(localStorage, options)
}

export const createSessionStorage = (options?: WebStorageOptions) => {
  return new WebStorage(sessionStorage, options)
}

export { WebStorage }

export default WebStorage
