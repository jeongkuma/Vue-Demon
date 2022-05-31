<template>
  <div>
    <!-- skip : S -->
    <layout-skip />
    <!-- skip : E -->
    <div id="bodyWrap" class="main" :class="theme">

      <!-- not Login : S -->
      <router-view v-if="!storeUserToken" ></router-view>
      <!-- not Login : E -->

      <div v-if="storeUserToken">
        <!-- headerWrap : S -->
        <layout-header />
        <!-- headerWrap : E -->

        <!-- contentsWrap : S -->
        <layout-contents />
        <!-- contentsWrap : E -->

        <!-- footerWrap : S -->
        <!-- <layout-footer /> 홍수석님 요청으로 삭제 -->
        <!-- footerWrap : E -->
      </div>
    </div>
    <div v-show="storeLoadingState" class="loader fixed">
      <div class="loader-inner">
        <div></div><div></div><div></div><div></div><div></div>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutSkip from '@/Layout/components/Skip'
import LayoutHeader from '@/Layout/Header'
import LayoutContents from '@/Layout/Contents'

import store from '@/store'
import '@/auth' // FIXME 로그인 작업자가 사용(수정예정)

import eventBus from '@/utils/eventBus'
import { getTheme, setTheme } from '@/utils/theme'
import { getCustId, getUserId } from '@/utils/cookie'

export default {
  name: 'LayoutIndex',
  components: {
    LayoutSkip,
    LayoutHeader,
    LayoutContents
  },
  data() {
    return {
      theme: null
    }
  },
  computed: {
    storeUserToken() { // FIXME 로그인 작업자가 사용(수정예정)
      // return true
      return store.state.user.token
    },
    storeLoadingState () {
      return store.state.loading.isVisible
    }
  },
  created() {
    // 테마값이 null 로 들어오는경우 기존에 저장되어있는 테마를 불러온다.
    eventBus.$on('setThemeEventBus', theme => {
      this.theme = theme === 'red' ? ''
        : theme === 'blue' ? 'type-blue'
          : theme === 'green' ? 'type-green' : getTheme(getCustId(), getUserId())
      setTheme(getCustId(), getUserId(), this.theme)
    })
    if (!this.theme) { // 페이지 새로고침 시 저장된 테마를 가져와 셋팅한다.
      this.theme = getTheme(getCustId(), getUserId())
    }
  }
}
</script>

<style lang="less">

</style>
