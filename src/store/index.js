import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import api from './modules/api'
import user from './modules/user'
import dashboard from './modules/dashboard'
import envs from '@/envs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: {
      requestCount: 0,
      isVisible: false
    }
  },
  mutations: {
    PUSH_REQUEST_COUNT: state => {
      state.loading.requestCount++
      setTimeout(function() {
        state.loading.isVisible = state.loading.requestCount > 0
      }, envs.framework.loadingDelay)
    },
    POP_REQUEST_COUNT: state => {
      state.loading.requestCount--
      if (state.loading.isVisible && state.loading.requestCount < 1) {
        state.loading.isVisible = false
      }
    }
  },
  actions: {
    RequestApi({ commit }) {
      commit('PUSH_REQUEST_COUNT')
    },
    ResponseApi({ commit }) {
      commit('POP_REQUEST_COUNT')
    }
  },
  modules: {
    menu,
    api,
    user,
    dashboard
  }
})
