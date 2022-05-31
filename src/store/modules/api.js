import Cookies from 'js-cookie'
import { getLocale } from '@/utils/cookie'

export default {
  state: {
    common: {
      'Content-Type': 'application/json', // Content-Type
      'X-APIVERSION': '1', // API 버전
      'X-LOGKEY': 'default-logkey', // 화면에서 생성한 유일한 키 YYYYMMDDHHmmSSsss+랜덤4자리+랜덤4자리 (요청고유값)
      'X-CHANNEL': 'UI', // Client Application 의미, 호출 시스템 ID
      // 'X-AUTH': '', // 토근 값 , 로그인만 예외 ( 로그인 시점에 발급 되는 토근 )
      'X-VNAME': 'ONLINE', // 장치 유형
      // 'X-LANG': getLocale(), // Cookies.get('LOCALE'), // 로그인시에 선택한 언어셋으로 헤더 설정
      // 'X-LANG': Cookies.get('LOCALE'), // 로그인시에 선택한 언어셋으로 헤더 설정
      'X-LANG': 'ko', // 언어 Set
      'X-MID': 'default-mid' // 메뉴 또는 화면 아이디
      // 'X-CALLTYPE': 'default' // 내부, 타이머 (웹에서는 사용하지 않는다고 전달받음.)
    }
  },
  mutations: {
    SET_COMMON_HEADER: (state, { contentType, vname, xHitVersion, xLang, xHitChannel, auth }) => {
      // if (contentType) {
      //   state.common['Content-Type'] = contentType
      // }
      // if (vname) {
      //   state.common['VNAME'] = vname
      // }
      // if (xHitVersion) {
      //   state.common['X-HIT-Version'] = xHitVersion
      // }
      // if (xLang) {
      //   state.common['X-LANG'] = xLang
      // }
      // if (xHitChannel) {
      //   state.common['X-HIT-Channel'] = xHitChannel
      // }
      if (auth) { // 로그인페이지에서 AUTH에 빈값으로 보내면 응답이 안와서 동적으로 생성해줌.
        state.common['X-AUTH'] = auth
      }
      if (xLang) { // request 보낼 때 로그인시 선택한 언어로 셋팅이 안되서 설정 내용 추가
        state.common['X-LANG'] = xLang
      }
    }
  },
  actions: {
    SetCommonHeader ({ commit }, header) {
      commit('SET_COMMON_HEADER', header)
    }
  }
}
