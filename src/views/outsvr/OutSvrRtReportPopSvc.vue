<template>
  <div>
    <div class="modal-body">
      <div class="flex flex-wrap">
        <!-- 고객사명 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('cust-nm') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.custNm"
            disabled
          />
        </div>
        <!-- 송수신구분 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('snd-rcv') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.tranNm"
            disabled
          />
        </div>
        <!-- 서비스명 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('svcNm') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.svcNm"
            disabled
          />
        </div>
        <!-- 상태 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('status') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.successYn"
            disabled
          />
        </div>
        <!-- 장비유형 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('dev-cls') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.devClsNm"
            disabled
          />
        </div>
        <!-- 외부서버 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('external-nm') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.serverNm"
            disabled
          />
        </div>
        <!-- 장비모델 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('dev-mdl') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.devMdlCd"
            disabled
          />
        </div>
        <!-- 식별명 -->
        <div class="form-group width-25 sm-width-50 xs-width-100 pr-1 pr-1">
          <span class="form-control-static"
            ><b>{{ $t('entityId') }}</b></span
          >
          <input
            type="text"
            class="form-control"
            v-model="dataObj.devUuid"
            disabled
          />
        </div>
      </div>
      <div class="flex flex-wrap mt-2">
        <div class="md-width-100 width-50 pr-2 md-p-0">
          <div
            class="mb-1 flex flex-wrap justify-between items-center"
            style="min-height: 32px;"
          >
            <span class="lb-txt">{{ $t('send-result') }}</span>
            <div>
              <button
                type="button"
                class="btn btn-pink"
                :disabled="!resendable"
                @click="fnResend"
              >
                {{ $t('re-send') }}
              </button>
              <button type="button" class="btn btn-pink" @click="search">
                {{ $t('re-search') }}
              </button>
              <button
                type="button"
                class="btn btn-pink"
                :disabled="dataList.length === 0"
                @click="excelDownload"
              >
                {{ $t('excel-download') }}
              </button>
            </div>
          </div>
          <jqgrid
            ref="grid"
            name="outSvrRtReportPop"
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
        <div class="width-50 md-width-100 pl-2 md-p-0">
          <div class="mb-1 flex items-center" style="height: 32px;">
            <span class="lb-txt">{{ $t('commuication-format-detail') }}</span>
          </div>
          <div>
            <b>요청시간</b>
            <textarea
              class="form-control"
              v-model="msgObj.reqDttm"
              style="height:35px; resize: none;"
              disabled
            ></textarea
            ><br />
            <b>요청전문</b>
            <textarea
              class="form-control"
              v-model="msgObj.reqMsg"
              style="height:110px; resize: none;"
              disabled
            ></textarea
            ><br />
            <b>응답시간</b>
            <textarea
              class="form-control"
              v-model="msgObj.resDttm"
              style="height:35px; resize: none;"
              disabled
            ></textarea
            ><br />
            <b>응답상태</b>
            <textarea
              class="form-control"
              v-model="msgObj.status"
              style="height:35px; resize: none;"
              disabled
            ></textarea
            ><br />
            <b>응답전문</b>
            <textarea
              class="form-control"
              v-model="msgObj.resMsg"
              style="height:110px; resize: none;"
              disabled
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'

export default {
  name: 'OutSvrRtReportPopSvc',
  components: { Jqgrid },
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
      xMid: 'P20048',
      currentPage: 1,
      displayRowCount: 15,
      dataList: [],
      totPage: 0,
      colNameData: ['송신서버', '수신서버', '시간', '상태'],
      colModelData: [
        {
          name: 'fromServerNm',
          index: 'fromServerNm',
          align: 'center',
          width: '125'
        },
        {
          name: 'toServerNm',
          index: 'toServerNm',
          align: 'center',
          width: '125'
        },
        { name: 'reqDttm', index: 'reqDttm', align: 'center', width: '100' },
        { name: 'status', index: 'status', align: 'center', width: '55' }
      ],
      dataObj: {
        custNm: '',
        svcNm: '',
        devClsNm: '',
        devMdlCd: '',
        serverNm: '',
        successYn: '',
        tranNm: '',
        devUuid: ''
      },
      msgObj: {
        reqDttm: '',
        reqMsg: '',
        resDttm: '',
        status: '',
        resMsg: ''
      }
    }
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
  watch: {},
  created() {
    this.dataObj = this.data.obj
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      let reqData = {
        outMsgHistSeq: this.dataObj.outMsgHistSeq,
        firstDttm: this.dataObj.firstDttm,
        displayRowCount: this.displayRowCount,
        currentPage: this.currentPage
      }
      requestApi({
        url: '/online/iotoutsvrreport/outSvrRtReportListPop',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.dataList = res.data.outSvrRtReportListPop
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    excelDownload() {
      let reqData = {
        outMsgHistSeq: this.dataObj.outMsgHistSeq,
        firstDttm: this.dataObj.firstDttm,
        excelFlag: 'outSvrRtDtl'
      }
      requestDownloadApi({
        url: '/online/iotoutsvrreport/excelDownload',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    },
    fnResend() {
      let reqData = {
        outMsgHistSeq: this.dataList.outMsgHistSeq,
        firstDttm: this.data.firstDttm
      }

      requestApi({
        url: '/online/iotoutsvrreport/outSvrReSend',
        method: 'post',
        headers: {
          'X-MID': 'P99999'
        },
        data: reqData,
        callback: res => {
          if (res.data === 'Y') {
            this.alert(this.$t('resend-success'), 'success')
          } else {
            this.alert(this.$t('resend-fail'), 'warning')
          }
        }
      })
    },
    fnGetMsgDetail(id, index, contents, event) {
      let data = this.dataList[id]
      let reqData = {
        firstDttm: data.firstDttm,
        outMsgHSubSeq: data.outMsgHSubSeq
      }
      requestApi({
        url: '/online/iotoutsvrreport/outSvrRtReportListPopDtl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data) {
              this.msgObj = res.data
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
