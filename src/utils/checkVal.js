export function check (input) {
  // var result = true
  // if (!input || input.length < 0 || input.trim.length < 0) {
  //   result = false
  // }
  // return result
  var blankPattern = /^\s+|\s+$/g
  if (!input || input === undefined || input === null) {
    return false
  } else {
    if (input.replace(blankPattern, '') === '') {
      return false
    } else {
      return true
    }
  }
}

export function checkPhone (num) {
  var passRule = /^[0-9]*$/
  return passRule.test(num)
}

export function checkAuthNo (num) {
  var passRule = /^[0-9]*$/
  return passRule.test(num)
}

export function checkChar (char) {
  return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(char)
}
