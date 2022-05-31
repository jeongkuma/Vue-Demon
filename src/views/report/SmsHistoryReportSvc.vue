<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{$t('send-time')}}</span>
        </div>
        <datetime-picker
          :isPair="true"
          :startDate.sync="startDate"
          :endDate.sync="endDate"
          :duration="{days:31}"
        ></datetime-picker>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('receiver-phone')}}</span>
        </div>
        <div class="form-group">
          <input type="text" v-model="trPhone"  class="form-control" placeholder="" title="검색어 입력" maxlength="20">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('messege-kind')}}</span>
        </div>
        <div class="form-group">
          <select v-model="trEtc1" class="form-control" title="검색 분류" >
            <option value="">{{$t('all')}}</option>
            <option v-for="etc1Nm in messegeTypeList" :key="etc1Nm.trEtc1" :value="etc1Nm.trEtc1">
              {{etc1Nm.trEtc1Nm}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search" >{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializeSeach">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="excelDownload" >{{$t('excel-download')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="smsHistoryReport"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="smsHistList"
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
  name: 'SmsHistoryReportSvc',
  components: { Jqgrid, DatetimePicker },
  data() {
    return {
      xMid: 'P00017',
      startDate: null,
      endDate: null,
      trPhone: '',
      trEtc1: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      messegeTypeList: [],
      smsHistList: [],
      colNameList: [this.$t('send-time'), this.$t('messege-kind'), this.$t('sms-grade'), this.$t('send-kind'), this.$t('send-phone'), this.$t('receiver-phone'), this.$t('sms-msg')],
      colModelData: [
        { name: 'trSendDate', index: 'trSendDate', align: 'center', width: '100' },
        { name: 'trEtc1Nm', index: 'trEtc1Nm', align: 'center', width: '50' },
        { name: 'trEtc2Nm', index: 'trEtc2Nm', align: 'center', width: '50' },
        { name: 'trMsgTypeNm', index: 'trMsgTypeNm', align: 'center', width: '50' },
        { name: 'trCallback', index: 'trCallback', align: 'center', width: '80' },
        { name: 'trPhone', index: 'trPhone', align: 'center', width: '80' },
        { name: 'trMsg', index: 'trMsg', align: 'left', width: '200' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetSmsConditionList()
  },
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment().toDate()
      this.endDate = moment().toDate()
    },
    fnGetSmsConditionList() {
      let reqData = {
        messegeType: 'GN00000005',
        grade: 'GN00000006'
      }
      requestApi({
        url: '/online/iotSmsTranHist/retrieveIotSmsConditionList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (data) => {
          this.messegeTypeList = data.data.trEtc1List
          this.gradeList = data.data.trEtc2List
        }
      })
    },
    fnGetList() {
      let reqData = {
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD'),
        trPhone: this.trPhone === '' ? null : this.trPhone,
        trEtc1: this.trEtc1 === '' ? null : this.trEtc1,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotSmsTranHist/retrieveIotSmsTranHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (data) => {
          this.smsHistList = data.data.smsHistList
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
      this.trPhone = ''
      this.trEtc1 = ''
      this.fnInitDate()
      // this.fnGetList()
    },
    excelDownload() {
      let reqData = {
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD'),
        trPhone: this.trPhone === '' ? null : this.trPhone,
        trEtc1: this.trEtc1 === '' ? null : this.trEtc1
      }
      requestDownloadApi({
        url: '/online/iotSmsTranHist/downloadIotSmsTranHist',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: (data) => {
        }
      })
    }
  }
}
</script>

<style></style>
