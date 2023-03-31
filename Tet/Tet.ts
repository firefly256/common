import type { Interceptors, TetOptions } from './types'
import Interceptor from './Interceptor'

export default class Tet {
  private interceptors: Interceptors
  private options: TetOptions

  constructor(options: TetOptions) {
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    }
    this.options = options
  }

  request(input: string, init: RequestInit) {}

  get(input: string, init: RequestInit) {}

  post(input: string, init: RequestInit) {}

  put(input: string, init: RequestInit) {}

  delete(input: string, init: RequestInit) {}
}
