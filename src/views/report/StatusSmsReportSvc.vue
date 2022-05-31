<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <!-- 종류 (일별, 월별) -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('kind') }}</span>
          <select v-model="searchKind" class="form-control" title="검색 분류">
            <option value="daily">{{ $t('daily') }}</option>
            <option value="monthly">{{ $t('monthly') }}</option>
          </select>
        </div>
        <!-- 검색어 -->
        <div class="form-group">
          <select v-model="searchType" class="form-control mr-1" title="검색 분류">
            <option value="custNm">{{ $t('cust-nm') }}</option>
            <option value="custLoginId">{{ $t('cust-lgn-id') }}</option>
          </select>
          <input
            type="text"
            v-model="searchText"
            class="form-control"
            placeholder=""
            title="검색어 입력"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('duration') }}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :month="isMonth"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">
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
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="excelDownload()">
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="collectorReport"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="smsReportList"
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

export default {
  name: 'StatusSmsReportSvc',
  components: { Jqgrid, DatetimePicker },
  data() {
    return {
      xMid: 'P00102',
      searchKind: 'daily',
      searchType: 'custNm',
      searchText: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      colNameList: [
        this.$t('duration'),
        this.$t('cust-lgn-id'),
        this.$t('cust-nm'),
        this.$t('messege-kind'),
        this.$t('send-cnt'),
        this.$t('success-cnt'),
        this.$t('fail-cnt')
      ],
      colModelData: [
        {
          name: 'trSendDate',
          index: 'trSendDate',
          align: 'center',
          width: '100'
        },
        {
          name: 'custLoginId',
          index: 'custLoginId',
          align: 'center',
          width: '100'
        },
        { name: 'custNm', index: 'custNm', align: 'center', width: '100' },
        { name: 'trEtc1Nm', index: 'trEtc1Nm', align: 'center', width: '50' },
        { name: 'sendCnt', index: 'sendCnt', align: 'center', width: '80' },
        {
          name: 'successCnt',
          index: 'successCnt',
          align: 'center',
          width: '80'
        },
        { name: 'failCnt', index: 'failCnt', align: 'center', width: '80' }
      ],
      smsReportList: []
    }
  },
  computed: {
    isMonth() {
      return this.searchKind === 'monthly'
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(1, 'months')
        .toDate()
      this.endDate = moment().toDate()
    },
    fnGetList() {
      let reqData = {
        searchKind: this.searchKind,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      if (this.searchText !== '') {
        if (this.searchType === 'custNm') {
          reqData.custNm = this.searchText
        } else if (this.searchType === 'custLoginId') {
          reqData.custLoginId = this.searchText
        }
      }

      if (this.startDate && this.startDate !== '') {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDD')
      }

      if (this.endDate && this.endDate !== '') {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDD')
      } else {
        reqData.searchEndDttm = '99991231'
      }

      requestApi({
        url: '/online/iotSmsReport/retrieveIotSmsReportList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.smsReportList = data.data.smsReportList
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
      this.searchKind = 'daily'
      this.searchType = 'custNm'
      this.searchText = ''
      this.fnInitDate()
      // this.fnGetList()
    },
    excelDownload() {
      let reqData = {
        searchKind: this.searchKind
      }

      if (this.searchText !== '') {
        if (this.searchType === 'custNm') {
          reqData.custNm = this.searchText
        } else if (this.searchType === 'custLoginId') {
          reqData.custLoginId = this.searchText
        }
      }

      if (this.startDate && this.startDate !== '') {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDD')
      }

      if (this.endDate && this.endDate !== '') {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDD')
      } else {
        reqData.searchEndDttm = '99991231'
      }

      requestDownloadApi({
        url: '/online/iotSmsReport/downloadIotSmsReport',
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

<style></style>
