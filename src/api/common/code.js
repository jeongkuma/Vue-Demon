import requestApi from '@/api/ccp/requestApi'

export function getCommonCode(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
      headers: {
        'X-MID': data.xMid
      },
      method: 'post',
      data: {
        parentCdId: data.parentCdId,
        charSet: data.charSet || 'ko'
      },
      callback: res => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

/**
 * 코드 상세 값만 보임
 * @param {*} data
 * @return ["N00000342", "N00000343", "N00000344"]
 */
export function getCommonCodeSubString(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotcmcd/retrieveIotCmCdBySubString',
      headers: {
        'X-MID': data.xMid
      },
      method: 'post',
      data: {
        parentCdId: data.parentCdId
      },
      callback: res => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

/**
 * 공통코드 조회
 * @param {*} data
 * @return [{
            "cdOrder": 1,
            "cdId": "GN00000342",
            "cdNm": "문자형"
        }]
 */
export function getCommonCodeByParentCdId(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotcmcd/retrieveIotByParentCmCdOnly',
      headers: {
        'X-MID': data.xMid
      },
      method: 'post',
      data: {
        parentCdId: data.parentCdId,
        langSet: data.langSet || 'ko'
      },
      callback: res => {
        if (res.result.status === '200' || res.result.status === '204') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}
