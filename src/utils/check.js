/**
 * 점검 로직이 필요할 경우 이곳에 정리
 */
import envs from '@/envs'

export function isMobile () {
  var mobileArr = ['iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson']

  for (var txt in mobileArr) {
    if (navigator.userAgent.match(mobileArr[txt]) != null) {
      return true
    }
  }

  return false
}

export function isUseAPI () {
  // local 개발 환경 flag
  var isLocal = process.env.NODE_ENV === 'development'

  if (envs.framework.onlyMockup) return false

  return !isLocal || envs.framework.useRestful
}

// 아이디 검사를 위한 정규식
// 4-12자의 영문 대소문자 숫자 로만 입력 가능
export function isUserId (userId) {
  var regId = /^[a-zA-Z0-9]{4,12}$/

  if (regId.test(userId)) {
    return true
  }

  return false
}

// 비밀번호 검사를 위한 정규식
// 8~20자의 영문 대소문자와 숫자 로만 입력 가능
export function isPw (pw) {
  var regPw = /^[a-zA-Z0-9]{8,20}$/

  if (regPw.test(pw)) {
    return true
  }

  return false
}

// email 검사를 위한 정규식
export function isEmail (email) {
  var regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

  if (regEmail.test(email)) {
    return true
  }

  return false
}

// 휴대폰번호 검사를 위한 정규식
export function isPhoneNumber (phoneNumber) {
  var regPhoneNumber = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/

  if (regPhoneNumber.test(phoneNumber)) {
    return true
  }

  return false
}

/**
 * 숫자로 이루어진 값인지 체크
 * @param value
 * @returns {boolean} 값이 숫자로만 이루어진 경우에 true, 그렇지 않으면 false
 */
export function isNumber (value) {
  return /^[0-9]*$/g.test(value)
}

/**
 * 숫자/영문/하이픈(-)/언더스코어(_) 값인지 체크
 * @param value
 * @returns {boolean} 값이 숫자/영문/하이픈(-)/언더스코어(_)로만 이루어져 있으면 true, 그렇지 않으면 false
 */
export function isAlphaHyphenUnderscore (value) {
  return /^[0-9a-zA-Z_-]*$/g.test(value)
}

/**
 * 값에 한글이 있는지 여부를 체크
 * @param value
 * @returns {boolean} 한글이 포함되어 있으면 true, 한글이 없으면 false
 */
export function isIncludeKorean (value) {
  return !/^[^ㄱ-ㅎㅏ-ㅣ가-힝]*$/g.test(value)
}
