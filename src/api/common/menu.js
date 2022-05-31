import menuMockupData from './mock/menu.json'
// import request from '@/utils/request'
import axios from 'axios'
import { isUseAPI } from '@/utils/check'
import requestApi from '@/api/ccp/requestApi'
export function getMenus () {
  if (isUseAPI()) {
    return new Promise(function (resolve, reject) {
      requestApi({
        url: '/online/com/menu/retrieveAuthMenu',
        headers: {
          'X-MID': 'P00088'
        },
        data: {},
        method: 'post',
        callback: (res) => {
          if (res.result.status === '200') {
            resolve(res.data)
          }
        }
      })
    })
  } else {
    return new Promise(function (resolve, reject) {
      resolve(menuMockupData)
    })
  }
}

export function getProgs () {
  return new Promise(function (resolve, reject) {
    requestApi({
      url: '/online/com/prog/retrieveAuthProg',
      headers: {
        'X-MID': 'P00088'
      },
      data: {},
      method: 'post',
      callback: (res) => {
        if (res.result.status === '200') {
          resolve(res.data)
        }
      }
    })
  })
}

// export function getMenus () {
//   // local 개발 환경이 아닐 경우, 무조건 서버를 조회해야 함
//   if (isUseAPI()) {
//     // return request({
//     //   url: '/menu',
//     //   method: 'get'
//     // })
//   }

//   // restful api를 사용하지 않을 경우
//   return new Promise(function (resolve, reject) {
//     resolve(menuMockupData)
//   })
// }

export function setMenus (saveData) {
  if (isUseAPI()) {
    var saveActions = []
    // 수정할 데이터들을 API 룰에 맞게 셋팅하는 함수
    var updatedAction = function (rowData) {
      // return request({
      //   url: '/menu',
      //   method: 'put',
      //   data: rowData
      // })
    }

    // 추가할 데이터들을 API 룰에 맞게 셋팅하는 함수
    var createdAction = function (rowData) {
      // return request({
      //   url: '/menu',
      //   method: 'post',
      //   data: rowData
      // })
    }

    // 삭제 데이터들을 API 룰에 맞게 셋팅하는 함수, 삭제시 id만 필요하다
    var deletedAction = function (rowData) {
      // return request({
      //   url: '/menu',
      //   method: 'delete',
      //   data: rowData
      // })
    }

    // created 에 추가할 데이터들이 담겨있으면 API 룰에 맞게 셋팅하는 함수 호출
    // 한번에 여러개의 데이터를 배열로 묶어 보낼 수 있다.
    if (saveData.created && saveData.created.length > 0) {
      saveActions.push(createdAction(saveData.created))
    }
    // updated 에 수정할 데이터들이 담겨있으면 API 룰에 맞게 셋팅하는 함수 호출
    // 한번에 여러개의 데이터를 배열로 묶어 보낼 수 있다.
    if (saveData.updated && saveData.updated.length > 0) {
      saveActions.push(updatedAction(saveData.updated))
    }
    // deleted 에 삭제할 데이터들이 담겨있으면 API 룰에 맞게 셋팅하는 함수 호출
    // 한번에 여러개의 데이터를 배열로 묶어 보낼 수 있다.
    if (saveData.deleted && saveData.deleted.length > 0) {
      saveActions.push(deletedAction(saveData.deleted))
    }

    // 추가 수정 삭제를 각각 실행할경우 한번 실행시마다 화면으로 리턴값을 넘겨주게 되므로
    // 끝나는 시점이 애매하기 때문에 all 을 이용해 한번에 넘긴다.
    // 전체가 성공했을때 then, 하나라도 실패했을때 catch 를 타게 된다.
    axios.all(saveActions)
      .then(reponse => {
        return '200'
      }).catch(error => {
        return error
      })
  }

  return new Promise(function (resolve, reject) {
    resolve('200')
  })
}
