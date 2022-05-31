<template>
  <div>
    <div class="modal-body">
      <div class="mb-1">
        <span class="lb-txt">기본 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('outserver-nm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.serverNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('customer')}}</span>
          <input type="text" class="form-control" v-model="dataObj.custNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('svcNm')}}</span>
          <input type="text" class="form-control" v-model="dataObj.svcNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('dev-cls')}}</span>
          <input type="text" class="form-control" v-model="dataObj.devClsCdNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('dev-mdl')}}</span>
          <input type="text" class="form-control" v-model="dataObj.devMdlCdNm" disabled/>
        </div>
      </div>
      <div class="mb-1 mt-3">
        <span class="lb-txt">전문 정보</span>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">{{$t('commuication-gubun')}}</span>
          <input type="text" class="form-control" v-model="dataObj.tranCdNm" disabled/>
        </div>
        <div class="form-item col-sm-4 col-md-4 col-lg-4">
          <span class="form-label w-32">ByPass</span>
          <div class="form-check">
            <label class="form-check-label"><input class="form-check-input" type="checkbox" v-model="dataObj.byPassYn" true-value="Y" false-value="N"><span class="form-check-sign"></span></label>
          </div>
        </div>
      </div>
      <div class="form-row row" v-if="this.dataObj.tranCd === 'GN00000236'">
        <div class="form-item col-lg-4">
          <span class="form-label w-32">실패 시</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryMin" style="width: 50px;"/>
              <span class="bold pl-1">분 후 재시도</span>
            </div>
          </div>
        </div>
        <div class="form-item col-lg-8">
          <span class="form-label w-32">실패 시 다음날</span>
          <div class="form-inline">
            <div class="input-group">
              <input type="text" class="form-control" v-model="dataObj.retryT" style="width: 50px;"/>
              <span class="bold px-1">시</span>
              <input type="text" class="form-control" v-model="dataObj.retryM" style="width: 50px;"/>
              <span class="bold pl-1">분에 재시도</span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row mt-3">
        <div class="md-width-100 width-30 pl-1 pr-1">
          <div v-show="this.dataObj.tranCd === 'GN00000236'">
            <div class="mb-1">
              <span class="lb-txt">수집 속성 정보</span>
            </div>
            <jqgrid
              ref="grid"
              name="dataListSend"
              :colModels="colModelList"
              :colNames="colNameList"
              :dataList="dataListSend"
              :width="300"
              :multiselect="false"
              @getDataList="fnGetdataListSend"
            >
            </jqgrid>
          </div>
          <div v-show="this.dataObj.tranCd === 'GN00000237'">
            <div class="mb-1">
              <span class="lb-txt">제어 속성 정보</span>
            </div>
            <jqgrid
              ref="grid"
              name="dataListReceive"
              :colModels="colModelList"
              :colNames="colNameList"
              :dataList="dataListReceive"
              :width="300"
              :multiselect="false"
              @getDataList="fnGetdataListReceive"
            >
            </jqgrid>
          </div>
        </div>
        <div class="width-70 md-width-100 pl-1 pr-1">
          <div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">제휴사 URI</span>
                <input type="text" class="form-control" v-model="dataObj.uri" />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">METHOD</span>
                <select name class="form-control" v-model="dataObj.medth">
                  <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
                </select>
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">HEADER</span>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.head" v-if="this.dataObj.tranCd === 'GN00000236'"/>
                <textarea class="form-control" cols="50" rows="4" v-model="dataObj.head" v-else disabled/><br />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">BODY</span>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.body" v-if="this.dataObj.byPassYn === 'Y' && this.dataObj.tranCd ==='GN00000236'" disabled/>
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.body" v-else/><br />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">외부 G/W Callback</span>
                <input type="text" class="form-control" v-model="dataObj.callBackUri" />
              </div>
            </div>
            <div class="form-row row">
              <div class="form-item col-sm-12">
                <span class="form-label w-32">METHOD</span>
                <select name class="form-control" v-model="dataObj.callBackMedth">
                  <option v-for="item in methodList" v-bind:key="item.key" :value="item.value">{{item.key}}</option>
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
                <textarea class="form-control" cols="50" rows="5" v-model="dataObj.callBackBody" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button @click="fnModOutSvr()" type="button" class="btn btn-pink">{{$t('modify')}}</button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >{{$t('cancel')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'outsvrmsg-update',
  components: {
    Jqgrid
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
      paramObj: {},
      colNameList: [this.$t('param-key'), this.$t('cd-nm')],
      colModelList: [
        { name: 'paramKey', index: 'paramKey', align: 'left' },
        { name: 'cdNm', index: 'cdNm', align: 'left' }
      ],
      dataObj: {
        outMsgSetSeq: '',
        custSeq: -1,
        svcCd: '',
        svcNm: '',
        devClsCd: '',
        devClsCdNm: '',
        devMdlCd: '',
        devMdlCdNm: '',
        outSvrSeq: '',
        tranCd: 'GN00000236',
        tranCdNm: '',
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
      devClsList: [],
      devMdlList: [],
      dataListSend: [],
      dataListReceive: [],
      reportOptList: [],
      failureOptList: [],
      outsvrmsgOriginalObj: {},
      svcCdList: [],
      svcCd: '',
      xMid: 'P40042'
    }
  },
  watch: {
    // svcCd() {
    //   this.fnGetDevClsList()
    // }
  },
  created() {
    this.dataObj.outMsgSetSeq = this.data.outMsgSetSeq
    this.dataObj.custSeq = this.data.custSeq
    this.fnSearchModifyData()
    this.fnGetdataListSend()
    this.fnGetdataListReceive()
  },
  mounted() {
  },
  computed: {
    unique() {
      return function(arr, key) {
        var output = []
        var usedKeys = {}
        for (var i = 0; i < arr.length; i++) {
          if (!usedKeys[arr[i][key]]) {
            usedKeys[arr[i][key]] = true
            output.push(arr[i])
          }
        }
        return output
      }
    }
  },
  methods: {
    fnSearchModifyData() {
      const paramObj = {}
      paramObj.outMsgSetSeq = this.data.outMsgSetSeq

      requestApi({
        url: '/online/outsvrmsg/outsvrmsg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj.outMsgSetSeq = res.data.outMsgSetSeq
            this.dataObj.outSvrSeq = res.data.outSvrSeq
            this.dataObj.serverNm = res.data.serverNm
            this.dataObj.svcCd = res.data.svcCd
            this.dataObj.svcNm = res.data.svcNm
            this.dataObj.custSeq = res.data.custSeq
            this.dataObj.custNm = res.data.custNm
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
            this.svcCd = res.data.svcCd

            // this.fnChangeCustNm()  - xxxxxxxxx 고객사 목록 조회 제거
            // 수정시 변경값을 체크하기 위해서 원본 데이터 보관
            this.outsvrmsgOriginalObj = { ...this.dataObj }
          }
        }
      })
    },
    fnGetdataListSend() {
      const paramObj = {}

      requestApi({
        url: '/online/outsvrmsg/getOutMsgSendInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.dataListSend = res.data.data
        }
      })
    },
    fnGetdataListReceive() {
      const paramObj = {}

      requestApi({
        url: '/online/outsvrmsg/getOutMsgRecieveInfo',
        headers: {
          'X-MID': 'P40042'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.dataListReceive = res.data.data
        }
      })
    },
    fnModOutSvr() {
      if (this.dataObj.custSeq === -1) {
        this.alert(this.$t('cust-nm-input'), 'warning')
        return
      }
      if (
        this.dataObj.devClsCd === null ||
        this.dataObj.devClsCd === ''
      ) {
        this.alert(this.$t('request-device-select'), 'warning')
        return
      } else if (
        this.dataObj.devMdlCd === null ||
        this.dataObj.devMdlCd === ''
      ) {
        this.alert(this.$t('sms-dev-model-chk-msg'), 'warning')
        return
      } else if (this.dataObj.tranCd === -1) {
        this.alert(this.$t('trancd-blank-chk'), 'warning')
        return
      } else if (this.dataObj.uri === null || this.dataObj.uri === '') {
        this.alert(this.$t('uri-blank-chk'), 'warning')
        return
      } else if (this.dataObj.medth === null || this.dataObj.medth === '') {
        this.alert(this.$t('medth-blank-chk'), 'warning')
        return
      }

      this.confirm(this.$t('modify-outsvrmsg'), this.confirmCallback)
    },
    confirmCallback() {
      const reqData = {}
      reqData.outMsgSetSeq = this.dataObj.outMsgSetSeq
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      reqData.custSeq = this.dataObj.custSeq
      reqData.svcCd = this.dataObj.svcCd
      reqData.devClsCd = this.dataObj.devClsCd
      reqData.devMdlCd = this.dataObj.devMdlCd
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      reqData.tranCd = this.dataObj.tranCd
      reqData.uri = this.dataObj.uri
      reqData.medth = this.dataObj.medth
      reqData.head = this.dataObj.head
      reqData.body = this.dataObj.body
      reqData.callBackUri = this.dataObj.callBackUri
      reqData.callBackMedth = this.dataObj.callBackMedth
      reqData.callBackHead = this.dataObj.callBackHead
      reqData.callBackBody = this.dataObj.callBackBody
      reqData.svcCd = this.svcCd
      if (this.dataObj.tranCd === 'GN00000236') {
        reqData.byPassYn = this.dataObj.byPassYn
        reqData.retryMin = this.dataObj.retryMin
        reqData.retryTm = this.dataObj.retryT + this.dataObj.retryM
      } else {
        reqData.byPassYn = 'N'
        reqData.retryMin = null
        reqData.retryTm = null
      }

      requestApi({
        url: '/online/outsvrmsg/updateoutsvrmsg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (
            res.result.status === '200' ||
            res.result.status === '204'
          ) {
            this.callback()
            this.alert(this.$t('save-success'), 'success')
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
