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
            :placeholder="this.$t('lead-content')"
            style="width:100%"
            maxlength="100"
          >
          <p class="cmt-value">
            <span class="textarea-value">{{subjectLength}}</span>/100
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('content') }}</span>
        <div class="input-group form-box inner">
          <textarea
            :placeholder="this.$t('lead-content')"
            v-model="postDetail.postContent"
            cols="30"
            rows="5"
            maxlength="2000"
            @keypress="fnInputContent"
            title="내용 입력"
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
        <button @click="fnAddConfirm" type="button" class="btn btn-pink">{{$t('create')}}</button>
        <button @click="close()" type="button" class="btn btn-gray">{{$t('cancle')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import { requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'PostAddSvc',
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
      xMid: 'P00025',
      postDetail: {},
      selectedFiles: []
    }
  },
  created() {
    this.custSeq = '1'
  },
  mounted() {},
  computed: {
    subjectLength() {
      return this.postDetail.subject ? this.postDetail.subject.length : 0
    },
    contentLength() {
      return this.postDetail.postContent
        ? this.postDetail.postContent.length
        : 0
    },
    fileList() {
      if (!this.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.tbIoTBrdFileListDTOlist.filter(file => file.mode !== 'D')
    }
  },
  methods: {
    fnInputContent(e) {
      if (e.target.value > 2000) {
        e.preventDefault()
      }
    },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnAddConfirm() {
      if (!this.postDetail.subject) {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      if (!this.postDetail.postContent) {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }
      this.confirm(this.$t('post-create-confirm'), this.fnAdd)
    },
    fnAdd() {
      let reqData = {
        subject: this.postDetail.subject,
        content: this.postDetail.postContent,
        tbIoTBrdFileListDTOlist: this.tbIoTBrdFileListDTOlist
      }

      requestMultipartJsonObject({
        url: '/online/IotPostBoard/createIotPostBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('success-post'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style></style>
