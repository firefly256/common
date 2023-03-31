/**
 * Console site info
 */
export const Nya = (infoList: Record<'label' | 'color' | 'href', string>[]) => {
  const getStyle = (color = '#DB493C') => {
    return `line-height:22px;color:#FFF;background:${color};border-radius:3px;`
  }
  console.info(`%c firefly256 %c`, getStyle(), '', 'https://github.com/firefly256')
  infoList.forEach((each) => {
    console.info(`%c ${each.label.toUpperCase()} %c`, getStyle(each.color), '', each.href)
  })
  console.info('~❀~ 发现控制台报错请务必联系博主 ~❀~')
}
/**
 * Noop function
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
/**
 * Throttle Function
 */
export function useThrottleFn<T extends AnyFn>(
  fn: T,
  ms: number = 1000,
  trailing = false,
  leading = true,
  rejectOnCancel = false
): PromisifyFn<T> {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let isLeading = true
  let lastRejector = noop
  let lastValue: any

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
      lastRejector()
      lastRejector = noop
    }
  }

  return function (this: any, ...rest: any) {
    const elapsed = Date.now() - lastExec
    const duration = ms

    clear()

    if (duration <= 0) {
      lastExec = Date.now()
      lastValue = fn.apply(this, rest)
    } else if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now()
      lastValue = fn.apply(this, rest)
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          lastExec = Date.now()
          resolve(fn.apply(this, rest))
          clear()
        }, Math.max(0, duration - elapsed))
      })
    }

    if (!leading && !timer) timer = setTimeout(() => (isLeading = true), duration)

    isLeading = false
    return Promise.resolve(lastValue)
  }
}
/**
 * Debounce Function
 */
export function useDebounceFn<T extends AnyFn>(fn: T, ms: number = 1000, rejectOnCancel = false) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastRejector = noop

  return function (this: any, ...rest: any) {
    const duration = ms

    if (timer) {
      clearTimeout(timer)
      lastRejector()
      lastRejector = noop
    }

    if (duration <= 0) {
      return Promise.resolve(fn.apply(this, rest))
    } else {
      return new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          resolve(fn.apply(this, rest))
          timer = null
        }, duration)
      })
    }
  }
}
