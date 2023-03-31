// prettier-ignore
type TypeList = 'Undefined' | 'Null'| 'Object' | 'Function' | 'Array'| 'String' | 'Number' | 'Boolean' | 'AsyncFunction' | 'FormData' | 'ArrayBuffer' | 'Blob'

export const is = (target: any, type: TypeList) => {
  return Object.prototype.toString.call(target) === `[object ${type}]`
}

export const isString = (target: any): target is string => typeof target === 'string'

export const isNumber = (target: any): target is number => typeof target === 'number'

export const isBoolean = (target: any): target is boolean => typeof target === 'boolean'

export const isObject = <T>(target: any): target is T => is(target, 'Object')

export const isArray = <T>(target: any): target is T => is(target, 'Array')

export const isFunction = <T>(target: any): target is T => typeof target === 'function'

export const isUndefined = (target: any): target is undefined => typeof target === 'undefined'

export const isNull = (target: any): target is null => is(target, 'Null')

export const isNullOrUndef = (target: any): target is null | undefined => {
  return is(target, 'Undefined') || is(target, 'Null')
}
