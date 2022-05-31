import permission from './permission'

let Directives = {
  install (Vue, options) {
    Vue.use(permission)
  }
}

export default Directives
