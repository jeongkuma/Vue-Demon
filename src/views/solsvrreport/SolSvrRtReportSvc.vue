<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('msg-nm') }}</span>
        </div>
        <div class="form-group">
          <input type="text" class="form-control" v-model="searchObj.msgNm" />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ this.$t('sendTarget') }}</span>
        </div>
        <div class="form-group">
          <select class="form-control" v-model="searchObj.sendTarget">
            <option value="">전체</option>
            <option
              v-for="(target, idx) in targetSolSvrList"
              :key="'target' + idx"
              :value="target.solSvrSeq"
              >{{ target.serverNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{
            this.$t('receiveTarget')
          }}</span>
          <select class="form-control" v-model="searchObj.receiveTarget">
            <option value="">전체</option>
            <option
              v-for="(target, idx) in targetSolSvrList"
              :key="'target' + idx"
              :value="target.solSvrSeq"
              >{{ target.serverNm }}</option
            >
          </select>
        </div>
        <!-- 송수신구분 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('snd-rcv') }}</span>
          <select class="form-control" v-model="searchObj.tranCd">
            <option value="">{{ $t('all') }}</option>
            <option value="GN00000236">{{ $t('send') }}</option>
            <option value="GN00000237">{{ $t('receive') }}</option>
            <option value="GN00000337">{{ $t('polling') }}</option>
          </select>
        </div>
        <!-- 상태 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('status') }}</span>
        </div>
        <div class="form-group">
          <select class="form-control" v-model="searchObj.successYn">
            <option value="">{{ $t('all') }}</option>
            <option value="Y">{{ $t('success') }}</option>
            <option value="N">{{ $t('fail') }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('tranDate') }}</span>
          <datetime-picker
            :isPair="true"
            :hour="false"
            :minute="false"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnGetList()">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="md-width-100 width-60 pr-2">
        <div ref="tableWidthBox" class="mb-2 text-right">
          <button
            type="button"
            class="btn btn-pink"
            :disabled="dataList.length === 0"
            @click="excelDownload"
          >
            {{ $t('excel-download') }}
          </button>
          <button
            type="button"
            class="btn btn-pink"
            :disabled="!resendable"
            @click="fnCallResend"
          >
            {{ $t('re-send') }}
          </button>
        </div>
        <jqgrid
          ref="grid"
          name="solSvrRtReport"
          :colModels="colModelData"
          :colNames="colNameData"
          :dataList="dataList"
          :totalPage.sync="totPage"
          :currentPage.sync="currentPage"
          :rowNum.sync="displayRowCount"
          :width="650"
          :useSelectAll="false"
          @getDataList="fnGetList"
          @onCellSelect="fnGetMsgDetail"
          @ondblClickRow="fnShowPopupMsgDetail"
          @afterDataSetup="fnAfterDataSetup"
        >
        </jqgrid>
      </div>
      <div class="md-width-100 width-40 pl-2">
        <div style="font-weight: bold; font-size: 20px;">전문 상세 내역</div>
        <br />
        <b>요청시간</b>
        <textarea
          class="form-control"
          :value="prettyBlank(detailObj.reqDttm)"
          style="height:35px; resize: none;"
          disabled
        ></textarea
        ><br />
        <b>요청전문</b>
        <textarea
          class="form-control"
          :value="prettyBlank(detailObj.reqMsg)"
          style="height:110px; resize: none;"
          disabled
        ></textarea
        ><br />
        <b>응답시간</b>
        <textarea
          class="form-control"
          :value="prettyBlank(detailObj.resDttm)"
          style="height:35px; resize: none;"
          disabled
        ></textarea
        ><br />
        <b>응답상태</b>
        <textarea
          class="form-control"
          :value="prettyBlank(detailObj.statusNm)"
          style="height:35px; resize: none;"
          disabled
        ></textarea
        ><br />
        <b>응답전문</b>
        <textarea
          class="form-control"
          :value="prettyBlank(detailObj.resMsg)"
          style="height:110px; resize: none;"
          disabled
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'SolSvrRtReportSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameData: [
        '전문명',
        '송신서버',
        '수신서버',
        '상태',
        '송수신구분',
        '송신/수신시간',
        '순번'
      ],
      colModelData: [
        { name: 'msgNm', index: 'msgNm', align: 'left', width: '80' },
        {
          name: 'sendTarget',
          index: 'sendTarget',
          align: 'center',
          width: '30'
        },
        {
          name: 'receiveTarget',
          index: 'devUuid',
          align: 'center',
          width: '30'
        },
        { name: 'successYn', index: 'successYn', align: 'center', width: '30' },
        { name: 'tranNm', index: 'tranNm', align: 'center', width: '30' },
        { name: 'firstDttm', index: 'tranNm', align: 'center', width: '50' },
        {
          name: 'solMsgHistSeq',
          index: 'solMsgHistSeq',
          align: 'center',
          width: '100',
          hidden: true
        }
      ],
      searchObj: {
        msgNm: '',
        sendTarget: '',
        receiveTarget: '',
        tranCd: '',
        successYn: '',
        searchStartDttm: null,
        searchEndDttm: null
      },
      startDate: null,
      endDate: null,
      excelDownYn: false,
      resendYn: false,
      devUname: null,
      currentPage: 1,
      displayRowCount: 15,
      rowNum: 15,
      gridId: null,
      detailObj: {
        reqDttm: '',
        reqMsg: '',
        resDttm: '',
        statusNm: '',
        resMsg: ''
      },
      totalReCnt: 0,
      executeReCnt: 0,
      successReCnt: 0,
      failReCnt: 0,
      xMid: 'P30040',
      targetSolSvrList: [],
      totPage: 0
    }
  },
  created() {
    this.fnInitDate()
    this.getTargetSolSvrList()
    this.fnGetList()
  },
  mounted() {
    this.fnInitDate()
  },
  beforeDestroy() {},
  computed: {
    resendable() {
      let resend = this.dataList.filter(
        r => r.successYn === '실패' && r.tranNm === '송신'
      )
      return resend.length > 0
    }
  },
  methods: {
    getTargetSolSvrList() {
      let reqData = {}
      requestApi({
        url: '/online/solsvrmsg/retrieveTargetSolSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.targetSolSvrList = res.data.targetSolSvrList
        }
      })
    },
    fnGetList() {
      let context = this

      if (context.startDate && context.endDate) {
        context.searchObj.searchStartDttm = moment(context.startDate)
          .format('YYYYMMDD')
          .toString()
        context.searchObj.searchEndDttm = moment(context.endDate)
          .format('YYYYMMDD')
          .toString()
      }

      context.searchObj.currentPage = context.currentPage
      context.searchObj.displayRowCount = context.displayRowCount

      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.searchObj,
        callback: data => {
          context.dataList = data.data.solSvrMsgHistList
          context.totPage = data.data.page.totPage
          context.currentPage = data.data.page.page
        }
      })
    },
    fnAfterDataSetup() {
      // 실패, 송신이 아닌 경우 체크박스 없애기
      let idArr = this.$refs.grid.getDataIds()
      idArr.forEach(id => {
        let data = this.$refs.grid.getRowData(id)
        if (data.successYn !== '실패' || data.tranNm !== '송신') {
          this.$refs.grid.removeChcekbox(id)
        }
      })
    },
    // 전문상세내역
    fnGetMsgDetail(id, indx, contents, event) {
      let data = this.dataList[id]
      let paramObj = {}
      paramObj.solMsgHistSeq = data.solMsgHistSeq
      requestApi({
        url: '/online/solsvrmsg/retrieveSolMsgHistDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data) {
              this.detailObj = res.data.dataObj
              this.detailObj.reqMsg = this.formatReqMsg(res.data.dataObj)
            } else {
              this.detailObj.reqDttm = '-'
              this.detailObj.reqMsg = '-'
              this.detailObj.resDttm = '-'
              this.detailObj.status = '-'
              this.detailObj.resMsg = '-'
            }
          }
        }
      })
    },
    formatReqMsg(dataObj) {
      let reqMsg = ''
      // reqMsg = reqMsg.concat('[URI]', dataObj.reqUri, '\n', '[HEADER]', dataObj.reqHeader, dataObj.reqBody)
      reqMsg = reqMsg.concat(
        '[URI] ',
        dataObj.reqUri,
        '\n\n',
        '[HEADER] ',
        dataObj.reqHeader,
        '\n\n',
        '[BODY] ',
        dataObj.reqBody,
        '\n'
      )
      return reqMsg
    },
    fnShowPopupMsgDetail: _.throttle(
      function(id) {
        let data = this.dataList[id]
        this.popup({
          component: () => import('@/views/solsvrreport/SolSvrRtReportPopSvc'),
          title: this.$t('solMsgHistDetail'),
          width: '900',
          height: '750',
          data: {
            idx: data,
            detail: this.detailObj
          },
          callback: data => {
            // 데이터 재조회
            if (data !== 'dismiss') {
              this.fnSearchList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnSearchList() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSeach() {
      this.currentPage = 1
      this.searchObj.msgNm = ''
      this.searchObj.sendTarget = ''
      this.searchObj.receiveTarget = ''
      this.searchObj.tranCd = ''
      this.searchObj.successYn = ''
      this.fnInitDate()
      // this.fnGetList()
    },
    fnInitDate() {
      this.startDate = moment()
        .subtract(1, 'days')
        .toDate()
      this.endDate = moment().toDate()
    },
    fnCallResend() {
      let idArr = this.$refs.grid.getSelectionIndexs()
      if (idArr.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      if (idArr.length > 5) {
        this.alert(this.$t('resend-limit'), 'warning')
        return
      }

      let totalReCnt = idArr.length
      // let executeReCnt = 0
      // let successReCnt = 0
      // let failReCnt = 0
      let reqData = {}
      let paramsObj = []
      for (let i = 0; i < totalReCnt; i++) {
        let data = this.$refs.grid.getRowData(idArr[i])
        paramsObj.push(data.solMsgHistSeq)
      }
      reqData.solMsgHistSeqList = paramsObj
      requestApi({
        url: '/online/solsvrmsg/solSvrReSend',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: res => {
          if (res.data === 'Y') {
            this.alert(this.$t('reSendSuccess'), 'success')
          } else {
            // failReCnt++
            this.alert(this.$t('reSendFail'), 'warning')
          }
        }
      })
    },
    excelDownload() {
      let context = this
      if (context.startDate && context.endDate) {
        context.searchObj.searchStartDttm = moment(context.startDate)
          .format('YYYYMMDD')
          .toString()
        context.searchObj.searchEndDttm = moment(context.endDate)
          .format('YYYYMMDD')
          .toString()
      }
      context.searchObj.currentPage = context.currentPage
      context.searchObj.displayRowCount = context.displayRowCount
      requestDownloadApi({
        url: '/online/solsvrmsg/retrieveSolMsgHistExcel',
        headers: {
          'X-MID': this.xMid
        },
        data: this.searchObj,
        callback: data => {}
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
