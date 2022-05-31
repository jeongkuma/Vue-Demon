import request from '@/utils/request'
import store from '@/store'
import Cookies from 'js-cookie'

/**
 * 일반 서버호출 API
 * 크로스도메인이슈 발생 시 서버의 Controller에 아래의 애노테이션이 있어야 함.
 * '@CrossOrigin()'
 * @param {*} requestObj - {
        url: '/online/iotcust/retrieveIotCust', // required
        headers: { // required
          'X-MID': 'dashboard' // required (menu_id)
        },
        // callback 함수 정의 시 화살표 함수를 사용해야 this 객체 사용가능함.
        callback: (data) => { // required
          console.log('data: ', data)
        },
        method: 'post', // optional (default: post)
        data: { // optional
          currentPage: 2,
          displayRowCount: 10
        }
      }
 */
const DEFAULT_OPTION = {
  useLoading: true
}
export function requestApi(requestObj, option) {
  // 헤더의 X-LANG을 로그인했을 때 선택했던 언어셋으로 설정
  store.dispatch('SetCommonHeader', { xLang: Cookies.get('LOCALE') })
  option = Object.assign(_getDefaultOptions(), option)

  let reqHeaders = _.cloneDeep(store.state.api.common)
  _.merge(reqHeaders, requestObj.headers) // 요청 시 설정한 헤더 override
  _.merge(reqHeaders, { 'X-LOGKEY': getLogKey() }) // logkey override
  if (
    store.state.api.common['X-AUTH'] &&
    store.state.api.common['X-AUTH'].length > 0
  ) {
    _.merge(reqHeaders, { 'X-AUTH': store.state.api.common['X-AUTH'] }) // auth override
  }
  if (option.useLoading) {
    store.dispatch('RequestApi')
  }
  return request({
    url: requestObj.url,
    headers: reqHeaders,
    callback: requestObj.callback,
    method: requestObj.method || 'post',
    data: requestObj.data || null
  })
    .then(res => {
      try {
        requestObj.callback(res.data)
      } catch (e) {
        console.error(e)
      }
    })
    .catch(res => {
      requestObj.callback(res.response.data)
    })
    .finally(() => {
      if (option.useLoading) {
        store.dispatch('ResponseApi')
      }
    })
}

/**
 * 파일 다운로드 서버호출 API
 * 크로스도메인이슈 발생 시 서버의 Controller에 아래의 애노테이션이 있어야 함.
 * '@CrossOrigin(value = {"*"}, exposedHeaders = {"Content-Disposition"})'
 * @param {*} requestObj - {
        url: 'http://192.168.0.152:8090/ccp/online/IotlibraryBoard/downloadFile', // required
        headers: { // required
          'X-MID': 'dashboard' // required (menu_id)
        },
        // callback 함수 정의 시 화살표 함수를 사용해야 this 객체 사용가능함.
        callback: (data) => { // required
          console.log('data: ', data)
        },
        data: { // optional
          'fileListSeq': 38
        }
      }
 */
export function requestDownloadApi(requestObj) {
  // 헤더의 X-LANG을 로그인했을 때 선택했던 언어셋으로 설정
  store.dispatch('SetCommonHeader', { xLang: Cookies.get('LOCALE') })

  let reqHeaders = _.cloneDeep(store.state.api.common)
  _.merge(reqHeaders, requestObj.headers) // 요청 시 설정한 헤더 override
  _.merge(reqHeaders, { 'X-LOGKEY': getLogKey() }) // logkey override
  store.dispatch('RequestApi')
  return request({
    url: requestObj.url,
    headers: reqHeaders,
    responseType: 'arraybuffer',
    method: 'post',
    data: requestObj.data || null
  })
    .then(res => {
      try {
        let blob = new Blob([res.data], { type: res.headers['content-type'] })
        let fileName = getFileName(res.headers['content-disposition'])
        fileName = decodeURI(fileName)

        if (window.navigator.msSaveOrOpenBlob) {
          // IE 10+
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          // not IE
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.target = '_self'
          if (fileName) link.download = fileName
          link.click()
        }

        requestObj.callback(res.data)
      } catch (e) {
        console.error(e)
      }
    })
    .catch(res => {
      requestObj.callback(res.response.data)
    })
    .finally(() => {
      store.dispatch('ResponseApi')
    })
}

