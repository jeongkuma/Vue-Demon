<template>
  <div class="fr-dashboard form-in" v-if="view === true">
    <div class="dash-comp-header" style="min-height: 37px">
      <div>
        <b>{{ title }}</b>
      </div>
      <!-- usrTmplGubun T : 컴포넌트 템플릿 구분 TOPIC -->
      <div
        v-if="items.usrTmplGubun === 'T'"
        class="flex flex-wrap items-center justify-end"
      >
        <div class="text-right px-1">{{ lastUpdateDate }}</div>
        <div v-if="refreshData.useYn === 'Y'">
          <select
            v-show="refreshData.dispYn === 'Y'"
            v-model="items.dayTime"
            class="form-control"
            @change="fnSearch"
          >
            <option
              v-for="list in reloadList"
              :value="list.cdId * 1000"
              :key="list.cdId"
              >{{ list.cdNm }}</option
            >
          </select>
        </div>
      </div>
    </div>
    <dashboard-chart-search
      ref="search"
      class="dash-comp-search"
      :init-msg-search-data="initMsgSearchData"
      :orgList="orgList"
      :savedSearchValue="savedSearchValue"
      :items="items"
      @search="fnSearch"
    >
    </dashboard-chart-search>
    <div class="dash-comp-content">
      <component
        :is="tmplGubun"
        :initMsgData="initMsgData"
        :optionData="optionData"
        :componentData="componentData"
        :locNo="locNo"
      />
    </div>
  </div>
</template>

<script>
import PollingClient from '@/api/ccp/pollingClient'
import { excuteApi, executeQuery } from '@/api/common/api'
import moment from 'moment'
import localStore from '@/utils/localStore'

import DashboardChartSearch from './DashboardChartSearch'

import GaugeChart from '@/components/chart/GaugeChart'
import PieDatasetChart from '@/components/chart/PieDatasetChart'
import MixZoomBarChart from '@/components/chart/MixZoomBarChart'
import DynamicLineChart from '@/components/chart/DynamicLineChart'
import TableChart from '@/components/chart/TableChart'
import ClickTableChart from '@/components/chart/ClickTableChart'
import RowTableChart from '@/components/chart/RowTableChart'
import StatusTableChart from '@/components/chart/StatusTableChart'
import AiRealTimeStatus from '@/components/chart/custom/AiRealTimeStatus'
import PumpDetStatus from '@/components/chart/custom/PumpDetStatus'

const COMPONENTS = {
  GN00000129: TableChart,
  GN00000130: GaugeChart,
  GN00000131: PieDatasetChart,
  GN00000133: DynamicLineChart,
  GN00000140: MixZoomBarChart,
  GN00000245: ClickTableChart,
  GN00000216: RowTableChart,
  GN00000217: StatusTableChart,
  GN00000218: AiRealTimeStatus,
  GN00000219: PumpDetStatus
}

const SEARCHDATA_STORAGE_KEY = 'TICT_DASH_SEARCH'
const DEFAULT_DAY_TIME = 20 * 1000 // 기존 갱신 주기 20초

