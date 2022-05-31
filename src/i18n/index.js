/**
 * i18n 기본 셋팅
 */
import Vue from 'vue'
import envs from '@/envs'
import VueI18n from 'vue-i18n'
import { getI18nSet } from '@/api/common/lang.js'
import { setLocale, getLocale } from '@/utils/cookie'

Vue.use(VueI18n)

// 기본 문자열 셋 값을 구성한다.
let messages = {}
envs.framework.supportLocales.forEach(targetLocale => {
  messages[targetLocale.id] = require('./' + targetLocale.id).default
})

/**
 * [ 기본적으로 사용되지 않는 로케일로 셋팅을 한다 ]
 * 기본설정이 서버에서 메시지(Label)을 가져오는데..
 * 아래의 setI18n 에서 메시지를 병합하게 되었을 때 로케일이 변경되지 않으면 i18n 문자열이 적용되지 않는다.
 * IE에서 증상이 빈번하게 발생하는데.. 화면이 먼저 띄워지고 서버에서 문자열이 늦게 받아진경우 로케일을 변경하지 않으면
 * 병합된 메시지가 화면에 나타나지 않는다.
 * 따라서 로케일을 industryIot 라는 사용하지 않는 이름으로 설정 후 App.vue 에서 정상 로케일을 셋팅하도록 한다.
 */
const i18n = new VueI18n({
  locale: 'industryIot',
  messages,
  silentTranslationWarn: true
})

// 서버에서 i18n 메시지 값을 가져와 반영한다.
// 서버에서 다국어 메시지를 가져와 처리해야할 경우 적용한다.
let isSetI18n = false // i18n 적용되었는지 여부
export function setI18n() {
  return new Promise((resolve, reject) => {
    let localeLength = 0
    envs.framework.supportLocales.forEach(targetLocale => {
      setTimeout(() => {
        // 가지고 있는 locale에 따라 i18n 셋팅을 한다.
        getI18nSet(targetLocale.id).then(msgs => {
          // 가져온 값 리스트를 Object 형태로 재 구성한다.
          let setObj = {}
          if (msgs) {
            msgs.forEach(msg => {
              setObj[msg.id] = msg.text
            })
          }
          i18n.mergeLocaleMessage(targetLocale.id, setObj)

          // 모든 Locale 로딩/셋팅이 된 경우 Promise resolve 호출
          localeLength++
          if (localeLength === envs.framework.supportLocales.length) {
            resolve()
            isSetI18n = true
          }
        })
        // 서버에 getlabel API를  ko/en 동시에 호출 시
        // ko 또는 en 으로 둘다 동일한 값으로 Response 되는 증상으로 인해 약간의 딜레이를 주고 호출하도록 함.
        // 증상으로 로그인페이지에서 한국어/English 선택 시 동일한 값이 보여짐
        // 이렇게 200밀리세컨드 딜레이를 줘도 PC부하가 있는경우 IE에서 요청을 모았다가 서버에 한꺼번에 요청해서
        // 간혈적으로 증상이 재현되는 경우가 있음. (추후 서버 이슈 없어지면 코드 없애도 됨)
      }, 200)
    })
  })
}

export { isSetI18n }

export function checkedLanguage(lang) {
  return lang || envs.framework.supportLocales[0].id
}

export function getLanguage() {
  let locale = getLocale()
  return locale || checkedLanguage()
}

export function setLanguage(lang) {
  i18n.locale = checkedLanguage(lang)
  setLocale(lang)
}

// 서버 조회 설정이 있을 경우
// if (envs.framework.getI18nDataFromServer) {
//   setI18n()
// }

export default i18n
