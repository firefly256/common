import type Interceptor from './Interceptor'

export type InterceptorHandler<T extends Function> = T | null

export interface Interceptors {
  request: Interceptor<(config: any) => any>
  response: Interceptor<(response: any) => void>
}

export interface TetOptions {}

export interface TetRequestInit extends Omit<RequestInit, 'body'> {
  params?: Record<string | number, string | number>
  data?: any
}
