<template>
  <div>
    <div class="modal-body">
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="faqDetail.subject"
            type="text"
            class="form-control"
            maxlength="100"
            readonly
          >
        </div>
      </div>

      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{$t('question')}}</span>
        <div class="input-group form-box inner">
          <input
            v-model="faqDetail.question"
            type="text"
            class="form-control"
            maxlength="100"
            readonly
          >
        </div>
      </div>

      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{$t('answer')}}</span>
        <div class="input-group form-box inner">
          <textarea v-model="faqDetail.answer" cols="30" rows="5" class="form-control" readonly></textarea>
        </div>
      </div>

      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('file-attach') }}</span>
        <div class="input-horizontal">
          <div class="fileClass">
            <div v-for="file in tbIoTBrdFileListDTOlist" :key="file.fileListSeq" class="form-file">
              <span class="form-data file-add">
                <a href="javascript:void(0)" @click="fnDownloadFile(file)">{{ file.orgFileName }} [ {{ file.fileSizeLabel }} ]</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="close()" type="button" class="btn btn-pink">{{$t('confirm')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
export default {
  name: 'FaqSvc',
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
      faqDetail: [],
      tbIoTBrdFileListDTOlist: []
    }
  },
  created() {},
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      let reqData = {
        faqSeq: this.data.faqSeq
      }
      requestApi({
        url: '/online/iotfaqboard/retrieveIotFaqBoardDetail',
        headers: {
          'X-MID': 'P00023'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.faqDetail = res.data.faqDetail
          this.tbIoTBrdFileListDTOlist = this.faqDetail.tbIoTBrdFileListDTOlist
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

<style lang="less">
</style>
