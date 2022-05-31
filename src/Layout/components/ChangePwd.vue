<template>
  <div>
    <div class="modal-body">
      <div class="login-form">
        <p class="mb-3 mx-2">{{changePwdContent}}</p><!-- 20190418 -->
        <div class="form-inline">
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{newPw}}</span>
            <input type="password" class="form-control" :title="newPw" v-model="usrPwd">
          </div>
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{checkPw}}</span>
            <input type="password" class="form-control" :title="checkPw" v-model="checkUsrPwd">
          </div>
        </div>
        <ul class="my-2 fs12">
          <li>{{$t('pwd-valid-first')}}</li>
          <li>{{$t('pwd-valid-second')}}</li>
          <li>{{$t('pwd-valid-third')}}</li>
          <li>{{$t('pwd-valid-forth')}}</li>
          <li>{{$t('pwd-valid-fifth')}}</li>
          <li>{{$t('pwd-valid-sixth')}}</li>
          <li>{{$t('pwd-valid-seventh')}}</li>
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button type="button" class="btn btn-pink" @click="pwdValidation()">{{$t('change-pw')}}</button>
        <button type="button" v-if="!firstLoginCheck" @click="changePwdNxt()" class="btn btn-gray">{{$t('change-pw-next')}}</button>
        <button type="button" v-if="firstLoginCheck" class="btn btn-gray" @click="close">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>
<script>

import requestApi from '@/api/ccp/requestApi'
import { check } from '@/utils/checkVal'
export default {
  name: 'FirstLogin',
  props: {
    data: Object, // 넘겨받을 데이터,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      newPw: this.$t('new-pw'),
      checkPw: this.$t('check-pw'),
      usrPwd: null,
      checkUsrPwd: null,
      changePwdContent: null,
      reason: null,
      firstLoginCheck: false
    }
  },
  created () {
    this.divideReason()
  },
  mounted() {
  },
  methods: {
    changePwd () {
      var reqData = this.data
      reqData.authCdId = 'GN00000058'
      reqData.usrPwd = btoa(unescape(encodeURIComponent(this.usrPwd)))
      if (this.firstLoginCheck) {
        reqData.pwdChange = 'firstChange'
      }
      requestApi({
        url: '/online/iotlogin/updateIotUsrPwd',
        headers: {
          'X-MID': 'P00052'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          reqData.usrPwd = ''
          if (res.result.status === '200') {
            if (res.data.changePwdYn === true) {
              this.close()
              this.alert(this.$t('notice-change-pwd'), 'success')
              this.callback(false)
            }
          }
        }
      })
    },
    pwdValidation() {
      if (!check(this.usrPwd)) {
        this.alert(this.$t('notice-pwd-input'))
      } else if (this.data.usrPwd === this.usrPwd) {
        this.alert(this.$t('notice-unfit-pwd'))
      } else if (this.usrPwd !== this.checkUsrPwd) {
        this.alert(this.$t('notice-unpaired-pwd'))
      } else {
        this.changePwdConfirm()
      }
    },
    changePwdNxt () {
      var reqData = this.data
      reqData.authCdId = 'GN00000058'
      requestApi({
        url: '/online/iotlogin/updateIotUsrPwdNxt',
        headers: {
          'X-MID': 'P00052'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.pwdChangeNxt === true) {
              this.close()
              this.callback(true)
            }
          }
        }
      })
    },
    divideReason () {
      var reason = this.data.reason
      if (reason === 'newPw') {
        this.changePwdContent = this.$t('lead-new-pw')
        this.firstLoginCheck = true
      } else if (reason === 'pwdModDt') {
        this.changePwdContent = this.$t('pwd-mod-dttm')
      } else if (reason === 'pwdNxtDt') {
        this.changePwdContent = this.$t('pwd-nxt-dttm')
      }
      this.reason = this.data.reason
    },
    changePwdConfirm () {
      this.confirm(this.$t('confirm-pwd-change'), this.changePwd)
    }
  }
}
</script>

<style scoped>

</style>
