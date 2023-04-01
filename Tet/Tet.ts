import type {
  Interceptors,
  TetOptions,
  TetRequestInit,
  RejectedFn,
  RequestHandler,
  ResponseHandler
} from './types'
import Interceptor from './Interceptor'
import { formatInput } from './helper'

export default class Tet {
  private interceptors: Interceptors
  private options: TetOptions

  constructor(options: TetOptions = { baseUrl: '', timeout: 1000 * 10 }) {
    this.interceptors = { request: new Interceptor(), response: new Interceptor() }
    this.options = options
  }

  request(input: string, init: TetRequestInit) {
    let newInit: RequestInit = { ...init }
    let newInput: string = formatInput(input, {
      baseUrl: this.options.baseUrl,
      params: init.params
    })

    const requestInterceptorChain: (RequestHandler | RejectedFn)[] = []
    this.interceptors.request.forEach((interceptor) => {
      if (interceptor === null) return

      if (interceptor.runWhen !== null && !interceptor.runWhen(newInit)) return

      requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })

    const responseInterceptorChain: (ResponseHandler | RejectedFn)[] = []
    this.interceptors.response.forEach((interceptor) => {
      if (interceptor === null) return

      if (interceptor.runWhen !== null && !interceptor.runWhen(newInit)) return

      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })

    let index = 0
    let length = requestInterceptorChain.length

    while (index < length) {
      const onFulfilled = requestInterceptorChain[index++] as RequestHandler
      const onRejected = requestInterceptorChain[index++] as RejectedFn
      try {
        newInit = onFulfilled(newInit)
      } catch (error) {
        onRejected && onRejected(error)
        break
      }
    }

    let promise = fetch(newInput, newInit)

    index = 0
    length = responseInterceptorChain.length
    while (index < length) {
      promise = promise.then(responseInterceptorChain[index++], responseInterceptorChain[index++])
    }

    return promise
  }

  get(input: string, init: TetRequestInit) {
    return this.request(input, { ...init, method: 'GET' })
  }

  post(input: string, init: TetRequestInit) {
    return this.request(input, { ...init, method: 'POST' })
  }

  put(input: string, init: TetRequestInit) {
    return this.request(input, { ...init, method: 'PUT' })
  }

  delete(input: string, init: TetRequestInit) {
    return this.request(input, { ...init, method: 'DELETE' })
  }
}