// items.initMsg 는 컴포넌트 저장(TB_IOT_USR_DASH_TMPL)의 rspMsg
export default {
  name: 'DashboardChart',
  components: Object.assign({ DashboardChartSearch }, COMPONENTS),
  props: {
    locNo: {
      type: String
    },
    id: {
      type: String
    },
    title: {
      type: String
    },
    view: {
      type: Boolean,
      required: true
    },
    value: {
      type: String
    },
    tmplGubun: {
      type: String
    },
    chartImagePath: {
      type: String
    },
    orgList: {
      type: Array
    },
    devClsList: {
      type: Array
    },
    reloadList: {
      type: Array
    },
    items: {
      type: Object,
      default: () => ({})
    },
    loginCustSeq: {
      type: String
    },
    savedSearchValue: {
      type: [Object]
    }
  },
  data() {
    return {
      xMid: 'P00001',
      lastUpdateDate: '',
      componentData: null,
      client: null,
      interval: null
    }
  },
  computed: {
    initMsgSearchData() {
      if (!this.items.initMsg || this.items.initMsg.length === 0) {
        return
      }
      let initMsgObj = JSON.parse(this.items.initMsg)
      return initMsgObj.SEARCH ? initMsgObj.SEARCH : []
    },
    initMsgData() {
      if (!this.items.initMsg || this.items.initMsg.length === 0) {
        return
      }
      let initMsgObj = JSON.parse(this.items.initMsg)
      return initMsgObj.DATA ? initMsgObj.DATA : []
    },
    refreshData() {
      if (!this.items.initMsg || this.items.initMsg.length === 0) {
        return
      }
      let initMsgObj = JSON.parse(this.items.initMsg)
      return initMsgObj.REFRESH
        ? initMsgObj.REFRESH
        : { useYn: 'Y', dispYn: 'Y' }
    },
    optionData() {
      if (!this.items.extraMsg || this.items.extraMsg.length === 0) {
        return
      }
      let extraMsgObj = JSON.parse(this.items.extraMsg)
      return extraMsgObj || {}
    },
    reqMsgData() {
      if (!this.items.reqMsg || this.items.reqMsg.length === 0) {
        return
      }
      return JSON.parse(this.items.reqMsg)
    }
  },
  watch: {
    savedSearchValue() {
      if (this.savedSearchValue && this.savedSearchValue['_interval_']) {
        this.items.dayTime = this.savedSearchValue['_interval_']
      }
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    if (this.client) {
      this.client.deletePolling(this.items.usrDashTmplSeq)
    }
  },
  methods: {
    fnSearch() {
      // 검색 항목 없는 경우 refs가 잡히지 않는 오류 생겨서 초기화
      let searchData = this.$refs.search ? this.$refs.search.fnGetSearchParams() : {}
      // 빈 값이 있는 경우 조회하지 않음
      if (
        Object.keys(searchData).length > 0 &&
        Object.values(searchData).findIndex(v => !v || v === '') > -1
      ) {
        return
      }
      // 검색 항목에 서비스, 장비유형 정보를 추가한다.
      searchData.usrDashTmplSeq = this.items.usrDashTmplSeq
      searchData.svcCd = this.items.svcCd
      searchData.devClsCd = this.items.devClsCd

      // 갱신 주기 사용 설정된 경우만 interval을 파라미터로 추가한다.
      if (this.refreshData.useYn === 'Y') {
        // 갱신 주기를 사용하나 주기를 노출하지 않는 경우 default 갱신주기를 설정한다.
        if (this.refreshData.dispYn === 'N') {
          this.items.dayTime = DEFAULT_DAY_TIME
        }
        searchData['_interval_'] = this.items.dayTime
      }

      this.fnSaveSearchData(searchData)

      if (this.items.usrTmplGubun === 'A') {
        this.fnExecuteAPI(searchData)
      } else if (this.items.usrTmplGubun === 'T') {
        this.fnExecuteTopic(searchData)
      } else if (this.items.usrTmplGubun === 'Q') {
        searchData.usrDashTmplSeq = this.items.usrDashTmplSeq
        this.fnExecuteQuery(searchData)
      }
    },
    // -------------------- API
    fnExecuteAPI(searchData) {
      if (!this.items.apiUrl || this.items.apiUrl.length === 0) {
        return
      }
      let param = {
        headers: { 'X-MID': this.xMid },
        body: Object.assign({}, this.reqMsgData.body || {}, searchData),
        url: this.items.apiUrl
      }

      excuteApi(param).then(resData => {
        if (param.body.responseKey && param.body.responseKey.length > 0) {
          this.componentData = _.get(resData, param.body.responseKey)
        } else {
          this.componentData = resData
        }
        this.lastUpdateDate = moment()
          .format('HH:mm:ss')
          .toString()
      })
    },
    // -------------------- TOPIC
    fnExecuteTopic(searchData) {
      if (!this.items.topicId || this.items.topicId.length === 0) {
        return
      }

      // 파라미터 세팅
      let svcParam = []
      for (let [key, value] of Object.entries(searchData)) {
        svcParam.push({ tmplGubun: key, tmplCondVlu: value })
      }

      let params = {
        topicId: this.items.topicId,
        svcParam: svcParam
      }

      this.client = new PollingClient()
      this.client.addPolling(
        this.items.usrDashTmplSeq,
        this.items.usrTmplGubun,
        params,
        res => {
          this.componentData = res
          this.lastUpdateDate = moment()
            .format('HH:mm:ss')
            .toString()
        },
        this.refreshData.useYn,
        this.items.dayTime
      )
    },
    // -------------------- QUERY
    fnExecuteQuery(searchData) {
      executeQuery(searchData).then(resData => {
        this.componentData = resData
        this.lastUpdateDate = moment()
          .format('HH:mm:ss')
          .toString()
      })
    },
    // -------------------- 검색 조건
    fnSaveSearchData(searchData) {
      localStore.setObject(SEARCHDATA_STORAGE_KEY, this.items.usrDashTmplSeq, searchData)
    }
  }
}
</script>

<style></style>
