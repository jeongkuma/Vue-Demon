<template>
  <div>
    <div class="modal-body">
      <div class="form-item col-sm-6">
        <span class="form-label w-32 lb-txt">{{ $t('category') }}</span>
        <select v-model="categoryType" class="form-control">
          <option
            v-for="category in categoryList"
            :key="category.categoryCdId"
            :value="category.categoryCdId"
          >{{category.categoryCdNm}}</option>
        </select>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="faqDetail.subject"
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
        <span class="form-label w-32 lb-txt">{{$t('question')}}</span>
        <div class="input-group form-box inner">
          <input
            v-model="faqDetail.question"
            type="text"
            class="form-control"
            :placeholder="this.$t('lead-content')"
          >
          <p class="cmt-value">
            <span class="textarea-value">{{questionLength}}</span>/100
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{$t('answer')}}</span>
        <div class="input-horizontal form-box">
          <textarea
            v-model="faqDetail.answer"
            cols="30"
            rows="7"
            maxlength="2000"
            @keypress="fnInputContent"
          ></textarea>
          <p class="cmt-value">
            <span class="textarea-value">{{answerLength}}</span>/2,000
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{$t('interest-question')}}</span>
        <div class="form-check">
          <label class="form-check-label" for="ch1">
            <input
              v-model="faqDetail.interestYn"
              class="form-check-input"
              type="checkbox"
              id="ch1"
              true-value="Y"
              false-value="N"
            >
            <span class="form-check-sign"></span>
          </label>
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
        <button @click="fnAddConfirm" type="button" class="btn btn-pink">{{$t('registration')}}</button>
        <button @click="close" type="button" class="btn btn-gray">{{ $t('close') }}</button>
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
  name: 'FaqAddSvc',
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
      xMid: 'P00034',
      faqDetail: {},
      selectedFiles: [],
      categoryList: []
    }
  },
  created() {
    this.categoryList = this.data.categoryList
    this.categoryType = this.categoryList[0].categoryCdId
  },
  mounted() {},
  computed: {
    subjectLength() {
      return this.faqDetail.subject ? this.faqDetail.subject.length : 0
    },
    questionLength() {
      return this.faqDetail.question ? this.faqDetail.question.length : 0
    },
    answerLength() {
      return this.faqDetail.answer ? this.faqDetail.answer.length : 0
    },
    fileList() {
      if (!this.faqDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.faqDetail.tbIoTBrdFileListDTOlist.filter(
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
        url: '/online/iotfaqboard/downloadFile',
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
      this.confirm(this.$t('confirm-faq'), this.fnAdd)
    },
    fnAdd() {
      let reqData = {
        categoryCdId: this.categoryType,
        faqSeq: this.faqDetail.faqSeq,
        subject: this.faqDetail.subject,
        question: this.faqDetail.question,
        answer: this.faqDetail.answer,
        tbIoTBrdFileListDTOlist: this.faqDetail.tbIoTBrdFileListDTOlist,
        interestYn: this.faqDetail.interestYn
      }

      if (!this.faqDetail.interestYn) {
        reqData.interestYn = 'N'
      }

      requestMultipartJsonObject({
        url: '/online/iotfaqboard/createIotFaqBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('success-faq'), 'success')
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
