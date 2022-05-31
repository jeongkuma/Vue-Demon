// eslint-disable-next-line
import _ from 'lodash'

export default {
  state: {
    userId: '',
    userName: '',
    token: ''
  },
  mutations: {
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    CLEAR_TOKEN: state => {
      state.token = ''
    }
  },
  actions: {
    ProcessLogin({ commit }, auth) {
      commit('SET_TOKEN', auth)
    },
    SetUserId({ commit }, userId) {
      commit('SET_USER_ID', userId)
    },
    SetUserName({ commit }, userName) {
      commit('SET_USER_NAME', userName)
    },
    ClearToken({ commit }) {
      commit('CLEAR_TOKEN')
    }
  }
}
