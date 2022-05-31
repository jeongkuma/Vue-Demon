<template>
  <div>
    <div class="modal-body">
      <div class="mb-1">
        <span class="bold">기본 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{$t('outserver-nm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.serverNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{$t('customer')}}</span>
          <input type="text" class="form-control" v-model="dataObj.custNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{$t('svcNm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.svcNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{$t('dev-cls')}}</span>
          <input type="text" class="form-control" v-model="dataObj.devClsCdNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{$t('dev-mdl')}}</span>
          <input type="text" class="form-control" v-model="dataObj.devMdlCdNm" disabled/>
        </div>
      </div>
      <div class="mb-1 mt-3">
        <span class="bold">전문 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">{{ $t('commuication-gubun') }}</span>
          <input type="text" class="form-control" v-model="dataObj.tranCdNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32 lb-txt">ByPass</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="dataObj.byPassYn" true-value="Y" false-value="N" disabled><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row" v-if="this.dataObj.tranCd === 'GN00000236'">
        <div class="form-item col-lg-4">
          <span class="form-label w-32">실패 시</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryMin" style="width: 50px;" disabled/>
              <span class="bold pl-1">분 후 재시도</span>
            </div>
          </div>
        </div>
        <div class="form-item col-lg-8">
          <span class="form-label w-32">실패 시 다음날</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryT" style="width: 50px;" disabled/>
              <span class="bold px-1">시</span>
              <input type="text" class="form-control" v-model="dataObj.retryM" style="width: 50px;" disabled/>
              <span class="bold pl-1">분에 재시도</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap mt-2">
        <div class="md-width-100 width-50 pl-1 pr-1">
          <div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">제휴사 URI</span>
                <input type="text" class="form-control" v-model="dataObj.uri" disabled/>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">METHOD</span>
                <select name class="form-control" v-model="dataObj.medth" disabled>
                  <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{ item.key }}</option>
                </select>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">HEADER</span>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.head"
                          v-if="this.dataObj.tranCd === 'GN00000236'" disabled/>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.head" v-else disabled/><br/>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">BODY</span>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.body"
                          v-if="this.dataObj.byPassYn === 'Y' && this.dataObj.tranCd ==='GN00000236'" disabled/>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.body" v-else disabled/><br/>
              </div>
            </div>
          </div>
        </div>
        <div class="md-width-100 width-50 pl-1 pr-1">
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">외부 G/W Callback</span>
              <input type="text" class="form-control" v-model="dataObj.callBackUri" disabled/>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">METHOD</span>
              <select name class="form-control" v-model="dataObj.callBackMedth" disabled>
                <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{ item.key }}</option>
              </select>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">HEADER</span>
              <textarea class="form-control" cols="50" rows="4" v-model="dataObj.callBackHead" disabled/>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">BODY</span>
              <textarea class="form-control" cols="50" rows="5" v-model="dataObj.callBackBody" disabled/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >{{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'outsvrmsgh-list',
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
      paramObj: {},
      colNameData: [this.$t('param-key'), this.$t('cd-nm')],
      colModelData: [
        { name: 'paramKey', index: 'paramKey', align: 'left', width: '150' },
        { name: 'cdNm', index: 'cdNm', align: 'left', width: '150' }
      ],
      dataObj: {
        outMsgSetHSeq: '',
        outMsgSetSeq: '',
        custSeq: -1,
        svcCd: '',
        svcNm: '',
        devClsCd: '',
        devMdlCd: '',
        outSvrSeq: '',
        tranCd: 'GN00000236',
        uri: '',
        medth: 'GN00000239',
        head: '',
        body: '',
        callBackUri: '',
        callBackMedth: 'GN00000239',
        callBackHead: '',
        callBackBody: '',
        byPassYn: '',
        retryMin: '',
        retryTM: '',
        retryT: '',
        retryM: ''
      },
      tranList: [
        { value: 'GN00000236', key: '송신' },
        { value: 'GN00000237', key: '수신' }
      ],
      methodList: [
        { value: 'GN00000239', key: 'POST' },
        { value: 'GN00000240', key: 'PUT' }
      ],
      customerList: [],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      outMsgSendInfoList: [],
      outMsgRecieveInfoList: [],
      reportOptList: [],
      failureOptList: [],
      outsvrmsgOriginalObj: {},
      xMid: 'P40044'
    }
  },
  created() {
    this.dataObj.outMsgSetHSeq = this.data.outMsgSetHSeq
    this.dataObj.outMsgSetSeq = this.data.outMsgSetSeq
    this.dataObj.custSeq = this.data.custSeq
    this.fnSearchSetHData()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    fnSearchSetHData() {
      const paramObj = {}
      paramObj.outMsgSetHSeq = this.data.outMsgSetHSeq

      requestApi({
        url: '/online/outsvrmsg/outsvrmsgh',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.outMsgSetHSeq = res.data.outMsgSetHSeq
            this.dataObj.outMsgSetSeq = res.data.outMsgSetSeq
            this.dataObj.custSeq = res.data.custSeq
            this.dataObj.custNm = res.data.custNm
            this.dataObj.svcCd = res.data.svcCd
            this.dataObj.svcNm = res.data.svcNm
            this.dataObj.serverNm = res.data.serverNm
            this.dataObj.devClsCd = res.data.devClsCd
            this.dataObj.devClsCdNm = res.data.devClsCdNm
            this.dataObj.devMdlCd = res.data.devMdlCd
            this.dataObj.devMdlCdNm = res.data.devMdlCdNm
            this.dataObj.tranCd = res.data.tranCd
            this.dataObj.tranCdNm = res.data.tranCdNm
            this.dataObj.uri = res.data.uri
            this.dataObj.medth = res.data.medth
            this.dataObj.head = res.data.head
            this.dataObj.body = res.data.body
            this.dataObj.callBackUri = res.data.callBackUri
            this.dataObj.callBackMedth = res.data.callBackMedth
            this.dataObj.callBackHead = res.data.callBackHead
            this.dataObj.callBackBody = res.data.callBackBody
            this.dataObj.byPassYn = res.data.byPassYn
            this.dataObj.retryMin = res.data.retryMin
            if (res.data.retryTm) {
              this.dataObj.retryT = res.data.retryTm.substring(0, 2)
              this.dataObj.retryM = res.data.retryTm.substring(2, 4)
            }

            // this.fnChangeCustNm()
            // 수정시 변경값을 체크하기 위해서 원본 데이터 보관
            this.outsvrmsgOriginalObj = { ...this.dataObj }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
