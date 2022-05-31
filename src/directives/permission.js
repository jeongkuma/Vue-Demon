import store from '@/store'

let permission = {
  componentUpdated(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.roles

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      // permission이 없으면 해당 el은 삭제 되어야 한다.
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`유저 그룹 설정이 필요합니다.! 예: v-permission="['admin','developer']"`)
    }
  }
}

const install = function (Vue) {
  Vue.directive('permission', permission)
}

permission.install = install
export default permission
