<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select v-model="searchCondition" class="form-control mr-1">
            <option value="all">{{ $t('all') }}</option>
            <option value="id">{{ $t('login-id') }}</option>
            <option value="ip">{{ $t('login-ip') }}</option>
          </select>
          <input
            type="text"
            v-model="inputValue"
            class="form-control"
            @keyup.enter="search"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('success-yn') }}</span>
          <select v-model="selectedValue" class="form-control">
            <option value="all">{{ $t('all') }}</option>
            <option value="0">{{ $t('success') }}</option>
            <option value="1">{{ $t('fail') }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('access-date') }}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSearch"
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
      name="loginHist"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="loginHistList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'

export default {
  name: 'LoginReportSvc',
  components: { DatetimePicker, Jqgrid },
  data() {
    return {
      xMid: 'P00019',
      searchCondition: 'all',
      selectedValue: 'all',
      inputValue: '',
      startDate: null,
      endDate: null,
      totPage: 0,
      currentPage: 1,
      displayRowCount: 15,
      colNameList: [
        this.$t('access-date'),
        this.$t('login-id'),
        this.$t('success-yn'),
        this.$t('login-ip'),
        this.$t('login-os'),
        this.$t('login-browser'),
        this.$t('login-fail-reason')
      ],
      colModelData: [
        {
          name: 'histRegDttm',
          index: 'histRegDttm',
          align: 'center',
          width: '100'
        },
        { name: 'usrLoginId', index: 'usrLoginId', align: 'left' },
        {
          name: 'loginSuccYn',
          index: 'loginSuccYn',
          align: 'center',
          width: '50'
        },
        { name: 'clientIp', index: 'clientIp', align: 'left', width: '80' },
        { name: 'usrOs', index: 'usrOs', align: 'left', width: '60' },
        { name: 'usrBrowser', index: 'usrBrowser', align: 'left', width: '60' },
        {
          name: 'loginFailReason',
          index: 'loginFailReason',
          align: 'left',
          width: '80'
        }
      ],
      loginHistList: []
    }
  },
  computed: {},
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
        searchCondition: this.searchCondition,
        inputValue: this.inputValue,
        selectedValue: this.selectedValue,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD'),
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotloginhist/retrieveIotLoginHist',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data && res.data.loginHistList) {
            res.data.loginHistList.forEach(row => {
              row.loginSuccYn = row.loginSuccYn === '0' ? '성공' : '실패'
            })
          }
          this.loginHistList = res.data.loginHistList
          this.totPage = res.data.page.totPage
          this.currentPate = res.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitializeSearch() {
      this.searchCondition = 'all'
      this.selectedValue = 'all'
      this.inputValue = ''
      this.fnInitDate()
      // this.search()
    },
    excelDownload() {
      let reqData = {
        searchCondition: this.searchCondition,
        inputValue: this.inputValue,
        selectedValue: this.selectedValue,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD')
      }
      requestDownloadApi({
        url: '/online/iotloginhist/downloadIotLoginHist',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: res => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
