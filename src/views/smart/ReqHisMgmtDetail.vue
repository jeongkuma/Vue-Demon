<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{
            $t('reqhMtLrnPrdMdlNm')
          }}</span>
          <input
            v-model="dataObj.modelNm"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{
            $t('reqhMtLrnPrdServNm')
          }}</span>
          <input
            v-model="dataObj.serverNm"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtDevMdlNm') }}</span>
          <input
            v-model="dataObj.devMdlNm"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtDevUUID') }}</span>
          <input
            v-model="dataObj.devUuid"
            type="text"
            class="form-control"
            readonly
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtReqRes') }}</span>
          <input
            v-model="dataObj.reqRslt"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtResCode') }}</span>
          <input
            v-model="dataObj.resCode"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtReqTime') }}</span>
          <input
            v-model="dataObj.reqTime"
            type="text"
            class="form-control"
            readonly
          />
        </div>
        <div class="form-item col-sm-3">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtResTime') }}</span>
          <input
            v-model="dataObj.resTime"
            type="text"
            class="form-control"
            readonly
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtReqMsg') }}</span>
          <div class="input-group">
            <textarea
              class="form-control"
              v-model="dataObj.reqMsg"
              rows="15"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32 lb-txt">{{ $t('reqhMtResMsg') }}</span>
          <div class="input-group">
            <textarea
              class="form-control"
              v-model="dataObj.resMsg"
              rows="15"
              readonly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'ReqHisMgmtAddSvc',
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
      dataObj: { seq: this.data.obj.seq, modelNm: '', serverNm: '', devMdlNm: '', devUuid: '', reqRslt: '', reqTime: '', resTime: '', reqMsg: '', resMsg: '', resCode: '' },
      xMid: 'P00319'
    }
  },
  watch: {},
  created() {
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    var reqObj = {}
    reqObj.seq = this.data.obj.seq
    this.fnCallApi(reqObj, '/online/bscphis/getBocpHisDtl')
  },
  mounted() {},
  methods: {
    fnCallApi(reqData, uri) {
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
