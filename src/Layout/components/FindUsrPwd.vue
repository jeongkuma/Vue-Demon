<template>
  <div>
    <div class="modal-body">
      <div class="login-form">
        <div class="form-inline">
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{custId}}</span>
            <input type="text" class="form-control" v-model="reqData.custLoginId" placeholder="" :title="this.custId"  maxlength="20"/>
          </div>
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{usrId}}</span>
            <input type="text" class="form-control" v-model="reqData.usrLoginId"  placeholder="" :title="this.usrId"  maxlength="20">
          </div>
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{phoneNum}}</span>
            <input type="text" class="form-control" v-model="reqData.usrPhoneNo"  :placeholder="this.$t('hypen-place-hd')" :title="this.phoneNum"  maxlength="11">
          </div>
          <div class="form-group ml-1">
            <span class="lb-txt w130">{{authNum}}</span>
            <div class=" input-group">
              <input type="text" class="form-control" v-model="reqData.authNo"  placeholder="" :title="this.authNum"  maxlength="6">
              <button class="btn btn-info input-group-addon btn-sm" @click="validation(false)" type="button">{{request}}</button>
              <span class="bold my-2" id='countdown'></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button type="button" class="btn btn-pink" @click="validation(true)">{{$t('init-pw')}}</button>
        <button type="button" class="btn btn-gray" @click="fnClose()">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import requestApi from '@/api/ccp/requestApi'
import { check, checkPhone, checkAuthNo } from '@/utils/checkVal'

export default {
  name: 'findUsrPwdPopup',
  data () {
    return {
      custId: this.$t('cust-login-id'),
      usrId: this.$t('usr-login-id'),
      phoneNum: this.$t('phone-no'),
      authNum: this.$t('auth-no'),
      reqData: { custLoginId: '', usrLoginId: '', usrPhoneNo: '', authNo: null, authCdId: 'GN00000059' },
      findUsrPwd: null,
      reqFlag: false,
      request: this.$t('request')
    }
  },
  created () {
  },
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
  mounted() {
  },
  beforeDestroy() {
    this.fnClose()
  },
  methods: {
    validation(mode) {
      if (!check(this.reqData.custLoginId)) {
        this.alert(this.$t('cust-lgn-id-input'))
      } else if (!check(this.reqData.usrLoginId)) {
        this.alert(this.$t('user-id-input'))
      } else if (!check(this.reqData.usrPhoneNo)) {
        this.alert(this.$t('sms-send-phonenumber-chk-msg'))
      } else if (!checkPhone(this.reqData.usrPhoneNo)) {
        this.alert(this.$t('notice-phone-input'))
      } else {
        if (mode) {
          if (this.reqFlag) {
            if (!check(this.reqData.authNo)) {
              this.alert(this.$t('lead-req-authNo'))
            } else if (!checkAuthNo(this.reqData.authNo)) {
              this.alert(this.$t('notice-authNo-input'))
            } else {
              // $('#countdown').text('')
              // clearInterval(this.timer)
              this.findPwd()
            }
          } else {
            this.alert(this.$t('lead-req-auth'))
          }
        } else {
          this.requestAuthNo()
        }
      }
    },
    requestAuthNo () {
      this.reqData.authNo = ''
      this.reqData.pwdChange = 'findPw'
      requestApi({
        url: '/online/iotlogin/retrieveIotUsrInfoForPwd',
        headers: {
          'X-MID': 'P00051'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.sendYn === true) {
              this.request = this.$t('retry-sms')
              this.reqFlag = true
              this.noticePopup(this.$t('success-sms'))
              clearInterval(this.timer)
              this.fnCountdown()
            }
          }
        }
      })
    },
    findPwd () {
      requestApi({
        url: '/online/iotlogin/retrieveIotUsrPwd',
        headers: {
          'X-MID': 'P00051'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          this.reqData.authNo = null
          if (res.result.status === '200') {
            clearInterval(this.timer)
            $('#countdown').text('')
            this.changePwdPopup(res.data.changePwd)
          }
        }
      })
    },
    changePwdPopup (gubun) {
      this.reqData.reason = gubun
      this.popup({
        component: () => import('@/Layout/components/ChangePwd'),
        title: this.$t('change-pw'),
        width: '500',
        data: this.reqData,
        callback: (data) => {
          if (!data) {
            this.close()
          }
        }
      })
    },
    noticePopup (desc) {
      this.popup({
        width: '300',
        content: desc,
        callback: () => {}
      })
    },
    fnCountdown () {
      var duration = moment.duration({
        'minutes': 3,
        'seconds': 1
      })
      var timestamp = new Date()
      var interval = 1

      this.timer = setInterval(function() {
        timestamp = new Date(timestamp.getTime() + interval * 1000)
        duration = moment.duration(duration.asSeconds() - interval, 'seconds')
        var min = duration.minutes()
        var sec = duration.seconds()
        sec -= 1
        if (min <= 0 && sec < 0) { // 분이 0분 미만일 때 클리어 인터벌
          return clearInterval(this.timer)
        }
        if (min < 10 && min.length !== 2) { // octal 처리(00분)
          min = '0' + min
        }
        if (sec < 0 && min !== 0) { // 1분이 지났을 때 초 59초로 복귀
          min -= 1
          min = '0' + min
          sec = 59
        } else if (sec < 10 && sec.length !== 2) { // octal 처리(00초)
          sec = '0' + sec
        }
        $('#countdown').text(min + ':' + sec)
        // this.countdown = min + ':' + sec
        if (min === 0 && sec === 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    fnClose () {
      clearInterval(this.timer)
      $('#countdown').text('')
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
