import type { InterceptorHandler } from './types'
import { isFunction, isNumber } from '../is'

export default class Interceptor<T extends Function> {
  private handlers: InterceptorHandler<T>[]

  constructor() {
    this.handlers = []
  }

  use(callbackFn: T) {
    return this.handlers.push(callbackFn) - 1
  }

  eject(target: number | T) {
    if (isNumber(target) && isFunction(this.handlers[target])) {
      this.handlers[target] = null
    } else {
      const index = this.handlers.indexOf(target as T)
      if (index !== -1) this.handlers[index] = null
    }
  }

  clear() {
    if (this.handlers) this.handlers = []
  }

  forEach(callbackFn: (value: T, index: number, array: (T | null)[]) => void) {
    this.handlers.forEach((handler, index, array) => {
      if (handler === null) return
      callbackFn.call(null, handler, index, array)
    })
  }
}
