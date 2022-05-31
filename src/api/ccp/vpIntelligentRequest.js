import { intelligent } from '@/envs'
import requestApi from '@/api/ccp/requestApi'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'

export function getToken() {
  return new Promise((resolve, reject) => {
    let token = getCookie(intelligent.accessTokenKey)
    if (token) {
      resolve(token)
      return
    }

    requestApi({
      url: '/online/vpcom/intelligent/login',
      headers: { 'X-MID': 'P00000' },
      method: 'post',
      data: {},
      callback: res => {
        if (res.result.status === '200') {
          debugger
          setCookie(intelligent.accessTokenKey, res.data.Response.PublicKey)
          resolve()
        } else {
          // eslint-disable-next-line
          reject()
        }
      }
    })
  })
}

export function vpIntelligentRequest(requestObj, options) {
  return new Promise((resolve, reject) => {
    getToken()
      .then(() => {
        requestApi({
          url: requestObj.url,
          headers: Object.assign({}, requestObj.headers, {
            'X-VP-INTELLIGENT-TOKEN': getCookie(intelligent.accessTokenKey)
          }),
          method: requestObj.method,
          data: requestObj.data,
          callback: res => {
            if (res.result.status === '200') {
              resolve(res)
            } else {
              if (res.data.code === 'A002') {
                refreshTokenRetry(requestObj, options)
                  .then(res => {
                    resolve(res)
                  })
                  .catch(e => {
                    throw e
                  })
              } else {
                reject(res)
              }
            }
          }
        })
      })
      .catch(e => {
        reject(e)
      })
  })
}

function refreshTokenRetry(requestObj, options) {
  return new Promise((resolve, reject) => {
    removeCookie(intelligent.accessTokenKey)
    getToken()
      .then(() => {
        requestApi(
          {
            url: requestObj.url,
            headers: Object.assign({}, requestObj.headers, {
              'X-VP-INTELLIGENT-TOKEN': getCookie(intelligent.accessTokenKey)
            }),
            method: requestObj.method,
            data: requestObj.data,
            callback: res => {
              if (res.result.status === '200') {
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
