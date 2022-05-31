<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('cust-lgn-id') }}</span>
          <div class="input-group">
            <input
              v-model="formData.custLoginId"
              type="text"
              class="form-control"
              @input="fnChangeDuplicate('custLoginId')"
              maxlength="20"
            />
            <button type="button" class="btn btn-gray" @click="fnCheckDuplicateCustLoginId">
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('cust-nm') }}</span>
          <div class="input-group">
            <input
              v-model="formData.custNm"
              type="text"
              class="form-control"
              @input="fnChangeDuplicate('custNm')"
              maxlength="33"
            />
            <button type="button" class="btn btn-gray" @click="fnCheckDuplicateCustNm">
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('svc-type') }}</span>
          <select v-model="formData.svcCd" class="form-control">
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="(svc, index) in view.svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
            >
              {{ svc.svcCdNm }}
            </option>
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{
            $t('cust-contact-number')
          }}</span>
          <input
            v-model="formData.custTelNo"
            type="text"
            class="form-control"
            :placeholder="view.placeholder"
            maxlength="11"
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('lgn-check-step') }}</span>
          <select
            class="form-control"
            v-model="formData.loginStepCnt"
          >
            <option value="">{{ $t('select') }}</option>
            <option value="1">1단계</option>
            <option value="2">2단계</option>
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('cust-reg-no') }}</span>
          <input
            v-model="formData.custRegNo"
            type="text"
            class="form-control"
            :placeholder="view.placeholder"
            maxlength="10"
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('cust_wlogo_file') }}</span>
          <input
            type="file"
            name="custWlogoFile"
            class="file-upload"
            ref="wLogoFile"
            :placeholder="view.placeholderFile"
            @change="fnChangeWlogoFile"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('cust_mlogo_file') }}</span>
          <input
            type="file"
            name="custMlogoFile"
            class="file-upload"
            ref="mLogoFile"
            :placeholder="view.placeholderFile"
            @change="fnChangeMlogoFile"
          />
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40"></span>
        <div class="input-horizontal">
          <div>&nbsp; ※ {{ $t('img-def-px') }}</div>
          <div>&nbsp; ※ {{ $t('img-def-msg') }}</div>
        </div>
      </div>
      <div class="mt-3">
        <div class="titH4">{{ $t('admin-reg') }}</div>
      </div>
      <div class="form-row row mt-1">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{
            $t('country-admin-id')
          }}</span>
          <input
            v-model="formData.usrLoginId"
            type="text"
            class="form-control"
            maxlength="20"
          />
        </div>
        <div class="form-item col-sm-6">※ {{ $t('user-id-regx') }}</div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('usrNm') }}</span>
          <input
            v-model="formData.usrNm"
            type="text"
            class="form-control"
            maxlength="20"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('contact-number') }}</span>
          <input
            v-model="formData.usrPhoneNo"
            type="text"
            class="form-control"
            :placeholder="view.placeholder"
            maxlength="11"
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-40">{{ $t('email') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="view.usrEmail[0]"
              maxlength="20"
            />
            <span class="input-group-text">@</span>
            <input
              type="text"
              class="form-control"
              v-model="view.usrEmail[1]"
              maxlength="20"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="fnSaveConfirm()" type="button" class="btn btn-pink">{{$t('registration')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestMultipartJsonObject, requestApi } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
import {
  checkKoEnNumber,
  checkEnNumber,
  checkTelNoWithoutDash,
  checkOnlyNum,
  checkEmail
} from '@/utils/comUtils'

export default {
  name: 'CustomerAddSvc',
  props: {
    data: Object,
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
      xMid: 'P00037',
      formData: {
        custLoginId: '',
        custNm: '',
        svcCd: '',
        custTelNo: '',
        loginStepCnt: '',
        custWlogoFile: '',
        custMlogoFile: '',
        custRegNo: '',
        usrLoginId: '',
        usrNm: '',
        usrPhoneNo: '',
        roleCdNm: '고객사전국관리자',
        roleCdId: 'GN00000035',
        usrEmail: '',
        custTypeCdId: ''
      },
      view: {
        usrEmail: [],
        placeholderFile: this.$t('noRecords'),
        placeholder: this.$t('hypen-place-hd'),
        duplicate: {
          custLoginId: false,
          custNm: false
        },
        svcCdList: []
      },
      file: {
        custMlogoFile: null,
        custWlogoFile: null
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetSvcList()
  },
  mounted() {},
  methods: {
    // -------------------- 옵션 조회
    fnGetSvcList() {
      requestApi({
        url: '/online/iotsvc/retrieveIotSvcList',
        headers: { 'X-MID': this.xMid },
        data: { langSet: 'ko' },
        method: 'post',
        callback: res => {
          if (res.result.status === '200') {
            this.view.svcCdList = res.data
          }
        }
      })
    },
    fnChangeDuplicate(key) {
      this.view.duplicate[key] = false
    },
    fnCheckDuplicateCustLoginId() {
      if (!this.formData.custLoginId || this.formData.custLoginId.trim().length === 0) {
        this.alert(this.$t('custId-input-chk'))
        return
      }
      if (!checkEnNumber(this.formData.custLoginId)) {
        this.alert(this.$t('cust-lgn-id-spc-char'))
        return
      }
      if (this.formData.custLoginId.length < 2 || this.formData.custLoginId.length > 20) {
        this.alert(this.$t('cust-id-leng-chk'))
        return
      }

      requestApi({
        url: '/online/iotcust/retrieveDuplicatedCustId',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: { custLoginId: this.formData.custLoginId },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.view.duplicate.custLoginId = true
            this.alert(res.data.msg, 'success')
          }
        }
      })
    },
    fnCheckDuplicateCustNm() {
      if (!this.formData.custLoginId || this.formData.custLoginId.trim().length === 0) {
        this.alert(this.$t('custNm-input-chk'))
        return
      }
      if (!checkKoEnNumber(this.formData.custLoginId)) {
        this.alert(this.$t('cust-nm-spc-char'))
        return
      }
      if (this.formData.custLoginId.length < 2 || this.formData.custLoginId.length > 33) {
        this.alert(this.$t('cust-nm-leng-chk'))
        return
      }

      requestApi({
        url: '/online/iotcust/retrieveDuplicatedCustNm',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: { custNm: this.formData.custNm },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.view.duplicate.custNm = true
            this.alert(res.data.msg, 'success')
          }
        }
      })
    },
    // -------------------- 파일
    fnChangeWlogoFile(event) {
      if (event.target.files.length === 0) {
        this.file.custWlogoFile = null
      }
      let file = event.target.files[0]
      this.file.custWlogoFile = {
        name: file.name,
        file: file
      }
      this.formData.custWlogoFile = file.name
    },
    fnChangeMlogoFile(event) {
      if (event.target.files.length === 0) {
        this.file.custMlogoFile = null
      }
      let file = event.target.files[0]
      this.file.custMlogoFile = {
        name: file.name,
        file: file
      }
      this.formData.custMlogoFile = file.name
    },
    // -------------------- 저장
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      this.formData.custTypeCdId = 'GN00000032' // 회사 유형 코드 - GN00000032: 고객사

      this.formData.usrEmail = this.view.usrEmail.join('@')
      requestMultipartJsonObject({
        url: '/online/iotcust/createIotCust',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: this.formData,
        files: getRequestFileArray([
          this.$refs.wLogoFile,
          this.$refs.mLogoFile]),
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnValidateData() {
      if (!this.formData.custLoginId || this.formData.custLoginId.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('cust-lgn-id')))
        return
      }

      if (!this.view.duplicate.custLoginId) {
        this.alert(this.$t('lead-duplicate-data').replace('$0', this.$t('cust-lgn-id')))
        return
      }

      if (!this.formData.custNm || this.formData.custNm.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('cust-nm')))
        return
      }

      if (!this.view.duplicate.custNm) {
        this.alert(this.$t('lead-duplicate-data').replace('$0', this.$t('cust-nm')))
        return
      }

      if (!this.formData.svcCd || this.formData.svcCd === '') {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('svc-type')))
        return
      }

      if (!this.formData.custTelNo || this.formData.custTelNo.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('cust-contact-number')))
        return
      }

      if (!checkTelNoWithoutDash(this.formData.custTelNo)) {
        this.alert(this.$t('lead-not-valid').replace('$0', this.$t('cust-contact-number')))
        return
      }

      if (!this.formData.loginStepCnt || this.formData.loginStepCnt === '') {
        this.alert(this.$t('lead-not-choosed').replace('$0', this.$t('lgn-check-step')))
        return
      }

      if (!checkOnlyNum(this.formData.custRegNo)) {
        this.alert(this.$t('lead-not-valid').replace('$0', this.$t('cust-reg-no')))
        return
      }

      if (!this.formData.usrLoginId || this.formData.usrLoginId.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('country-admin-id')))
        return
      }

      if (!checkEnNumber(this.formData.usrLoginId)) {
        this.alert(this.$t('adm-user-id-regx-fail'))
        return
      }

      if (this.formData.usrLoginId.length < 2 || this.formData.usrLoginId.length > 20) {
        this.alert(this.$t('admin-user-id-leng-chk'))
        return
      }

      if (!this.formData.usrNm || this.formData.usrNm.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('usrNm')))
        return
      }

      if (!this.formData.usrPhoneNo || this.formData.usrPhoneNo.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('contact-number')))
        return
      }

      if (!checkTelNoWithoutDash(this.formData.usrPhoneNo)) {
        this.alert(this.$t('lead-not-valid').replace('$0', this.$t('contact-number')))
        return
      }

      if (!checkEmail(this.view.usrEmail.join('@'))) {
        this.alert(this.$t('lead-not-valid').replace('$0', this.$t('email')))
        return
      }

      return true
    }
  }
}
</script>

<style></style>