/**
 * File Upload (Multipart)
 * 서버와의 테스트를 수행하지 않아 서버에 어떤 애노테이션이 추가로 붙어야 하는지 모름.
 * @param {*} requestObj - {
        url: '/file-upload-url', // required
        headers: { // required
          'X-MID': 'dashboard' // required (menu_id)
        },
        // callback 함수 정의 시 화살표 함수를 사용해야 this 객체 사용가능함.
        callback: (data) => { // required
          console.log('data: ', data)
          this.$refs.resData3.innerHTML = JSON.stringify(data)
        },
        data: { // optional
          'dummyKey': 'dummyValue'
        },
        // optional
        // 해당 input(file) Element 에 파일이 선택되지 않으면
        // 알아서 거르고 선택된 파일만 올라간다.
        files: getRequestFileArray([
          this.$refs.file1, // <input ref="file1" type="file" />
          this.$refs.file2
        ])
      }
 */
export function requestMultipartJsonObject(requestObj) {
  let reqHeaders = _.cloneDeep(store.state.api.common)
  _.merge(reqHeaders, requestObj.headers) // 요청 시 설정한 헤더 override
  _.merge(reqHeaders, { 'X-LOGKEY': getLogKey() }) // logkey override
  _.merge(reqHeaders, { enctype: 'multipart/form-data' }) // 헤더에 multipart 추가

  const formData = new FormData()

  // data JsonObject 처리
  formData.append('jsonData', JSON.stringify(requestObj.data))

  // files 처리
  if (requestObj.files) {
    requestObj.files
      .filter(file => file.name && file.file)
      .forEach((file, index) =>
        formData.append(appendString2FileName(file.name, index), file.file)
      )
  }

  store.dispatch('RequestApi')
  return request({
    url: requestObj.url,
    headers: reqHeaders,
    method: 'post',
    data: formData
  })
    .then(res => {
      try {
        requestObj.callback(res.data)
      } catch (e) {
        console.error(e)
      }
    })
    .catch(res => {
      requestObj.callback(res.response.data)
    })
    .finally(() => {
      store.dispatch('ResponseApi')
    })
}

function getFileName(contentDisposition) {
  let fileName = contentDisposition
    .split(';')
    .filter(ele => {
      return ele.indexOf('fileName') > -1
    })
    .map(ele => {
      return ele.replace(/"/g, '').split('=')[1]
    })
  return fileName[0] ? fileName[0] : null
}

/**
 * 파일을 여러개 올릴 때 서버에서 name이 같으면 한개만 받는다고 한다. (acfw-1.0.0.jar)
 * 그래서 서버에 파일을 올릴 때 이름뒤에 인덱스 번호를 붙여서 업로드 한다.
 * @param fileName
 * @param str
 * @returns new_fileName
 */
function appendString2FileName(fileName, str) {
  if (str === undefined) {
    return fileName
  }
  let [name, ...extensions] = fileName.split('.')
  let newName = name
  let isLast = false
  extensions.forEach((extension, index, array) => {
    isLast = index === array.length - 1
    newName += isLast ? `_${str}.${extension}` : `.${extension}`
  })
  return newName + (extensions.length === 0 ? `_${str}` : '')
}

function getLogKey() {
  let dateObj = new Date()
  let logKey =
    '' +
    dateObj.getFullYear() +
    (dateObj.getMonth().length === 2
      ? dateObj.getMonth() + 1
      : '0' + (dateObj.getMonth() + 1)) +
    (dateObj.getDate().length === 2
      ? dateObj.getDate()
      : '0' + dateObj.getDate()) +
    dateObj.getHours() +
    dateObj.getMinutes() +
    dateObj.getSeconds() +
    dateObj.getMilliseconds() +
    getRandomValue() +
    getRandomValue()

  return logKey
}
function getRandomValue() {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
function _getDefaultOptions() {
  return JSON.parse(JSON.stringify(DEFAULT_OPTION))
}

export default requestApi
