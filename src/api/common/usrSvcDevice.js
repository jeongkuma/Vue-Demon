import requestApi from '@/api/ccp/requestApi'

/**
 * 사용자의 매핑된 서비스 목록 조회
 * @param {*} data
 */
export function getSvcList(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotusr/retrieveAuthUsrSvc',
      headers: {
        'X-MID': data.xMid || 'P00088'
      },
      data: {},
      method: 'post',
      callback: res => {
        if (res.result.status === '200') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

/**
 * 서비스코드로 장비 유형 목록 조회
 * @param {*} data
 */
export function getDevClsCdListBySvcCd(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotsvc/getServiceDevCls',
      headers: {
        'X-MID': data.xMid || 'P00088'
      },
      data: {
        svcCd: data.svcCd
      },
      method: 'post',
      callback: res => {
        if (res.result.status === '200') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

/**
 * 서비스, 장비유형별 장비 모델 목록 조회
 * @param {*} data
 * @param {*} xMid
 */
export function getDevMdlListByDevCls(data, xMid) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotsdev/retrieveSvcDevMdlList',
      headers: {
        'X-MID': xMid
      },
      method: 'post',
      data: data,
      callback: res => {
        if (res.result.status === '200') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

/**
 * 부모코드로 제어대상서버 목록 조회
 * @param {*} data
 */
export function getCtlSvrListByParentCdId(data) {
  return new Promise((resolve, reject) => {
    requestApi({
      url: '/online/iotctlsvr/retrieveIotCtlSvrList',
      headers: {
        'X-MID': data.xMid || 'P00088'
      },
      data: {
        parentCdId: data.parentCdId
      },
      method: 'post',
      callback: res => {
        if (res.result.status === '200') {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}
