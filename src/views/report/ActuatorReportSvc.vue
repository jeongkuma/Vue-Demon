<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
          >
            <option value="">{{ $t('all') }}</option>
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
          <select
            v-model="devClsCd"
            class="form-control"
            @change="fnGetDevMdlList"
            title="장비유형"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devCls, index) in devClsList"
              :key="`devCls-${index}`"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
          <select v-model="devMdlCd" class="form-control" title="장비모델">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devMdlCd-${index}`"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('status-ctn') }}</span>
          <input
            type="text"
            v-model="inputCtn"
            class="form-control"
            placeholder=""
            title="식별번호CTN"
            @keyup.enter="search"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('act-rep-type-head') }}</span>
          <select v-model="ctlType" class="form-control" title="제어방식">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="type in accuTypeList"
              :key="type.cdId"
              :value="type.cdId"
              >{{ type.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('ctrlStatus') }}</span>
          <select v-model="prcCd" class="form-control" title="제어상태">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="devPrc in devPrcList"
              :key="devPrc.codeId"
              :value="devPrc.codeId"
              >{{ devPrc.codeNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{
            $t('act-rep-req-date-head')
          }}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          >
          </datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" @click="search" type="button">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" @click="fnInitializeSeach" type="button">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <jqgrid
      ref="grid"
      name="actuatorReport"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'ActuatorReportSvc',
  components: { DatetimePicker, Jqgrid },
  data() {
    return {
      xMid: 'P00018',
      controlKind: 'GN00000026',
      controlStatus: 'GN00000027',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      inputCtn: '',
      prcCd: '',
      ctlType: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      devPrcList: [],
      dataList: [],
      accuTypeList: [],
      colNameList: [
        this.$t('service'),
        this.$t('act-rep-cls-nm-head'),
        this.$t('act-rep-mdl-nm-head'),
        this.$t('act-rep-ctn-head'),
        this.$t('entity-id'),
        this.$t('act-rep-type-head'),
        this.$t('act-rep-req-date-head'),
        this.$t('act-rep-end-date-head'),
        this.$t('act-rep-nm-head'),
        this.$t('act-rep-status-head'),
        this.$t('stat-act-chn-val-txt'),
        this.$t('stat-act-cur-val-txt'),
        this.$t('act-rep-retry-head'),
        this.$t('act-rep-resv-date-head')
      ],
      colModelList: [
        { name: 'svcCdNm', index: 'svcCdNm', align: 'center', width: '100' },
        {
          name: 'devClsCdNm',
          index: 'devClsCdNm',
          align: 'center',
          width: '100'
        },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'center', width: '100' },
        { name: 'ctn', index: 'ctn', align: 'center', width: '100' },
        { name: 'entityId', index: 'entityId', align: 'center', width: '200' },
        { name: 'ctlTypeNm', index: 'ctlType', align: 'center', width: '100' },
        { name: 'ctlDate', index: 'ctlDate', align: 'center', width: '100' },
        { name: 'devTime', index: 'devTime', align: 'center', width: '100' },
        {
          name: 'devAttrCdNm',
          index: 'devAttrCdNm',
          align: 'center',
          width: '100'
        },
        { name: 'prcCdNm', index: 'prcCdNm', align: 'center', width: '100' },
        { name: 'devVal', index: 'devVal', align: 'center', width: '100' },
        {
          name: 'curDevVal',
          index: 'curDevVal',
          align: 'center',
          width: '100'
        },
        { name: 'retryCnt', index: 'retryCnt', align: 'center', width: '100' },
        { name: 'resDate', index: 'resDate', align: 'center', width: '100' }
      ]
    }
  },
  computed: {},
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  created() {
    this.fnGetSvcCdList()
    this.fnDevPrcList()
    this.getAccuTypeList()
  },
  mounted() {
    this.fnInitDate()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(6, 'days')
        .toDate()
      this.endDate = moment().toDate()
    },
    // --------------------- 옵션
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
      this.devClsCd = ''
      this.devClsList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            this.devClsCd = this.devClsList[0].devClsCd
            this.fnGetDevMdlList({ devClsCd: this.devClsCd })
            this.search()
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevMdlList() {
      this.devMdlCd = ''
      this.devMdlList = []

      if (this.devClsCd === '') {
        return false
      }

      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.devMdlList = data.data
        }
      })
    },
    fnDevPrcList() {
      let reqData = {
        controlKind: this.controlKind,
        controlStatus: this.controlStatus
      }
      requestApi({
        url: '/online/iotctrlHist/retrieveIotCtrAllcondition',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.devPrcList = data.data.prcList
          this.devColList = data.data.colList
        }
      })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCdId: this.devClsCd === '' ? null : this.devClsCd,
        devMdlCd: this.devMdlCd === '' ? null : this.devMdlCd,
        inputCtn: this.inputCtn.trim() === '' ? null : this.inputCtn.trim(),
        prcCd: this.prcCd === '' ? null : this.prcCd,
        ctlType: this.ctlType === '' ? null : this.ctlType,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      if (this.startDate) {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDD')
      }
      if (this.endDate) {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDD')
      }

      requestApi({
        url: '/online/iotctrlHist/retrieveIotCtrlHist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.dataList = data.data.ctrlList
          this.totPage = data.data.page.totPage
          this.currentPage = data.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSeach() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = ''
      this.devMdlCd = ''
      this.devMdlList = []
      this.inputCtn = ''
      this.prcCd = ''
      this.ctlType = ''
      this.fnInitDate()
    },
    fnDeleteCtrl() {
      let checkedIds = this.$refs.grid.getSelectionIndexs()
      if (checkedIds.length === 0) {
        this.alert(this.$t('act-rep-ctl-list-chk-alert'))
        return
      }

      let prcCdList = []
      let validPrcCd = true
      let ctlTypeList = []
      let validCtlType = true

      checkedIds.forEach(i => {
        let item = this.dataList[i]
        if (!prcCdList.includes(item.prcCd)) {
          prcCdList.push(item.prcCd)
          if (item.prcCd !== '00') {
            validPrcCd = false
          }
        }
        if (!ctlTypeList.includes(item.ctlType)) {
          ctlTypeList.push(item.ctlType)
          if (item.ctlType === 'GN00000112') {
            validCtlType = false
          }
        }
      })
      if (!validPrcCd || !validCtlType) {
        this.alert(this.$t('act-rep-ctl-type-chk-alert'))
        return
      }

      this.confirm(this.$t('stat-act-del-conf-alert'), this.fnDeleteCtrlAPI)
    },
    fnDeleteCtrlAPI() {
      let ctrList = []
      let checkedIds = $('#actuatorReportTb').jqGrid(
        'getGridParam',
        'selarrrow'
      )
      checkedIds.forEach(i => {
        ctrList.push(this.dataList[i - 1])
      })

      let reqData = {
        ctrList: ctrList
      }
      requestApi({
        url: '/online/iotctrlHist/deleteIotCtrlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.alert(this.$t('act-rep-del-ok-alert'), 'success', this.fnGetList)
        }
      })
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCdId: this.devClsCd === '' ? null : this.devClsCd,
        devMdlCd: this.devMdlCd === '' ? null : this.devMdlCd,
        ctn: this.inputCtn.trim() === '' ? null : this.inputCtn.trim(),
        prcCd: this.prcCd === '' ? null : this.prcCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId,
        tmpCdId: this.tmpCdId
      }

      if (this.startDate) {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDD')
      }
      if (this.endDate) {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDD')
      }

      requestDownloadApi({
        url: '/online/iotctrlHist/downloadIotCtrlHist',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    },
    getAccuTypeList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'GN00000016' })
        .then(data => {
          this.accuTypeList = data
        })
        .catch(e => {
          console.error(e)
        })
    }
  }
}
</script>

<style></style>
