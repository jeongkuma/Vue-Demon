import { isUseAPI } from '@/utils/check'
import envs from '@/envs'
import requestApi from '@/api/ccp/requestApi'
import langMockupData from './mock/langMockupData'

export function getI18nSet (locale) {
  // local 개발 환경이 아닐 경우, 무조건 서버를 조회해야 함
  if (isUseAPI() && envs.framework.getI18nDataFromServer) {
    return new Promise(function(resolve, reject) {
      requestApi({
        url: '/online/label/getlabel',
        headers: {
          'X-MID': 'P00105',
          'X-LANG': locale
        },
        method: 'post',
        data: {},
        callback: (data) => {
          if (data.result.status === '200') {
            let localeList = []
            let idList = Object.keys(data.data)
            idList.forEach(id => {
              localeList.push({ id: id, text: data.data[id] })
            })
            resolve(localeList)
          } else {
            resolve(langMockupData[locale])
          }
        }
      })
    })
  } else {
    // restful api를 사용하지 않거나 서버i18n 설정이 false인경우
    return new Promise(function (resolve, reject) {
      resolve(langMockupData[locale])
    })
  }
}
