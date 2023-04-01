import type { TetRequestInit } from './types'
import { isObject } from '../is'

const setTetBody = (init: TetRequestInit) => {
  const newInit: RequestInit = init

  newInit.body = isObject(init.data) ? JSON.stringify(init.data) : init.data

  return newInit
}
