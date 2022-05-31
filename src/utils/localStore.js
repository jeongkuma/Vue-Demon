/**
 * localstorage에 값을 저장하는 util
 */

export default {
  get: key => {
    return localStorage.getItem(key)
  },
  set: (key, stringData) => {
    if (typeof stringData !== 'string') {
      console.error(
        'localStore [error]:',
        'string Data is not string. only string.'
      )
    } else {
      localStorage.setItem(key, stringData)
    }
  },
  remove: key => {
    localStorage.removeItem(key)
  },
  getObject: (key, objectKey) => {
    let jsonString = localStorage.getItem(key)
    if (!jsonString) {
      return undefined
    }
    let jsonObject = JSON.parse(jsonString)
    return jsonObject[objectKey]
  },
  setObject: (key, objectKey, objectValue) => {
    let jsonString = localStorage.getItem(key)
    let jsonObject = jsonString ? JSON.parse(jsonString) : {}
    jsonObject[objectKey] = objectValue
    localStorage.setItem(key, JSON.stringify(jsonObject))
  },
  removeObject: (key, objectKey) => {
    let jsonString = localStorage.getItem(key)
    if (!jsonString) {
      return
    }
    let jsonObject = JSON.parse(jsonString)
    delete jsonObject[objectKey]
    localStorage.setItem(key, JSON.stringify(jsonObject))
  }
}
