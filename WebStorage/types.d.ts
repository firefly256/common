export interface WebStorageOptions {
  prefixKey?: string
  timeout?: number
  scope?: string
  [key: string]: any
}

export interface CacheRecord {
  value: any
  expire: number | null
}
