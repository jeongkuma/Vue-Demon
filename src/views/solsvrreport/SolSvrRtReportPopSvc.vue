<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-28">{{$t('msg-nm')}}</span>
          <input v-model="dataObj.msgNm" type="text" class="form-control" disabled />
        </div>
      </div>
      <div class="form-row row mt-3">
        <div class="md-width-100 width-50 pl-1 pr-1">
          <div class="mb-6">
            <span class="lb-txt">{{$t('msgApiInfo')}}</span>
            <button type="button" class="btn btn-pink pull-right" :disabled="!resendable" @click="fnResend()">{{ $t('re-send') }}</button>
          </div>
          <jqgrid
            ref="grid"
            name="solSvrRtReportPop"
            :colModels="colModelData"
            :colNames="colNameData"
            :dataList="dataList"
            :totalPage.sync="totPage"
            :currentPage.sync="currentPage"
            :rowNum.sync="displayRowCount"
            :width="300"
            :multiselect="false"
            @onCellSelect="fnGetMsgDetail"
            @getDataList="fnGetList"
          >
          </jqgrid>
        </div>
        <div class="md-width-100 width-50 pl-1 pr-1">
          <div class="mb-6">
            <span class="lb-txt">{{$t('msgApiInfoDetail')}}</span>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-20">요청시간</span>
              <input type="text" class="form-control" :value="prettyBlank(dataObj.reqDttm)" disabled />
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-20">요청전문</span>
              <textarea class="form-control" rows="10" :value="prettyBlank(dataObj.reqMsg)" style="resize: none;" disabled></textarea>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-20">응답시간</span>
              <input type="text" class="form-control" :value="prettyBlank(dataObj.resDttm)" disabled />
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-20">응답상태</span>
              <input type="text" class="form-control" :value="prettyBlank(dataObj.statusNm)" disabled />
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-20">응답전문</span>
              <textarea class="form-control" rows="10" :value="prettyBlank(dataObj.resMsg)" style="resize: none;" disabled></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'OutSvrRtReportPopSvc',
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
      dataList: [],
      colNameData: ['송신서버', '수신서버', '시간', '상태', '응답상태', '순번'],
      colModelData: [
        { 'name': 'sendTarget', 'index': 'sendTarget', 'align': 'center', 'width': '100' },
        { 'name': 'receiveTarget', 'index': 'receiveTarget', 'align': 'center', 'width': '100' },
        { 'name': 'firstDttm', 'index': 'firstDttm', 'align': 'center', 'width': '150' },
        { 'name': 'successYn', 'index': 'successYn', 'align': 'center', 'width': '50' },
        { 'name': 'status', 'index': 'status', 'align': 'center', hidden: true },
        { 'name': 'solMsgHistSeq', 'index': 'solMsgHistSeq', 'align': 'center', hidden: true }
      ],
      showYn: true,
      solSvrRtReportList: [],
      currentPage: 1,
      displayRowCount: 15,
      rowNum: 15,
      excelFlag: null,
      popUpYn: 'Y',
      resendYn: false,
      gridId: null,
      dataObj: {
        solMsgHistSeq: '',
        firstDttm: '',
        msgNm: '',
        reqDttm: '',
        reqMsg: '',
        resDttm: '',
        statusNm: '',
        resMsg: ''
      },
      xMid: 'P5020',
      totPage: 0
    }
  },
  created () {
    this.dataObj = this.data.idx
    // this.detail = this.data.detail
    this.dataObj.reqMsg = this.formatReqMsg(this.data.detail)
    this.fnGetList()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  computed: {
    resendable() {
      let dataList = this.dataList || []
      let filtered = dataList.filter(r => r.status === '실패')
      return (
        filtered.length > 0 &&
        this.dataObj.tranNm === '송신' &&
        this.dataObj.successYn === '실패'
      )
    }
  },
  methods: {
    fnGetMsgDetail(id, index, contents, event) {
      let data = this.dataList[id]
      const paramObj = {}
      paramObj.firstDttm = data.firstDttm
      paramObj.solMsgHistSeq = data.solMsgHistSeq
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgHistDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data) {
              this.dataObj = res.data.dataObj
              this.dataObj.reqMsg = this.formatReqMsg(res.data.dataObj)
            }
          }
        }
      })
    },
    formatReqMsg(dataObj) {
      let reqMsg = ''
      reqMsg = reqMsg.concat('[URI] ', dataObj.reqUri, '\n\n', '[HEADER] ', dataObj.reqHeader, '\n\n', '[BODY] ', dataObj.reqBody, '\n')
      return reqMsg
    },
    fnSearchList() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnGetList () {
      let context = this
      this.dataObj.currentPage = this.currentPage
      this.dataObj.displayRowCount = this.displayRowCount
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgHistListPop',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.dataObj,
        callback: (data) => {
          context.dataList = data.data.solSvrMsgHistList
          context.totPage = data.data.page.totPage
          context.currentPage = data.data.page.page
        }
      })
    },
    fnResend() {
      let reqData = {}
      let paramsObj = []
      let data = this.$refs.grid.getRowData()
      for (let i = 0; i < data.length; i++) {
        paramsObj.push(data[i].solMsgHistSeq)
      }
      reqData.solMsgHistSeqList = paramsObj
      requestApi({
        url: '/online/solsvrmsg/solSvrReSend',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: (res) => {
          if (res.data === 'Y') {
            this.alert(this.$t('resend-success'), 'success')
          } else {
            this.alert(this.$t('resend-fail'), 'warning')
          }
        }
      })
    },
    prettyBlank(value) {
      return value || '-'
    }
  }
}
</script>

<style lang="less">
</style>
