import type { InterceptorHandlers, Handler, RejectedFn, RunWhen } from './types'

export default class Interceptor<T extends Handler> {
  private handlers: (InterceptorHandlers<T> | null)[]

  constructor() {
    this.handlers = []
  }

  use(fulfilled: T, rejected: RejectedFn = null, runWhen: RunWhen = null) {
    return this.handlers.push({ fulfilled, rejected, runWhen }) - 1
  }

  eject(index: number) {
    if (this.handlers[index] !== null) {
      this.handlers[index] = null
    }
  }

  clear() {
    if (this.handlers) this.handlers = []
  }

  forEach(callbackFn: (value: InterceptorHandlers<T>, index: number, array: (T | null)[]) => void) {
    this.handlers.forEach((handler, index, array) => {
      if (handler === null) return
      callbackFn.call(null, handler, index, array as any)
    })
  }
}
