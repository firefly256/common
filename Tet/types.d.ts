import type Interceptor from './Interceptor'
// Interceptor
export type RequestHandler = (init: RequestInit) => RequestInit

export type ResponseHandler = (response: Response) => Response

export type Handler = RequestHandler | ResponseHandler

export type FulfilledFn = Handler

export type RejectedFn = ((error: any) => Promise<any>) | null

export type RunWhen = ((init: RequestInit) => boolean) | null

export interface InterceptorHandlers<T extends Handler> {
  fulfilled: T
  rejected: RejectedFn
  runWhen: RunWhen
}

export interface Interceptors {
  request: Interceptor<RequestHandler>
  response: Interceptor<ResponseHandler>
}

// Tet
export interface TetOptions {
  baseUrl?: string
  timeout?: number
}

export type TetParams = Record<string | number, string | number>
export interface TetRequestInit extends Omit<RequestInit, 'body' | 'signal'> {
  params?: TetParams
  data?: Blob | BufferSource | FormData | Record<any, any>
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
}
