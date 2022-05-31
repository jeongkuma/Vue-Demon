<template>
  <div>
   <div class="modal-body">
      <div class="login-form">
        <div class="form-inline">
          <div class="form-group ml-1">
            <strong>개인정보 활용에 대한 동의서<br>
            유플러스 IoT관제 서비스와 관련하여 주식회사 엘지유플러스가 본인의 개인정보를 수집, 이용, 제공하고자 하는 경우에는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「개인정보보호법」 등에 따라 본인의 동의를 얻어야 합니다. 이에 본인은 주식회사 엘지유플러스가 아래와 같이 본인의 개인정보를 활용하는 것에 대하여 동의합니다.<br><br>
            개인정보의 수집 및 이용 (필수동의)  </strong>
            <textarea readonly cols="118" rows="10" text-align="center" style="resize: none">
1. 개인정보 수집항목 - 소속, 성명, 휴대폰번호, 아이디(ID), 패스워드(password), 전자우편주소

2. 개인정보 수집, 이용 목적 - 유플러스 IoT관제 시스템 접근, IoT관제 서비스 제공, 본인인증 및 식별 등 IoT관제 서비스와 관련 시스템 운영 및 관리

3. 개인정보 보유 및 이용기간 - 이용자의 개인정보는 원칙적으로 서비스기간 동안 보유 및 이용됩니다.
(단, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 통신비밀보호법 등 관계법령에 따라 보존할 필요성이 있는 경우는 규정에 따라 보유합니다.)
            </textarea>
            <input v-model="agreeBox" class="checkbox" type="checkbox">개인정보 및 서비스 이용 관련정보를 귀사가 위와 같이 수집·이용함에 관하여 고지 받았으며 이를 충분히 이해하고 동의합니다.<br><br>
            ▶ 귀하는 정보주체로서 개인정보 등의 동의 거부권이 있으며, 미동의시 서비스 가입, 이용에 제약이 있을 수 있고, 미 동의한 경우 정보가 제공되지 않음을 알려 드립니다.<br>

▶ 개인정보 처리위탁 현황 및 변동사항은 홈페이지(www.lguplus.co.kr) 개인정보 처리방침에 공개하여 고지합니다.
          </div>
          <div id="userInfo" style="position:relative;">
            <br>
            <div style="position: absolute; left: 50%; transform: translateX(-50%);">
              <span id="nowData" style="font-size: 1.5em">{{nowDate}}</span><span id="usrNm" style="font-size: 2em">{{usrNm}}</span>
            </div><br>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="termsAgreeConfirm()">{{$t('agree')}}</button>
        <button type="button" class="btn btn-gray" @click="closeConfirm()">{{$t('cancle')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'
export default {
  name: 'termsAgreeYnPopup',
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
      reqData: { custLoginId: null, usrLoginId: null, usrPwd: null },
      nowDate: null,
      usrNm: null,
      agreeBox: false
    }
  },
  created () {
    this.reqData = this.data
    this.nowDate = moment().format('YYYY[년 ]MM[월 ]DD[일 ]')
    this.usrPersonalInfo()
  },
  mounted() {
  },
  methods: {
    termsAgreeConfirm () {
      if (this.agreeBox === false) {
        this.alert(this.$t('lead-check-terms'))
      } else {
        this.confirm(this.$t('lead-termsAgree'), this.termsAgree)
      }
    },
    termsAgree () {
      this.reqData.termsAgreeYn = 'Y'
      requestApi({
        url: '/online/iotlogin/updateIotTermsAgreeYn',
        headers: {
          'X-MID': 'P00053'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.termsAgreeYn === 'Y') {
              this.close()
              this.callback(true)
            }
          }
        }
      })
    },
    usrPersonalInfo () {
      requestApi({
        url: '/online/iotlogin/retrieveIotUsrPersonalInfo',
        headers: {
          'X-MID': 'P00053'
        },
        method: 'post',
        data: this.reqData,
        callback: (res) => {
          this.usrNm = res.data.usrNm
        }
      })
    },
    fnClose () {
      this.close()
      this.callback(false)
    },
    closeConfirm () {
      this.confirm(this.$t('closeYn'), this.fnClose)
    }
  }
}
</script>

<style scoped>
/* #userInfo {
  position: absolute
}
#nowDate {
  position: relative;
  left: 40%
}
#usrNm {
  position: relative
} */
</style>
