import { realtime } from '@/envs'
import requestApi from '@/api/ccp/requestApi'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'

export function getToken() {
  return new Promise(resolve => {
    let token = getCookie(realtime.accessTokenKey)

    if (token) {
      resolve(token)
      return
    }
    requestApi({
      url: '/online/vpcom/realtime/login',
      headers: { 'X-MID': 'P00000' },
      method: 'post',
      data: {},
      callback: res => {
        if (
          res.result.status === '200' &&
          res.data &&
          res.data.auth &&
          res.data.auth.access_token
        ) {
          // refreshToken은 사용하지 않을 예정이지만 저장함
          setCookie(realtime.accessTokenKey, res.data.auth.access_token)
          setCookie(realtime.refreshTokenKey, res.data.auth.refresh_token)

          resolve(realtime.accessTokenKey, res.data.auth.access_token)
        } else {
          console.error('[RealtimeVideo] fail to login', res)
        }
      }
    })
  })
}

export function vpRealtimeRequest(requestObj, options) {
  return new Promise((resolve, reject) => {
    getToken()
      .then(() => {
        requestApi(
          {
            url: requestObj.url,
            headers: Object.assign({}, requestObj.headers, {
              'X-VP-REALTIME-TOKEN': getCookie(realtime.accessTokenKey)
            }),
            method: requestObj.method,
            data: requestObj.data,
            callback: res => {
              if (res.result.status === '200') {
                // 잘못된 인증정보
                if (res.data.code === 'A002') {
                  refreshTokenRetry(requestObj, options)
                    .then(res => {
                      resolve(res)
                    })
                    .catch(e => {
                      throw e
                    })
                } else {
                  resolve(res)
                }
              } else {
                reject(res)
              }
            }
          },
          options
        )
      })
      .catch(e => {
        reject(e)
      })
  })
}

function refreshTokenRetry(requestObj, options) {
  return new Promise((resolve, reject) => {
    removeCookie(realtime.accessTokenKey)
    removeCookie(realtime.refreshTokenKey)
    getToken()
      .then(() => {
        requestApi(
          {
            url: requestObj.url,
            headers: Object.assign({}, requestObj.headers, {
              'X-VP-REALTIME-TOKEN': getCookie(realtime.accessTokenKey)
            }),
            method: requestObj.method,
            data: requestObj.data,
            callback: res => {
              if (res.result.status === '200') {
                if (res.data.code === 'A002') {
                  throw res
                }
                resolve(res)
              } else {
                reject(res)
              }
            }
          },
          options
        )
      })
      .catch(e => {
        reject(e)
      })
  })
}
