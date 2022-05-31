<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('gubun') }}</span>
          <select v-model="searchTable" class="form-control">
            <option value="col">{{ $t('colLog') }}</option>
            <option value="iag">{{ $t('iagLog') }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('colDate') }}</span>
          <datetime-picker
            :isPair="false"
            id="colDate"
            v-model="colDate"
            :date.sync="colDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
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
      <button type="button" class="btn btn-pink" @click="excelDownload">
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="logHist"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="logHistList"
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
  name: 'LogReportSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
  data() {
    return {
      xMid: 'P00110',
      searchTable: 'col',
      colDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      logHistList: [],
      colNameData: [
        this.$t('colDate'),
        this.$t('errorCode'),
        this.$t('headerInfo'),
        this.$t('bodyInfo')
      ],
      colModelData: [
        { name: 'colDate', index: 'colDate', align: 'center', width: '50' },
        { name: 'errCode', index: 'errCode', align: 'center', width: '50' },
        {
          name: 'headerInfo',
          index: 'headerInfo',
          align: 'left',
          width: '150'
        },
        { name: 'bodyInfo', index: 'bodyInfo', align: 'left', width: '150' }
      ]
    }
  },
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  computed: {},
  methods: {
    fnInitDate() {
      this.colDate = new Date()
    },
    fnGetList() {
      if (this.searchTable === '') {
        this.alert(this.$t('choose-search-logtype'), 'warning')
        return
      }
      let reqData = {
        searchTable: this.searchTable,
        colDate: moment(this.colDate).format('YYYYMMDD'),
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotlog/retrieveIotLogList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.logHistList = res.data.dataList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSeach() {
      this.searchTable = 'col'
      this.fnInitDate()
    },
    excelDownload() {
      if (this.searchTable === '') {
        this.alert(this.$t('choose-search-logtype'), 'warning')
        return
      }

      let reqData = {
        searchTable: this.searchTable,
        colDate: moment(this.colDate).format('YYYYMMDD')
      }
      requestDownloadApi({
        url: '/online/iotlog/downloadIotLogList',
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

<style lang="less" scoped></style>
