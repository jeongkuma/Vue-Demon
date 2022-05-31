import base64url from 'base64url'

/**
 * JWT 토큰값을 받아서 JSON Object 형식의 Body를 반환한다.
 * @param token
 * @returns {{}|any}
 */
export function getParsedJwtBody(token) {
  if (token) {
    try {
      let tokenBody = token.split('.')[1]
      let tokenBodyJson = JSON.parse(base64url.decode(tokenBody))
      return tokenBodyJson
    } catch (e) {
      console.error(e)
      return {}
    }
  } else {
    return {}
  }
}
