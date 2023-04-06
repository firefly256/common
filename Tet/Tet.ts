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

export default class Tet {
  private interceptors: Interceptors
  private options: TetOptions

  constructor(options?: Partial<TetOptions>) {
    this.interceptors = { request: new Interceptor(), response: new Interceptor() }
    this.options = {
      baseURL: options?.baseURL,
      timeout: options?.timeout ?? 1000 * 10
    }
  }

  request<T = any>(input: string, init: TetRequestInit): Promise<T> {
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
    if (newInit.data && newInit.transformRequest) {
      for (let callbackFn of newInit.transformRequest) {
        newInit.data = callbackFn(newInit.data, newInit.headers)
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
      if (newInit.transformResponse) {
        for (let callbackFn of newInit.transformResponse) {
          $response = callbackFn($response)
        }
      }
      return $response
    })

    const prototype = Reflect.getPrototypeOf(promise)
    if (prototype) {
      Reflect.defineProperty(prototype, 'abort', { value: () => controller.abort() })
    }

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
