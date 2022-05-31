<template>
  <div>
    <div class="modal-body">
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="notiDetail.subject"
            type="text"
            class="form-control"
            style="width:100%"
            readonly
          />
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('content') }}</span>
        <div class="input-horizontal form-box">
          <textarea
            v-model="notiDetail.content"
            readonly
            cols="30"
            rows="5"
          ></textarea>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="close()" type="button" class="btn btn-pink">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
export default {
  name: 'NotiDetailSvc',
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
      notiDetail: [],
      tbIoTBrdFileListDTOlist: [],
      fileList: []
    }
  },
  created() {},
  mounted() {
    this.fnGetNoti()
  },
  computed: {},
  methods: {
    fnGetNoti() {
      let reqData = {
        notiSeq: this.data.userNotice.notiSeq
      }
      requestApi({
        url: '/online/iotnotiboard/retrieveIotNotiBoardDetail',
        headers: {
          'X-MID': 'P00021'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.notiDetail = res.data
          this.fileList = this.notiDetail.tbIoTBrdFileListDTOlist
        }
      })
    },
    fnDownloadFile(file) {
      let reqData = {
        fileListSeq: file.fileListSeq
      }
      requestDownloadApi({
        url: '/online/iotnotiboard/downloadFile',
        headers: {
          'X-MID': this.xMid
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
