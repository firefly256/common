import type {
  Interceptors,
  TetOptions,
  TetRequestInit,
  RejectedFn,
  RequestHandler,
  ResponseHandler,
  RequestInitExtend
} from './types'
import Interceptor from './Interceptor'
import { isURL } from '../regMap'

export default class Tet {
  private interceptors: Interceptors
  private options: TetOptions

  constructor(options?: Partial<TetOptions>) {
    this.interceptors = { request: new Interceptor(), response: new Interceptor() }
    this.options = {
      baseURL: isURL(options?.baseURL!) ? options?.baseURL : undefined,
      timeout: options?.timeout ?? 1000 * 10
    }
  }

  request<T = any>(input: string, init: TetRequestInit): T {
    // AbortController
    const controller = new AbortController()
    // Generate new init
    let newInit: RequestInitExtend = {
      ...init,
      signal: controller.signal,
      url: input,
      timeout: init.timeout ?? this.options.timeout,
      baseURL: this.options.baseURL
    }
    // Generate request interceptor chain
    const requestInterceptorChain: (RequestHandler | RejectedFn)[] = []
    this.interceptors.request.forEach((interceptor) => {
      if (interceptor === null) return

      if (interceptor.runWhen !== null && !interceptor.runWhen(newInit)) return

      requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })
    // Generate response interceptor chain
    const responseInterceptorChain: (ResponseHandler | RejectedFn)[] = []
    this.interceptors.response.forEach((interceptor) => {
      if (interceptor === null) return

      if (interceptor.runWhen !== null && !interceptor.runWhen(newInit)) return

      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })
    // Transform request
    if (init.data && init.transformRequest) {
      for (let callbackFn of init.transformRequest) {
        init.data = callbackFn(init.data, init.headers)
      }
    }

    let index = 0
    let length = requestInterceptorChain.length
    // Request interceptor
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
    // Request timeout
    if (newInit.timeout && newInit.timeout > 0) {
      setTimeout(() => controller.abort(), newInit.timeout)
    }

    let promise: any = fetch(newInit.url, newInit)

    index = 0
    length = responseInterceptorChain.length
    // Response interceptor
    while (index < length) {
      promise = promise.then(responseInterceptorChain[index++], responseInterceptorChain[index++])
    }

    // Transform response
    promise = promise.then((response) => {
      let $response = response
      if (init.transformResponse) {
        for (let callbackFn of init.transformResponse) {
          $response = callbackFn($response)
        }
      }
      return $response
    })

    Reflect.defineProperty(Reflect.getPrototypeOf(promise)!, 'cancel', {
      value: () => controller.abort()
    })

    return promise
  }

  get<T = any>(input: string, init: Omit<TetRequestInit, 'method'>) {
    return this.request<T>(input, { ...init, method: 'GET' })
  }

  post<T = any>(input: string, init: Omit<TetRequestInit, 'method'>) {
    return this.request<T>(input, { ...init, method: 'POST' })
  }

  put<T = any>(input: string, init: Omit<TetRequestInit, 'method'>) {
    return this.request<T>(input, { ...init, method: 'PUT' })
  }

  delete<T = any>(input: string, init: Omit<TetRequestInit, 'method'>) {
    return this.request<T>(input, { ...init, method: 'DELETE' })
  }
}
