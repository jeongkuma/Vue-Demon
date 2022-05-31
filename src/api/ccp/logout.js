import requestApi from '@/api/ccp/requestApi'
import {
  getToken,
  removeCustId,
  removeToken,
  removeUserId,
  removeUserName,
  removeCookie
} from '@/utils/cookie'
import localStore from '@/utils/localStore'
import store from '@/store'
import moment from 'moment'
import { getParsedJwtBody } from '@/utils/jwt'
import { realtime, intelligent } from '@/envs'

export default function() {
  if (isTokenExpired()) {
    logoutProcess()
  } else {
    var reqData = {}
    requestApi({
      url: '/online/iotlogout/processIotLogout',
      headers: {
        'X-MID': 'P00088'
      },
      method: 'post',
      data: reqData,
      callback: res => {
        if (
          !res.result.status || // Status Code가 없는경우 (크로스도메인 이슈)
          res.result.status === '200' || // 정상
          res.result.status === '503' || // Service Unavailable
          res.result.status === '401' ||
          res.result.status === '402'
        ) {
          // 권한없음 (토큰 만료된경우 - 브라우저 다른탭에서 로그아웃함)
          logoutProcess()
        }
      }
    })
  }
}

function logoutProcess() {
  localStore.remove('menu_' + getToken())
  removeToken()
  removeCustId()
  removeUserId()
  removeUserName()
  removeCookie(realtime.accessTokenKey)
  removeCookie(realtime.refreshTokenKey)
  removeCookie(intelligent.accessTokenKey)
  removeCookie(intelligent.refreshTokenKey)
  location.href = ''
}

function isTokenExpired() {
  let tokenBody = getParsedJwtBody(store.state.user.token)
  if (tokenBody.exp) {
    return moment().isAfter(moment(tokenBody.exp * 1000))
  } else {
    return false
  }
}
