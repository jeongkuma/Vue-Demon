import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './i18n'
// 개발의 용의성을 위해 권한 부분은 해제 한 상태
// import './auth'
import lodash from 'lodash'
import plugin from '@/plugins/plugin'
import '@/plugins/toastPlugin'

// Modal
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'

// import publish from '@/assets/js/common'
require('@/assets/js/common')

// jquery 호환 라이브러리를 위한 조치
window.$ = window.jquery = window.jQuery
// Lodash window 전체 영역 부여
window._ = lodash
Vue.config.productionTip = false

Vue.use(plugin)
Vue.use(VModal)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
