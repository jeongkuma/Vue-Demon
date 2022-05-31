<template>
  <div>
  </div>
</template>

<script>
import { intelligent } from '@/envs'
import { getCookie, setCookie } from '@/utils/cookie'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'IntelligentVideoPopup',
  props: {},
  components: {},
  data() {
    return {
      xMid: 'P00001',
      player: null,
      videoSrc: null,
      opitons: {
        autoplay: false,
        controls: true,
        sources: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async fnInit() {
      if (!getCookie(intelligent.accessTokenKey)) {
        await this.fnGetToken()
      }
      // TODO: 이후 로직 구현 필요
    },
    fnGetToken() {
      let reqData = {}
      return new Promise((resolve) => {
        requestApi({
          url: '/online/vpcom/intelligent/login',
          headers: { 'X-MID': this.xMid },
          method: 'post',
          data: reqData,
          callback: res => {
            if (res.result.status === '200') {
              // refreshToken은 사용하지 않을 예정이지만 저장함
              setCookie(intelligent.accessTokenKey, res.data.auth.access_token)
              setCookie(intelligent.refreshTokenKey, res.data.auth.refresh_token)

              resolve(intelligent.accessTokenKey, res.data.auth.access_token)
            } else {
              console.error('[IntelligentVideoPopup] fail to login', res)
            }
          }
        })
      })
    }
  }
}
</script>

<style></style>
