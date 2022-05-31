<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('id') }}</span>
          <input
            v-model="dataObj.usrLoginId"
            type="text"
            class="form-control"
            disabled
          />
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('pw') }}</span>
          <input
            v-model="usrPwd"
            type="password"
            class="form-control"
            :readonly="pwChkFlag"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('pw-chk') }}</span>
          <div class="input-group">
            <input
              v-model="usrPwdChk"
              type="password"
              class="form-control"
              :readonly="pwChkFlag"
            />
            <button
              type="button"
              class="btn btn-gray input-group-addon"
              @click="fnPwChg()"
            >
              {{ pwChgTitle }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="w-40"></span>
        <div class="text-color-red">{{ pwValdationTitle }}</div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('usrNm') }}</span>
          <input
            v-model="dataObj.usrNm"
            type="text"
            class="form-control"
            maxlength="33"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('contact-number') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.usrPhoneNo"
              type="text"
              class="form-control"
              :placeholder="placeHolder"
              maxlength="11"
              @input="fnPhoneChgChk()"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="fnPhoneDuplChk()"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('roleNm') }}</span>
          <select class="form-control" v-model="dataObj.roleCdId">
            <option
              v-for="item in roleList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('email') }}</span>
          <div class="input-group">
            <input v-model="emailAddr" type="text" class="form-control" />
            <span class="input-group-text">@</span>
            <input v-model="emailCorps" type="text" class="form-control" />
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('department') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              readonly
              :value="dataObj.orgNm"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="fnSearchOrg()"
            >
              {{ $t('search') }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-for="vpServer in vpServerList"
        :key="vpServer.cdId"
        class="form-row row"
      >
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ vpServer.cdNm }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              readonly
              :key="vpServer.cdId"
              :value="vpServer.showName"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="fnSearchVpUser(vpServer)"
              :disabled="!isVideo"
            >
              {{ $t('vpUserSet') }}
            </button>
          </div>
        </div>
      </div>
      <user-svc-comp
        ref="userSvcComp"
        mid="P00304"
        :usrSeq="data.idx.usrSeq"
        class="mt-3"
        @changeUsrSvcList="changeUsrSvcList"
      ></user-svc-comp>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import UserSvcComp from './UserSvcComp'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'UserModifySvc',
  components: { UserSvcComp },
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
  data() {
    return {
      dataObj: {
        usrLoginId: '',
        usrPwd: null,
        usrNm: null,
        usrPhoneNo: null,
        roleCdNm: null,
        roleCdId: null,
        usrEmail: null,
        orgSeq: null,
        orgNm: null
      },
      retrieveApi: '/online/iotusr/retrieveIotUsrBySeq',
      updateApi: '/online/iotusr/updateIotUsr',
      retrieveIotUsrRoleListAPI: '/online/iotusr/retrieveIotUsrRoleList',
      phoneDuplChkApi: '/online/iotusr/retrieveUsrPhoneDuplChk',
      placeHolder: this.$t('hypen-place-hd'),
      roleList: [],
      emailCorps: '',
      emailAddr: '',
      usrPwdChk: '',
      usrPwd: '',
      pwChkFlag: true,
      phoneDuplFlag: true,
      pwChgTitle: '',
      selectedOrg: {},
      originPhoneNo: null,
      roleUpdateYn: '',
      isVideo: false,
      vpServerList: [
        {
          cdId: '',
          cdNm: '',
          cdOrder: '',
          showName: ''
        }
      ],
      vpUsrList: [],
      xMid: 'P00044'
    }
  },
  created() {
    this.fnMakeRoleData()
    this.pwChgTitle = this.$t('change-pw')
    this.getIotVpServerList()
  },
  mounted() {},
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
    // -------------------- 옵션 및 정보 조회
    fnMakeRoleData() {
      requestApi({
        url: this.retrieveIotUsrRoleListAPI,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.roleList = res.data
            this.fnCallAPI()
          }
        }
      })
    },
    fnCallAPI() {
      var paramObj = {}
      paramObj.usrSeq = this.data.idx.usrSeq
      requestApi({
        url: this.retrieveApi,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            this.originPhoneNo = _.cloneDeep(this.dataObj.usrPhoneNo)
            if (this.dataObj.usrEmail !== null) {
              var emailStr = this.dataObj.usrEmail.split('@')
              this.emailAddr = emailStr[0]
              this.emailCorps = emailStr[1]
            }
            res.data.vpUsrList.forEach(vpUsr => {
              this.vpServerList.forEach(server => {
                if (vpUsr.serverCd === server.cdId) {
                  if (!vpUsr.usrNm) {
                    vpUsr.usrNm = 'Noname'
                  }
                  server.showName = vpUsr.usrNm + '(' + vpUsr.usrLoginId + ')'
                  this.vpUsrList.push(vpUsr)
                }
              })
            })
            this.fnGetOrgSvc()
          }
        }
      })
    },
    getIotVpServerList() {
      getCommonCodeByParentCdId({ parentCdId: 'GN00000366' }).then(data => {
        data.forEach(cd => {
          cd.showName = ''
        })
        this.vpServerList = data
      })
    },
    // -------------------- 화면 액션
    fnPwChg() {
      this.pwChkFlag = !this.pwChkFlag
      if (!this.pwChkFlag) {
        this.pwChgTitle = this.$t('change-pw-cancel')
      } else {
        this.pwChgTitle = this.$t('change-pw')
        this.usrPwdChk = ''
        this.usrPwd = ''
      }
    },
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
            'X-MID': this.xMid
          },
          method: 'post',
          data: {
            usrPhoneNo: this.dataObj.usrPhoneNo,
            usrSeq: this.data.idx.usrSeq
          },
          callback: res => {
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
    fnSearchOrg: _.throttle(
      function() {
        this.popup({
          component: () => import('@/views/custusr/user/UsersOrganizationSvc'),
          title: this.$t('user-org'),
          width: '500',
          height: '450',
          data: { orgSeq: this.dataObj.orgSeq, custSeq: this.dataObj.custSeq },
          callback: data => {
            if (data !== 'dismiss') {
              this.dataObj.orgSeq = data.orgSeq
              this.dataObj.orgNm = data.orgNm
              // 조직 변경 시 조직의 대표 서비스를 조회 하여 추가한다.
              this.fnGetOrgSvc()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnGetOrgSvc() {
      requestApi({
        url: '/online/iotorg/retrieveSvcCdByOrg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { orgSeq: this.dataObj.orgSeq },
        callback: res => {
          if (res.data.svcCd) {
            this.$refs.userSvcComp.fnAddSvcOrgSeq({
              svcCd: res.data.svcCd,
              svcCdNm: res.data.svcCdNm
            })
          }
        }
      })
    },
    fnSearchVpUser: _.throttle(
      function(object) {
        this.popup({
          component: () => import('@/views/custusr/user/VpUserListSvc'),
          title: this.$t(object.cdNm) + ' ' + this.$t('vpUserSet'),
          width: '700',
          height: '650',
          data: {
            serverCd: object.cdId,
            xMid: this.xMid
          },
          callback: data => {
            if (data !== 'dismiss') {
              let tmpList = this.vpServerList
              tmpList.forEach(server => {
                if (server.cdId === data.serverCd) {
                  server.showName = data.showName
                  let chkList = this.vpUsrList.filter(
                    vpUsr => vpUsr.serverCd !== data.serverCd
                  )
                  chkList.push(data)
                  this.vpUsrList = chkList
                }
              })
              this.vpServerList = tmpList
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    changeUsrSvcList(usrSvcList) {
      if (usrSvcList.find(s => s.svcCd === 'SD00000400')) {
        this.isVideo = true
      } else {
        this.isVideo = false
        this.vpUsrList = []
        this.vpServerList.forEach(server => {
          server.showName = ''
        })
      }
    },
    // -------------------- 저장
    submit() {
      if (!this.pwChkFlag && this.usrPwd === '') {
        this.alert(this.$t('pw-input-chk'), 'warning')
        return
      }
      if (!this.pwChkFlag && !this.fnPwChk()) {
        this.alert(this.$t('pw-incorrect'), 'warning')
        return
      }

      if (!this.fnBlankCheck(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-input'), 'warning')
        return
      }
      if (!/^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-spc-char'), 'warning')
        return
      }
      if (!this.fnLangChk(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-length-chk'), 'warning')
        return
      }
      if (!this.fnBlankCheck(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-input'), 'warning')
        return
      }
      if (!this.fnPhoneNumChk(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-chk'), 'warning')
        return
      }
      if (!this.phoneDuplFlag) {
        this.alert(this.$t('user-phone-dupl-chk'), 'warning')
        return
      }
      if (!this.fnEmailchk(this.emailAddress)) {
        this.alert(this.$t('email-chk'), 'warning')
        return
      }
      if (this.emailAddress.length > 50) {
        this.alert(this.$t('email-leng-chk'), 'warning')
        return
      }

      this.confirm(this.$t('saveYn'), this.confirmCallback)
    },
    confirmCallback() {
      var paramObj = {}
      paramObj.usrNm = this.dataObj.usrNm
      paramObj.usrPhoneNo = this.dataObj.usrPhoneNo
      paramObj.usrEmail = this.emailAddress
      paramObj.orgSeq = this.dataObj.orgSeq
      paramObj.usrSeq = this.dataObj.usrSeq
      paramObj.roleCdId = this.dataObj.roleCdId
      paramObj.smsRcvNo = this.dataObj.smsRcvNo
      paramObj.roleUpdateYn = 'Y'
      if (!this.pwChkFlag) {
        paramObj.usrPwd = btoa(unescape(encodeURIComponent(this.usrPwd)))
      }
      paramObj.usrSvcArr = this.$refs.userSvcComp.fnGetUserSvcList()
      paramObj.vpUsrList = this.vpUsrList
      requestApi({
        url: this.updateApi,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    // -------------------- 검증
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
    fnPhoneNumChk(num) {
      return /^[0-9]{10,11}$/.test(num)
    },
    fnLangChk(char) {
      return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z_-]{2,33}/.test(char)
    },
    fnBlankCheck(content) {
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
    fnPwRegChk(pw) {
      var check = false
      // check = /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}|(?=.*\\d{3,})(?=.*[$@$!%*#?&])[\\d$@$!%*#?&]{10,}|(?=.*[A-Za-z])(?=.*[$@$!%*#?&])[A-Za-z$@$!%*#?&]{10,}|(?=.*[A-Za-z])(?=.*\\d{3,})[A-Za-z\\d]{10,}$/.test(pw)
      check = /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}/.test(
        pw
      )
      if (!check) {
        check = /^(?=.*\\d{3,})(?=.*[$@$!%*#?&])[\\d$@$!%*#?&]{10,}/.test(pw)
        if (!check) {
          check = /^(?=.*[A-Za-z])(?=.*[$@$!%*#?&])[A-Za-z$@$!%*#?&]{10,}/.test(
            pw
          )
          if (!check) {
            check = /^(?=.*[A-Za-z])(?=.*\\d{3,})[A-Za-z\\d]{10,}/.test(pw)
          } else {
            return check
          }
        } else {
          return check
        }
      } else {
        return check
      }
      return check
    }
  }
}
</script>

<style lang="less">
.text-color-red {
  color: red;
}
</style>
