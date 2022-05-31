<template>
  <div>
    <div class="modal-body">
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="postDetail.subject"
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
        <div class="input-horizontal form-box">
          <textarea
            v-model="postDetail.content"
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
              <span
                v-if="modifiable"
                class="btn ico-delete remove-field"
                @click="fnFileDelete(file)"
              >
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
  requestMultipartJsonObject,
  requestDownloadApi
} from '@/api/ccp/requestApi'

export default {
  name: 'PostModifySvc',
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
      xMid: 'P00026',
      postList: [],
      postDetail: {},
      selectedFiles: [],
      postSeq: '',
      loginId: null,
      adminId: 'GN00000033', // 시스템 관리자 공통코드 하드코딩
      roleCdId: null
    }
  },
  computed: {
    subjectLength() {
      return this.postDetail.subject ? this.postDetail.subject.length : 0
    },
    contentLength() {
      return this.postDetail.content ? this.postDetail.content.length : 0
    },
    fileList() {
      if (!this.postDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.postDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
    },
    modifiable() {
      if (!this.postDetail.loginUserId) {
        return false
      }
      return this.postDetail.loginUserId === this.postDetail.regUsrId ||
        this.roleCdId === this.adminId
    }
  },
  mounted() {
    this.fnGetPost()
  },
  methods: {
    fnGetPost() {
      let reqData = {
        postSeq: this.data.post.postSeq
      }
      requestApi({
        url: '/online/IotPostBoard/retrieveIotPostBoardDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginUserId
          this.postDetail = res.data
          this.tbIoTBrdFileListDTOlist = res.data.tbIoTBrdFileListDTOlist
        }
      })
    },
    fnInputContent(e) {
      if (e.target.value > 2000) {
        e.preventDefault()
      }
    },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnModifyConfirm() {
      if (!this.postDetail.subject) {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      if (!this.postDetail.content) {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }
      this.confirm(this.$t('post-modify-confirm'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        postSeq: this.postDetail.postSeq,
        subject: this.postDetail.subject,
        content: this.postDetail.content,
        tbIoTPostBrdFileListDTOlist: this.postDetail.tbIoTBrdFileListDTOlist
      }

      requestMultipartJsonObject({
        url: '/online/IotPostBoard/updateIotPostBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
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

<style></style>
