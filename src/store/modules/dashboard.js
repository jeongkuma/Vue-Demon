import store from '../index'
// example: templateList
// [
//   {
//     seq: 2,
//     data: {
//      ctn: '01012341234',
//      gubun: 'ctn'
//   },
//   ...
// ]

export default {
  state: {
    templateList: []
  },
  getters: {
    TEMPLATE: state => seq => {
      if (state.templateList.length > 0) {
        return state.templateList.find(template => template.seq === seq)
      } else { // store에 없는 경우 localStorage에서 찾는다
        const templateList = JSON.parse(localStorage.getItem(store.state.user.userName + '_dashboard'))
        return templateList.find(template => template.seq === seq)
      }
    }
  },
  mutations: {
    SET_TEMPLATE: (state, paramObject) => {
      const result = state.templateList.find(template => template.seq === paramObject.seq)
      if (result) {
        result.data = paramObject.data
      } else {
        state.templateList.push(paramObject)
      }

      // 로그아웃시 정보륽 가져오기 위해서 저장
      localStorage.setItem(store.state.user.userName + '_dashboard', JSON.stringify(state.templateList))
    }
  },
  actions: {
    setTemplate({ commit }, template) {
      commit('SET_TEMPLATE', template)
    }
  }
}
