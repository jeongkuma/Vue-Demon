/**
 * 리스트 내 json string(object) 형식의 데이터 오브젝트를
 * 파싱하여 리스트 항목으로 세팅한다.
 * @param {*} list
 * @param {*} key
 * [{ dataObj: "{\"key\": \"value\"}" }]
 * -> [{ key: value }]
 */
export function getDataObjOfList(list, key) {
  list.forEach(row => {
    let dataObj = JSON.parse(row[key])
    Object.assign(row, dataObj)
  })
  return list
}

/**
 * 리스트 내 json string(array) 형식의 데이터 오브젝트를
 * 파싱하여 리스트 항목으로 세팅한다.
 * @param {*} list
 * @param {*} key
 * @param {*} itemKey
 * @param {*} itemValueKey
 */
export function getDataObjListOfList(list, key, itemKey, itemValueKey) {
  list.forEach(row => {
    let dataArray = JSON.parse(row[key])
    let dataObj = {}
    dataArray.forEach(o => {
      dataObj[o[itemKey]] = o[itemValueKey]
    })
    Object.assign(row, dataObj)
  })
  return list
}

/**
 * 특수문자 없는지 확인
 * @param {*} value
 */
export function checkKoEnNumber(value) {
  if (!value || value === '') {
    return false
  }
  return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(value)
}

/**
 * 영문 + 숫자 확인
 * @param {*} value
 */
export function checkEnNumber(value) {
  if (!value || value === '') {
    return false
  }
  return /^[a-zA-Z0-9_-]*$/.test(value)
}

/**
 * 한글 확인
 * @param {*} value
 */
export function checkOnlyKo(value) {
  if (!value || value === '') {
    return false
  }
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value)
}

/**
 * 전화번호 확인
 * @param {*} value
 */
export function checkTelNoWithoutDash(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9]{9,11}$/.test(value)
}

/**
 * 숫자만 있는지 확인
 * @param {*} value
 */
export function checkOnlyNum(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9]*$/.test(value)
}

/**
 * 이메일 형식 확인
 * @param {*} value
 */
export function checkEmail(value) {
  if (!value || value === '') {
    return false
  }
  return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,4}/i.test(
    value
  )
}
