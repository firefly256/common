import { isArray, isNull, isNullOrUndef } from '../is'
import type { WebStorageOptions } from './types'
import { STORAGE_SCOPE_GLOBAL, STORAGE_TIMEOUT, STORAGE_PREFIX_KEY } from './constant'

export class WebStorage {
  private storage: Storage
  private prefixKey: string
  private timeout: number | null
  private scope: string

  constructor(storage?: Storage, { prefixKey, timeout, scope }: WebStorageOptions = {}) {
    this.storage = storage ?? localStorage
    this.prefixKey = prefixKey ?? STORAGE_PREFIX_KEY
    this.timeout = timeout ?? STORAGE_TIMEOUT
    this.scope = scope ?? STORAGE_SCOPE_GLOBAL
  }

  private getKey(key: string) {
    if (key.startsWith('_') || this.prefixKey === '') return key

    return `${this.prefixKey}_${key}`
  }

  get(key: string, def: any = null): any {
    const data = this.storage.getItem(this.getKey(key))
    if (isNull(data)) return def

    try {
      const { value, expire } = JSON.parse(data)

      if (isNullOrUndef(expire) || expire >= new Date().getTime()) {
        return value
      } else {
        this.remove(key)
      }
      return null
    } catch {
      return def
    }
  }

  set(key: string, value: any, timeout: number | null = this.timeout) {
    const fullKey = this.getKey(key)

    const cache = JSON.stringify({
      value,
      expire: !isNull(timeout) ? new Date().getTime() + timeout * 1000 : null
    })

    this.storage.setItem(fullKey, cache)
    this.setScope(fullKey, false)
  }

  private getScope(): string[] {
    const str = this.storage.getItem(this.scope)

    // The scope does not exist
    if (isNull(str)) return this.createScope()

    try {
      const list = JSON.parse(str)

      return isArray(list) ? (list as string[]) : this.createScope()
    } catch {
      return this.createScope()
    }
  }

  private setScope(key: string, remove: boolean = false) {
    const keyList = this.getScope()
    const index = keyList.indexOf(key)

    if ((index === -1 && remove) || (index !== -1 && !remove)) return

    if (remove) {
      keyList.splice(index, 1)
      this.storage.setItem(this.scope, JSON.stringify(keyList))
    } else {
      this.storage.setItem(this.scope, JSON.stringify([...new Set([...keyList, key])]))
    }
  }

  private resetScope() {
    const keyList = this.getScope()

    keyList.forEach((key) => this.storage.removeItem(key))
    keyList.length !== 0 && this.createScope()
  }

  private createScope() {
    const scope = []
    this.storage.setItem(this.scope, JSON.stringify(scope))
    return scope
  }

  remove(key: string) {
    const fullKey = this.getKey(key)

    this.storage.removeItem(fullKey)
    this.setScope(fullKey, true)
  }

  clear() {
    this.resetScope()
  }
}
