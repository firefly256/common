import type { RequestHandler, ResponseHandler } from './types'
import { isObject } from '../is'
import { startWithHttp } from '../regMap'
import qs from 'qs'

export const setBody: RequestHandler = (init) => {
  if (init.data) {
    init.body = isObject(init.data) ? JSON.stringify(init.data) : init.data
  }

  if (!init.method || init.method === 'GET') {
    delete init.body
  }

  return init
}

export const perfectURL: RequestHandler = (init) => {
  const { params, baseURL, url } = init
  if (params) {
    init.url = `${url}${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`
  }

  if (!startWithHttp(url) && baseURL) {
    init.url = baseURL + url
  }

  return init
}

export const requestInterceptors: RequestHandler[] = [perfectURL, setBody]

export const responseInterceptors: ResponseHandler[] = []
