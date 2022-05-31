<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
          <table class="table table-row">
          <caption>{{$t('user-modify')}}</caption>
          <colgroup>
            <col style="width:20%">
            <col style="width:auto">
          </colgroup>
          <tbody>
            <tr>
              <th scope="row" class="right"><span class="lb-txt">{{$t('id')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input v-model="dataObj.usrLoginId" type="text" class="form-control" disabled>
                </div>
              </td>
            </tr>
            <tr>
            <tr>
              <th scope="row" class="right"><span class="lb-txt">{{$t('pw')}}</span></th>
              <td class="form-inline">
                <div class="form-group input-group">
                  <input v-model="usrPwd" type="password" class="form-control" :readonly="pwChkFlag">
                </div>
                <div class="form-group">
                  <button type="button" class="btn btn-gray" @click="fnPwChg()">{{pwChgTitle}}</button>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right"><span class="lb-txt">{{$t('pw-chk')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input v-model="usrPwdChk" type="password" class="form-control" :readonly="pwChkFlag">
                </div>
                <div class="form-group text-color-red">&nbsp;&nbsp;{{pwValdationTitle}}</div>
              </td>
            </tr>
            <tr>
              <th scope="row" class="right"><span class="lb-txt">{{$t('present-pw')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input v-model="preUsrPwd" type="password" class="form-control" :readonly="pwChkFlag">
                </div>
              </td>
            </tr>
            <!-- <tr>
              <th scope="row" class="right"><span class="lb-txt">{{$t('new-pw')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input v-model="dataObj.usrPwd" type="text" class="form-control">
                </div>
              </td>
            </tr>             -->
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('usrNm')}}</span></th>
              <td>
                <div class="input-group">
                  <input v-model="dataObj.usrNm" type="text" class="form-control">
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('contact-number')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input v-model="dataObj.usrPhoneNo" type="text" class="form-control" :placeholder="placeHolder" maxlength="11"  @input="fnPhoneChgChk()">
                  <button class="btn btn-gray input-group-addon" type="button" @click="fnPhoneDuplChk()">{{$t('duplication-check')}}</button>
                </div>
              </td>
            </tr>
            <tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('roleNm')}}</span></th>
              <td>
                <div class="form-inline">
                  <input v-model="dataObj.roleCdNm" type="text" class="form-control" disabled>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">{{$t('email')}}</th>
              <td>
                <div class="form-inline">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="emailAddr">
                  </div>
                  <span class="mx-0">@</span>
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="emailCorps">
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="lb-txt">{{$t('department')}}</span></th>
              <td class="form-inline">
                <div class="input-group">
                  <input type="text" class="form-control" readonly :value="dataObj.orgNm">
                  <button class="btn btn-gray input-group-addon" type="button" @click="fnSearchOrg()">{{$t('search')}}</button>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row"></th>
              <td>
                <div class="input-group">
                  <div class="text-center">※ {{$t('user-req-desc')}}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">{{$t('modify')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import logout from '@/api/ccp/logout'

export default {
  name: 'UserSvc',
  props: {
    close: { // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data () {
    return {
      dataObj: { usrLoginId: '', usrPwd: null, usrNm: null, smsRcvNo: null, usrPhoneNo: null, roleCdNm: null, roleCdId: null, usrEmail: null, orgSeq: null, usrSeq: '' },
      retrieveApi: '/online/iotusr/retrieveIotUsrBySeq',
      updateApi: '/online/iotusr/updateIotUsr',
      retrieveIotUsrRoleListAPI: '/online/iotusr/retrieveIotUsrRoleList',
      retrieveIotUsrPwChkAPI: '/online/iotusr/retrieveIotUsrPwChk',
      orgSearchApi: '/online/iotorg/retrieveIotOrgByUsr',
      placeHolder: this.$t('hypen-place-hd'),
      orgList: [],
      roleList: [],
      emailCorps: '',
      emailAddr: '',
      usrPwdChk: '',
      usrPwd: '',
      preUsrPwd: '',
      pwChkFlag: true,
      pwChgTitle: '',
      selectedOrg: {},
      phoneDuplChkApi: '/online/iotusr/retrieveUsrPhoneDuplChk',
      phoneDuplFlag: true,
      originPhoneNo: null,
      roleUpdateYn: ''
    }
  },
  created () {
    this.fnCallAPI()
    this.pwChgTitle = this.$t('change-pw')
  },
  computed: {
    emailAddress: function() {
      if (this.emailAddr === '') {
        return ''
      } else {
        return this.emailAddr + '@' + this.emailCorps
      }
    },
    pwValdationTitle: function() {
      if (this.usrPwdChk === '' && this.usrPwd === '') {
        return ''
      } else if (this.usrPwdChk === this.usrPwd) {
        return this.$t('same-pw')
      } else {
        return this.$t('diffrent-pw')
      }
    }
  },
  methods: {
    fnPhoneChgChk() {
      if (this.originPhoneNo !== this.dataObj.usrPhoneNo) {
        this.phoneDuplFlag = false
      } else {
        this.phoneDuplFlag = true
      }
    },
    fnPhoneDuplChk() {
      if (!this.fnPhoneNumChk(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-chk'), 'warning')
      } else {
        requestApi({
          url: this.phoneDuplChkApi,
          headers: {
            'X-MID': 'P00044'
          },
          method: 'post',
          data: { usrPhoneNo: this.dataObj.usrPhoneNo, usrSeq: this.dataObj.usrSeq },
          callback: (res) => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(res.data.msg, 'success')
              this.phoneDuplFlag = true
            } else {
              if (this.originPhoneNo === this.dataObj.usrPhoneNo) {
                this.phoneDuplFlag = true
              } else {
                this.phoneDuplFlag = false
              }
            }
          }
        })
      }
    },
    fnPwChg() {
      this.pwChkFlag = !this.pwChkFlag
      if (!this.pwChkFlag) {
        this.pwChgTitle = this.$t('change-pw-cancel')
      } else {
        this.pwChgTitle = this.$t('change-pw')
        this.usrPwdChk = ''
        this.usrPwd = ''
        this.preUsrPwd = ''
      }
    },
    // 현재 사용은 안하나 나중에 비밀번호 인증을 위해 남겨둠.
    fnPwChange () {
      requestApi({
        url: this.retrieveIotUsrPwChkAPI,
        headers: {
          'X-MID': 'P00044'
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
          }
        }
      })
    },
    fnMakeOrgData() {
      requestApi({
        url: this.orgSearchApi,
        headers: {
          'X-MID': 'P00044'
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.orgList = res.data
          }
        }
      })
    },
    fnMakeRoleData() {
      requestApi({
        url: this.retrieveIotUsrRoleListAPI,
        headers: {
          'X-MID': 'P00044'
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.roleList = res.data
            this.fnCallAPI()
          }
        }
      })
    },
    fnCallAPI() {
      requestApi({
        url: this.retrieveApi,
        headers: {
          'X-MID': 'P00044'
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            this.originPhoneNo = _.cloneDeep(this.dataObj.usrPhoneNo)
            this.usrSeq = _.cloneDeep(this.dataObj.usrSeq)
            if (this.dataObj.usrEmail !== null) {
              var emailStr = this.dataObj.usrEmail.split('@')
              this.emailAddr = emailStr[0]
              this.emailCorps = emailStr[1]
            }
            // this.fnMakeOrgData()
          }
        }
      })
    },
    updateData() {
      var paramObj = {}
      paramObj.usrNm = this.dataObj.usrNm
      paramObj.usrPhoneNo = this.dataObj.usrPhoneNo
      paramObj.usrEmail = this.emailAddress
      paramObj.orgSeq = this.dataObj.orgSeq
      paramObj.usrSeq = this.dataObj.usrSeq
      paramObj.roleCdId = this.dataObj.roleCdId
      paramObj.smsRcvNo = this.dataObj.smsRcvNo
      paramObj.roleUpdateYn = 'N'
      if (!this.pwChkFlag) {
        paramObj.usrPwd = btoa(unescape(encodeURIComponent(this.usrPwd)))
        paramObj.preUsrPwd = btoa(unescape(encodeURIComponent(this.preUsrPwd)))
      }
      requestApi({
        url: this.updateApi,
        headers: {
          'X-MID': 'P00044'
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (!this.pwChkFlag) {
              this.fnPwChg()
            }
            this.logoutPopup()
          }
        }
      })
    },
    logoutPopup () {
      this.alert(this.$t('noti-logout')).then(() => {
        logout()
      })
    },
    fnEmailchk(value) {
      var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      if (value === null || value === '') {
        return true
      } else {
        if (value.match(regExp) != null) {
          return true
        } else {
          return false
        }
      }
    },
    fnLangChk (char) {
      return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z_-]{2,33}/.test(char)
    },
    fnPwChk() {
      if (!this.pwChkFlag) {
        if (this.usrPwdChk === this.usrPwd) {
          if (this.usrPwd === '') {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else {
        return true
      }
    },
    fnPhoneNumChk (num) {
      var passRule = /^[0-9]{9,11}$/
      return passRule.test(num)
    },
    fnBlankCheck (content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined || content === null) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnSearchOrg: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/custusr/user/UsersOrganizationSvc'),
          title: this.$t('user-org'),
          width: '500',
          data: { 'orgSeq': this.dataObj.orgSeq },
          callback: (data) => {
            if (data !== 'dismiss') {
              this.dataObj.orgSeq = data.orgSeq
              this.dataObj.orgNm = data.orgNm
            }
          }
        })
      }, 1000, { 'trailing': false }
    ),
    submit () {
      if (!this.fnBlankCheck(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-input'), 'warning')
      } else if (!/^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-spc-char'), 'warning')
      } else if (!this.fnLangChk(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-length-chk'), 'warning')
      } else if (!this.fnBlankCheck(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-input'), 'warning')
      } else if (!this.fnPhoneNumChk(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-chk'), 'warning')
      } else if (!this.phoneDuplFlag) {
        this.alert(this.$t('user-phone-dupl-chk'), 'warning')
      } else if (!this.fnEmailchk(this.emailAddress)) {
        this.alert(this.$t('email-chk'), 'warning')
      } else if (this.emailAddress.length > 50) {
        this.alert(this.$t('email-leng-chk'), 'warning')
      } else if (!this.pwChkFlag) {
        if (this.usrPwd === '') {
          this.alert(this.$t('pw-input-chk'), 'warning')
        } else if (this.preUsrPwd === '') {
          this.alert(this.$t('pw-input-chk'), 'warning')
        } else {
          if (!this.fnPwChk()) {
            this.alert(this.$t('pw-incorrect'), 'warning')
          } else {
            this.confirm(this.$t('saveYn'), this.updateData)
          }
        }
      } else {
        this.confirm(this.$t('saveYn'), this.updateData)
      }
    }
  }
}
</script>

<style lang="less">
.text-color-red {
  color: red;
}
</style>
