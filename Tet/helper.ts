import type { TetParams } from './types'
import { startWithHttp } from '../regMap'
import qs from 'qs'

interface Options {
  baseUrl?: string
  params?: TetParams
}

export const formatInput = (input: string, { baseUrl, params }) => {
  if (params) {
    input = `${input}${input.includes('?') ? '&' : '?'}${qs.stringify(params)}`
  }

  if (!startWithHttp(input) && baseUrl) {
    input = baseUrl + input
  }

  return input
}
