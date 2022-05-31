import { getParsedJwtBody } from '@/utils/jwt'
import store from '@/store'

/**
 * 로그인한 사용자가 첫페이지가 어디로 가야하는지 확인
 * 주의 - (해당)첫페이지로 가려는데 권한이 없는경우 404 페이지로 이동할 수 있음.
 * @returns {string} return url
 */
export function getUserFirstUrl() {
  try {
    let tokenBody = getParsedJwtBody(store.state.user.token)
    return '/'
  } catch (e) {
    console.error(e)
    return '/'
  }
}
