<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
          >
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select class="form-control" v-model="devClsCd">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="devCls in devClsList"
              :key="'devCls' + devCls.devClsCd"
              :value="devCls.devClsCd"
              >{{ devCls.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl') }}</span>
          <select class="form-control" v-model="devMdlCd">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="devMdl in devMdlList"
              :key="'devCls' + devMdl.devMdlCd"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('external-nm') }}</span>
          <select class="form-control" v-model="serverNm">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="item in outSvrList"
              v-bind:key="item.outSvrSeq"
              :value="item.serverNm"
              >{{ item.serverNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('entityId') }}</span>
          <input
            type="text"
            class="form-control"
            v-model="devUname"
            maxlength="30"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('snd-rcv') }}</span>
          <select class="form-control" v-model="tranCd">
            <option value="all">{{ $t('all') }}</option>
            <option value="GN00000236">{{ $t('send') }}</option>
            <option value="GN00000237">{{ $t('receive') }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('status') }}</span>
          <select class="form-control" v-model="successYn">
            <option value="all">{{ $t('all') }}</option>
            <option value="Y">{{ $t('success') }}</option>
            <option value="N">{{ $t('fail') }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('tranDate') }}</span>
          <datetime-picker
            :isPair="false"
            :date.sync="searchDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSearch()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="md-width-100 width-60 pr-2 md-p-0">
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
            @click="fnResend"
          >
            {{ $t('re-send') }}
          </button>
          <button type="button" class="btn btn-pink" @click="fnGetList">
            {{ $t('re-search') }}
          </button>
        </div>
        <jqgrid
          ref="grid"
          name="outSvrRtReport"
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
      <div class="md-width-100 width-40 pl-2 md-p-0">
        <div style="font-weight: bold; font-size: 20px;">전문 상세 내역</div>
        <div>
          <div><b>요청시간</b></div>
          <textarea
            class="form-control"
            :value="prettyBlank(dataObj.reqDttm)"
            style="height:35px; resize: none;"
            disabled
          ></textarea>
        </div>
        <div>
          <div>요청전문</div>
          <textarea
            class="form-control"
            :value="prettyBlank(dataObj.reqMsg)"
            style="height:110px; resize: none;"
            disabled
          ></textarea>
        </div>
        <div>
          <div>응답시간</div>
          <textarea
            class="form-control"
            :value="prettyBlank(dataObj.resDttm)"
            style="height:35px; resize: none;"
            disabled
          ></textarea>
        </div>
        <div>
          <div>응답상태</div>
          <textarea
            class="form-control"
            :value="prettyBlank(dataObj.status)"
            style="height:35px; resize: none;"
            disabled
          ></textarea>
        </div>
        <div>
          <div>응답전문</div>
          <textarea
            class="form-control"
            :value="prettyBlank(dataObj.resMsg)"
            style="height:110px; resize: none;"
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'
import { getSvcList } from '@/api/common/usrSvcDevice'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'

