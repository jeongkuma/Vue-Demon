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
          >
          <p class="cmt-value">
            <span class="textarea-value">{{subjectLength}}</span>/100
          </p>
        </div>
      </div>

      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('content') }}</span>
        <div class="input-horizontal form-box">
          <textarea
            v-model="libDetail.content"
            cols="30"
            rows="7"
            maxlength="2000"
            @keypress="fnInputContent"
          ></textarea>
          <p class="cmt-value">
            <span class="textarea-value">{{contentLength}}</span>/2,000
          </p>
        </div>
      </div>

      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('file-attach') }}</span>
        <div class="input-horizontal">
          <div class="fileClass">
            <div v-for="file in fileList" :key="file.fileListSeq" class="form-file">
              <span>{{ file.orgFileName }} [ {{ file.fileSizeLabel }} ]</span>
              <span class="form-data file-add" v-on:click="fnDownloadFile(file)">
                <a href="#">{{ $t('attach-file') }}</a>
              </span>
              <span v-on:click="fnFileDelete(file)">
                <a href="#" class="btn ico-delete remove-field"></a>
              </span>
            </div>
          </div>
          <multi-file-select :fileList.sync="selectedFiles" :maxSize="5"></multi-file-select>
          <div>{{ $t('board-max-size') }}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="fnAddConfirm">{{$t('create')}}</button>
        <button @click="close()" type="button" class="btn btn-gray">{{$t('cancle')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import {
  requestMultipartJsonObject,
  requestDownloadApi
} from '@/api/ccp/requestApi'

export default {
  name: 'LibAddSvc',
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
      xMid: 'P00028',
      libDetail: {},
      selectedFiles: []
    }
  },
  created() {},
  mounted() {},
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
    }
  },
  methods: {
    fnInputContent(e) {
      if (e.target.value > 2000) {
        e.preventDefault()
      }
    },
    fnDownloadFile(file) {
      let reqData = {
        fileListSeq: file.fileListSeq
      }
      requestDownloadApi({
        url: '/online/IotlibraryBoard/downloadFile',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: data => {}
      })
    },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnAddConfirm() {
      if (this.libDetail.subject === '' || this.libDetail.subject === null) {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      if (this.libDetail.content === '' || this.libDetail.content === null) {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }
      this.confirm(this.$t('library-create-confirm'), this.fnAdd)
    },
    fnAdd() {
      let reqData = {
        subject: this.libDetail.subject,
        content: this.libDetail.content,
        tbIoTBrdFileListDTOlist: this.libDetail.tbIoTBrdFileListDTOlist
      }
      requestMultipartJsonObject({
        url: '/online/IotlibraryBoard/createIotLibBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('success-lib'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
