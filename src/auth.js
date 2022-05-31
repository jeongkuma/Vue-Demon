/**
 * page 별 권한 관리를 위한 로직 구성
 */
import router from './router'
import store from './store'
import envs from '@/envs'
import { getToken, getUserName } from '@/utils/cookie'
import localStore from '@/utils/localStore'
import { getUserFirstUrl } from '@/api/ccp/user'
import _ from 'lodash'

router.beforeEach((to, from, next) => {
  let menus = store.state.menu.menus
  let treeMenus = store.state.menu.treeMenus
  let userToken = store.state.user.token

  // 새로고침 한 경우 처리
  if (!userToken && getToken() && !menus.length && localStore.get('menu_' + envs.buildUrl + '/' + getToken())) {
    let userName = getUserName()
    userToken = getToken()
    menus = JSON.parse(localStore.get('menu_' + envs.buildUrl + '/' + userToken))
    store.dispatch('ProcessLogin', userToken)
    store.dispatch('SetUserName', userName)
    store.dispatch('SetCommonHeader', { auth: userToken })
    store.dispatch('SetMenu', menus)
  }

  if (!userToken && to.path !== '/login/loginPage') {
    next('/login')
  } else {
    // 메뉴에서 이동하려는 페이지가 있는지 확인
    let targetMenu = _.find(menus, { href: to.path })

    // 메뉴가 서버에서 불러오지 않은 경우. 최초 실행 될 때 수행되는 부분
    if (menus.length === 0 &&
      (envs.framework.whiteList.indexOf(to.path) !== -1 || envs.framework.whiteList.indexOf(to.redirectedFrom) !== -1)
    ) {
      next()

      // 메뉴권한이 없어도 페이지로 이동
    } else if (envs.framework.whiteListWithLogin.indexOf(to.path) !== -1) {
      next()

      // 로그인 시 처음 이동하는 페이지에 권한이 없는경우 권한이 있는 메뉴의 첫번째 페이지로 이동
    } else if (!targetMenu && to.redirectedFrom === '/') {
      // 특정 사용자의 경우에 로그인페이지가 고정된 경우가 있다.
      let firstHref = (getUserFirstUrl() !== '/') ? getUserFirstUrl() : getValidMenuUrl(treeMenus)
      store.dispatch('SetFirstHref', firstHref)
      next(firstHref)

      //  메뉴 권한이 있거나 화이트리스트 페이지의 경우
    } else if (targetMenu || envs.framework.whiteList.indexOf(to.path) !== -1) {
      next()

      //  그외 404페이지 이동
    } else {
      next('/404')
    }
  }
})
function getValidMenuUrl (menus) {
  let returnUrl = ''
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].href) {
      returnUrl = menus[i].href
      break
    } else if (menus[i].children && menus[i].children.length) {
      returnUrl = getValidMenuUrl(menus[i].children)
      if (returnUrl) {
        break
      }
    }
  }
  return returnUrl
}
