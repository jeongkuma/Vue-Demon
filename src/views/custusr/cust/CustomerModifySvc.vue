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
              maxlength="20"
              :disabled="true"
            />
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
          <input v-model="formData.svcCdNm" type="text" class="form-control" :disabled="true" />
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
          <span class="form-label w-40 lb-txt">{{ $t('useYn') }}</span>
          <select v-model="formData.useYn" class="form-control">
            <option v-for="item in view.useOptList" :key="item.cdId" :value="item.cdId">
              {{item.cdNm}}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('cust_wlogo_file') }}</span>
          <input
            v-if="!view.uploadedFile.custWlogoFile"
            type="file"
            name="custWlogoFile"
            class="file-upload"
            ref="wLogoFile"
            :placeholder="view.placeholderFile"
            @change="fnChangeWlogoFile"
          />
          <div v-else>
            <span class="form-data file-add">
              <a href="javascript:void(0)" @click="fnDownloadLogo(view.uploadedFile.custWlogoFile.fileListSeq)">
                {{view.uploadedFile.custWlogoFile.orgFileName}} [{{view.uploadedFile.custWlogoFile.fileSizeLabel}}]
              </a>
            </span>
            <span @click="fnDeleteFile(view.uploadedFile.custWlogoFile.fileListSeq, 'custWlogoFile')"><a href="#" class="btn ico-delete remove-field"></a></span>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('cust_mlogo_file') }}</span>
          <input
            v-if="!view.uploadedFile.custMlogoFile"
            type="file"
            name="custMlogoFile"
            class="file-upload"
            ref="mLogoFile"
            :placeholder="view.placeholderFile"
            @change="fnChangeMlogoFile"
          />
          <div v-else>
            <span class="form-data file-add">
              <a href="javascript:void(0)" @click="fnDownloadLogo(view.uploadedFile.custMlogoFile.fileListSeq)">
                {{view.uploadedFile.custMlogoFile.orgFileName}} [{{view.uploadedFile.custMlogoFile.fileSizeLabel}}]
              </a>
            </span>
            <span @click="fnDeleteFile(view.uploadedFile.custMlogoFile.fileListSeq, 'custMlogoFile')"><a href="#" class="btn ico-delete remove-field"></a></span>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40"></span>
        <div class="input-horizontal">
          <div>※ {{ $t('img-def-px') }}</div>
          <div>※ {{ $t('img-def-msg') }}</div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-40">{{$t('country-admin')}}</span>
          <input
            v-model="formData.usrNm"
            type="text"
            class="form-control"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="fnSaveConfirm" type="button" class="btn btn-pink">{{$t('modify')}}</button>
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestMultipartJsonObject, requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'
import {
  checkKoEnNumber,
  checkTelNoWithoutDash,
  checkOnlyNum
} from '@/utils/comUtils'

export default {
  name: 'CustomerModifySvc',
  components: {},
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
      xMid: 'P00038',
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
        usrEmail: '',
        custTypeCdId: '',
        deleteSeq: []
      },
      view: {
        placeholderFile: this.$t('noRecords'),
        placeholder: this.$t('hypen-place-hd'),
        duplicate: {
          custNm: false
        },
        useOptList: [
          { cdNm: this.$t('registerd'), cdId: 'Y' },
          { cdNm: this.$t('unregisterd'), cdId: 'N' }
        ],
        uploadedFile: {
          custMlogoFile: null,
          custWlogoFile: null
        }
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
  },
  mounted() {
    this.fnGetData()
  },
  methods: {
    // -------------------- 조회
    fnGetData() {
      let reqData = {
        custSeq: this.data.custSeq
      }
      requestApi({
        url: '/online/iotcust/retrieveIotCustBySeq',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.formData = res.data.data
            if (res.data.file && res.data.file.length > 0) {
              this.view.uploadedFile.custMlogoFile = res.data.file.find(f => f.orgFileName === this.formData.custMlogoFile)
              this.view.uploadedFile.custWlogoFile = res.data.file.find(f => f.orgFileName === this.formData.custWlogoFile)
            }
            this.formData.deleteSeq = []
            // 고개사 정보 조회 해왔으므로 중복 확인 true로 세팅
            this.view.duplicate.custNm = true
          }
        }
      })
    },
    fnChangeDuplicate(key) {
      this.view.duplicate[key] = false
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
    fnDeleteFile(fileSeq, key) {
      if (this.formData.deleteSeq.includes(fileSeq)) {
        return
      }

      this.formData.deleteSeq.push(fileSeq)
      this.view.uploadedFile[key] = null
    },
    fnDownloadLogo(fileSeq) {
      let reqData = {
        fileListSeq: fileSeq
      }
      requestDownloadApi({
        url: '/online/iotcust/downloadLogo',
        headers: { 'X-MID': this.xMid },
        data: reqData,
        callback: (data) => {}
      })
    },
    // -------------------- 저장
    fnSaveConfirm() {
      if (!this.fnValidate()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      let reqData = Object.assign({}, this.formData)

      // API 등록시 지원하지 않으므로 제거
      delete reqData.usrNm

      requestMultipartJsonObject({
        url: '/online/iotcust/updateIotCust',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData,
        files: getRequestFileArray([
          this.$refs.wLogoFile,
          this.$refs.mLogoFile]),
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnValidate() {
      if (!this.formData.custNm || this.formData.custNm.trim().length === 0) {
        this.alert(this.$t('lead-not-inputed').replace('$0', this.$t('cust-nm')))
        return
      }

      if (!this.view.duplicate.custNm) {
        this.alert(this.$t('lead-duplicate-data').replace('$0', this.$t('cust-nm')))
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

      return true
    }
  }
}
</script>

<style></style>