export default {
  name: 'OutSvrRtReportSvc',
  components: { DatetimePicker, Jqgrid },
  props: {},
  data() {
    return {
      xMid: 'P20047',
      custSeq: -1,
      serverNm: 'all',
      svcCd: '',
      devClsCd: 'all',
      devMdlCd: 'all',
      devUname: '',
      tranCd: 'all',
      successYn: 'all',
      searchDate: null,
      totPage: 0,
      currentPage: 1,
      displayRowCount: 15,
      outSvrList: [],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      dataList: [],
      colNameData: [
        this.$t('external-nm'),
        this.$t('entityId'),
        this.$t('snd-rcv'),
        this.$t('tranDate'),
        this.$t('status'),
        this.$t('num'),
        'FirstDttm'
      ],
      colModelData: [
        { name: 'serverNm', index: 'serverNm', align: 'center', width: '100' },
        { name: 'devUuid', index: 'devUuid', align: 'center', width: '100' },
        { name: 'tranNm', index: 'tranNm', align: 'center', width: '30' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '100' },
        { name: 'successYn', index: 'successYn', align: 'center', width: '30' },
        {
          name: 'outMsgHistSeq',
          index: 'outMsgHistSeq',
          align: 'center',
          width: '100',
          hidden: true
        },
        {
          name: 'firstDttm',
          index: 'firstDttm',
          align: 'center',
          width: '100',
          hidden: true
        }
      ],
      dataObj: {},
      tableWidth: 0
    }
  },
  computed: {
    resendable() {
      let resend = this.dataList.filter(
        r => r.successYn === '실패' && r.tranNm === '송신'
      )
      return resend.length > 0
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    },
    devClsCd() {
      this.fnGetDevMdlList()
    }
  },
  created() {
    this.fnGetSvcCdList()
    this.fnGetOutSvrNmList()
  },
  mounted() {
    this.searchDate = moment().toDate()
  },
  beforeDestroy() {},
  methods: {
    // -------------------- 검색 옵션
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      this.devClsCd = 'all'
      this.devClsList = []
      const reqData = {
        svcCd: this.svcCd
      }
      requestApi({
        url: '/online/iotoutsvrreport/devClsList',
        headers: {
          'X-MID': 'P20047'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.devClsList = res.data.devClsList
            // this.devClsCd = res.data.devClsList[0].devClsCd
          }
        }
      })
    },
    fnGetDevMdlList() {
      this.devMdlCd = 'all'
      this.devMdlList = []
      if (this.devClsCd === 'all') {
        return
      }
      const reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotoutsvrreport/devMdlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.devMdlList.length > 0) {
              this.devMdlList = res.data.devMdlList
            }
          }
        }
      })
    },
    fnGetOutSvrNmList() {
      const reqData = {
        svcCd: this.svcCd
      }
      requestApi({
        url: '/online/iotoutsvrreport/outSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.outSvrList = res.data.outSvrList
            this.fnGetList()
          }
        }
      })
    },
    // -------------------- 목록 조회
    fnGetList() {
      let reqData = {
        custSeq: this.custSeq,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        serverNm: this.serverNm,
        tranCd: this.tranCd,
        successYn: this.successYn,
        devUname: this.devUname,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        searchDate: moment(this.searchDate).format('YYYYMMDD')
      }
      requestApi({
        url: '/online/iotoutsvrreport/outSvrRtReportList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.dataList = data.data.outSvrRtReportList
          this.totPage = data.data.page.totPage
          this.currentPage = data.data.page.page
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
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSearch() {
      this.custSeq = -1
      this.serverNm = 'all'
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = 'all'
      this.devMdlCd = 'all'
      this.devUname = ''
      this.tranCd = 'all'
      this.successYn = 'all'
      this.searchDate = moment().toDate()
    },
    excelDownload() {
      let reqData = {
        custSeq: this.custSeq,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        serverNm: this.serverNm,
        tranCd: this.tranCd,
        successYn: this.successYn,
        devUname: this.devUname,
        searchDate: moment(this.searchDate).format('YYYYMMDD'),
        excelFlag: 'outSvrRt'
      }
      requestDownloadApi({
        url: '/online/iotoutsvrreport/excelDownload',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: data => {}
      })
    },
    fnResend() {
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
      let executeReCnt = 0
      let successReCnt = 0
      let failReCnt = 0
      for (let i = 0; i < totalReCnt; i++) {
        let data = this.$refs.grid.getRowData(idArr[i])
        let reqData = {
          outMsgHistSeq: data.outMsgHistSeq,
          firstDttm: data.firstDttm
        }
        requestApi({
          url: '/online/iotoutsvrreport/outSvrReSend',
          method: 'post',
          headers: {
            'X-MID': this.xMid
          },
          data: reqData,
          callback: res => {
            if (res.data === 'Y') {
              successReCnt++
            } else {
              failReCnt++
            }
            executeReCnt++
            // 모두 결과를 받은 경우
            if (totalReCnt === executeReCnt) {
              // 재전송 n개 모두 성공시
              if (failReCnt === 0) {
                this.alert(this.$t('resend-success'), 'success')
              } else {
                // 재전송 n개 성공, n개 실패시
                this.alert(
                  this.$t('resend-cnt') +
                    totalReCnt +
                    '  ' +
                    this.$t('resend-success-cnt') +
                    successReCnt +
                    '  ' +
                    this.$t('resend-fail-cnt') +
                    failReCnt,
                  'warning'
                )
              }

              this.fnGetList()
            }
          }
        })
      }
    },
    // -------------------- 상세
    // @ondblClickRow="fnShowPopupMsgDetail"
    // 전문 상세 조회
    fnGetMsgDetail(id, index, contents, event) {
      let data = this.dataList[id]
      let reqData = {
        firstDttm: data.firstDttm,
        outMsgHistSeq: data.outMsgHistSeq,
        tranCd: data.tranCd
      }
      requestApi({
        url: '/online/iotoutsvrreport/outSvrRtReportDtlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data) {
              this.dataObj = res.data
            }
          }
        }
      })
    },
    prettyBlank(value) {
      return value || '-'
    },
    // 상세 이력 팝업
    fnShowPopupMsgDetail(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/outsvr/OutSvrRtReportPopSvc'),
        title: this.$t('out-svr-rt-dtl'),
        width: '900',
        height: '760',
        data: {
          obj: data
        },
        callback: res => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
