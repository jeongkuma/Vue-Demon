<template>
  <div>
    <div class="modal-body">
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="libDetail.subject"
            type="text"
            class="form-control"
            :placeholder="this.$t('lead-title')"
          />
          <p class="cmt-value">
            <span class="textarea-value">{{ subjectLength }}</span
            >/100
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('content') }}</span>
        <div class="input-group form-box inner">
          <textarea
            v-model="libDetail.content"
            cols="30"
            rows="5"
            maxlength="2000"
            :placeholder="this.$t('lead-content')"
            @keypress="fnInputContent"
          ></textarea>
          <p class="cmt-value">
            <span class="textarea-value">{{ contentLength }}</span
            >/2,000
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('file-attach') }}</span>
        <div class="input-horizontal">
          <div class="fileClass">
            <div
              v-for="file in fileList"
              :key="file.fileListSeq"
              class="form-file"
            >
              <span class="form-data file-add">
                <a href="javascript:void(0)" @click="fnDownloadFile(file)">
                  {{ file.orgFileName }} [ {{ file.fileSizeLabel }} ]
                </a>
              </span>
              <span v-if="modifiable">
                <a href="javascript:void(0)" class="btn ico-delete remove-field" @click="fnFileDelete(file)"></a>
              </span>
            </div>
          </div>
          <multi-file-select
            v-if="modifiable"
            :fileList.sync="selectedFiles"
            :maxSize="5"
          ></multi-file-select>
          <div v-if="modifiable">{{ $t('board-max-size') }}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button
          v-if="modifiable"
          @click="fnModifyConfirm"
          type="button"
          class="btn btn-pink"
        >
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
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import {
  requestApi,
  requestDownloadApi,
  requestMultipartJsonObject
} from '@/api/ccp/requestApi'

export default {
  name: 'LibModifySvc',
  components: {
    MultiFileSelect
  },
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
      libDetail: [],
      libSubject: null,
      libContent: null,
      libSeq: '',
      selectedFiles: [],
      regUserId: null,
      // 시스템 관리자 공통코드 하드코딩
      adminId: 'GN00000033',
      loginId: null,
      roleCdId: null
    }
  },
  created() {
    this.libSeq = this.data.lib.libSeq
    this.regUserId = 'cust'
  },
  mounted() {
    this.fnGetLib()
  },
  computed: {
    subjectLength() {
      return this.libDetail.subject ? this.libDetail.subject.length : 0
    },
    contentLength() {
      return this.libDetail.content ? this.libDetail.content.length : 0
    },
    fileList() {
      if (!this.libDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.libDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
    },
    modifiable() {
      if (!this.libDetail.loginUserId) {
        return false
      }
      return this.libDetail.loginUserId === this.libDetail.regUsrId ||
        this.roleCdId === this.adminId
    }
  },
  methods: {
    fnInputContent(e) {
      if (e.target.value > 2000) {
        e.preventDefault()
      }
    },
    fnGetLib() {
      let reqData = {
        libSeq: this.libSeq
      }
      requestApi({
        url: '/online/IotlibraryBoard/retrieveIotLibraryBoardDetail',
        headers: {
          'X-MID': 'P00029',
          'X-APIVERSION': '1'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.libDetail = res.data
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginUserId
          this.tbIoTBrdFileListDTOlist = this.libDetail.tbIoTBrdFileListDTOlist
        }
      })
    },
    fnModifyConfirm() {
      if (!this.libDetail.subject) {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      if (!this.libDetail.content) {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }
      this.confirm(this.$t('library-confirm'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        libSeq: this.libSeq,
        subject: this.libDetail.subject,
        content: this.libDetail.content,
        tbIoTBrdFileListDTOlist: this.tbIoTBrdFileListDTOlist
      }
      requestMultipartJsonObject({
        url: '/online/IotlibraryBoard/updateIotLibBoard',
        headers: {
          'X-MID': 'P00029'
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: data => {
          if (data.result.status === '200') {
            this.selectedFiles = null
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnDownloadFile(file) {
      let reqData = {
        fileListSeq: file.fileListSeq
      }
      requestDownloadApi({
        url: '/online/iotfaqboard/downloadFile',
        headers: {
          'X-MID': 'P00023'
        },
        data: reqData,
        callback: data => {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
