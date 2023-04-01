const http = /^https?:\/\//

export const startWithHttp = (target: string) => http.test(target)

export default {
  http
}
