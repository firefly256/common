import { isObject, isArray } from './is'

/**
 * Deep clone function
 */
export const deepClone = <T>(target: any, map = new Map()): T => {
  if (!isObject(target) && !isArray(target)) return target

  if (map.get(target)) return map.get(target)

  let cloned: any = isArray(target) ? [] : {}

  map.set(target, cloned)

  const keys = Reflect.ownKeys(target as any)
  for (const key of keys) {
    cloned[key] = deepClone((target as any)[key], map)
  }

  return cloned
}
/**
 * Clone function, default shadow clone
 */
export const clone = <T>(target: any, deep = false): T => {
  if (deep) {
    return deepClone<T>(target)
  } else {
    return JSON.parse(JSON.stringify(target))
  }
}
