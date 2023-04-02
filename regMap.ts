const http = /^https?:\/\//
// prettier-ignore
const url = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/

export const startWithHttp = (target: string) => http.test(target)

export const isURL = (target: string) => url.test(target)

export default {
  http,
  url
}
