import type Interceptor from './Interceptor'
// Interceptor
export type RequestHandler = (init: RequestInitExtend) => RequestInitExtend

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
  baseURL?: string
  timeout: number
}
export type TetParams = Record<string | number, string | number>

export type TetData = Blob | BufferSource | FormData | Record<any, any>

export type TransformRequestHandler = (
  data: TetData,
  headers: ResponseInit['headers']
) => TetRequestInit

export type TransformResponseHandler = (data: any) => any

export interface RequestInitExtend extends RequestInit {
  params?: TetParams
  data?: TetData
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
  timeout?: number
  url: string
  baseURL?: string
  signal: AbortSignal
  transformRequest?: TransformRequestHandler[]
  transformResponse?: TransformResponseHandler[]
}

export type TetRequestInit = Omit<RequestInitExtend, 'body' | 'signal' | 'url' | 'baseURL'>
