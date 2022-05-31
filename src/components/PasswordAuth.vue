<template>
  <div class="modal-body">
    <div class="form-group">
      <input v-model="userPassword" @keyup.enter="auth()" type="password" class="form-control" />
    </div>
    <div class="btn-wrap text-center">
      <button @click="auth()" type="button" class="btn btn-pink">확인</button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { getCustId, getUserId } from '@/utils/cookie'
export default {
  name: 'PasswordAuth',
  components: {},
  props: {
    modal: Object,
    data: Object, // 넘겨받을 데이터,
    callback: { // 호출할 콜백함수
      type: Function,
      required: true
    },
    close: { // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data () {
    return {
      userPassword: '',
      isAuth: false
    }
  },
  created () {},
  mounted () {
  },
  computed: {},
  methods: {
    auth () {
      var convertPwd = null
      if (this.userPassword) {
        convertPwd = btoa(unescape(encodeURIComponent(this.userPassword)))
        requestApi({
          url: '/online/iotlogin/processIotLogin',
          headers: {
            'X-MID': 'P00103'
          },
          method: 'post',
          data: {
            custLoginId: getCustId(),
            usrLoginId: getUserId(),
            usrPwd: convertPwd,
            authCdId: 'GN00000058'
          },
          callback: (res) => {
            if (res.result && res.result.status === '200' && res.data) {
              this.close()
              this.callback(true)
            } else {
              // 비밀번호 틀림 (기본적으로 메시지를 띄우므로 별다른 처리를 하지 않는다.)
            }
          }
        })
      } else {
        this.alert(this.$t('notice-pwd-input'), 'warning')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
