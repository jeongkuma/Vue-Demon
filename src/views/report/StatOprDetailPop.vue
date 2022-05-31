<template>
  <div>
    <div class="modal-body">
      <div class="search-box">
        <div class="form-inline">
          <div class="form-group">
            <datetime-picker
                :isPair="false"
                id="regDate"
                v-model="regDate"
                :date.sync="regDate">
            </datetime-picker>
          </div>
          <div class="form-group">
            <button class="btn btn-info" type="button" @click="fnSearchList()">{{$t('search')}}</button>
            <button class="btn btn-pink" type="button" @click="excelDownLoad()">{{$t('excel-download')}}</button>
          </div>
        </div>
      </div>
      <jqgrid
        ref="grid"
        name="vpDeviceMgmt"
        :colModels="colModelData"
        :colNames="colNameData"
        :dataList="reportList"
        :totalPage.sync="totPage"
        :currentPage.sync="currentPage"
        :rowNum.sync="displayRowCount"
        :multiselect="false"
        @getDataList="fnSearchList"
      ></jqgrid>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >{{$t('cancel')}}</button>
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
  name: 'StatOprDetailPop',
  components: {
    DatetimePicker,
    Jqgrid
  },
  props: {
    data: Object,
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      reportList: [],
      colNameData: [this.$t('service'), this.$t('customer'), this.$t('dev-cls'), this.$t('dev-mdl'), this.$t('status-ctn'), this.$t('status-using-no'), this.$t('entityId'), this.$t('snd-time')],
      colModelData: [
        { name: 'svcNm', index: 'svcNm', align: 'center', width: '50' },
        { name: 'custNm', index: 'custNm', align: 'center', width: '50' },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left', width: '50' },
        { name: 'devMdlCd', index: 'devMdlCd', align: 'left', width: '50' },
        { name: 'ctn', index: 'ctn', align: 'left', width: '50' },
        { name: 'usingNo', index: 'usingNo', align: 'left', width: '50' },
        { name: 'devUuid', index: 'devUuid', align: 'left', width: '80' },
        { name: 'colDate', index: 'colDate', align: 'left', width: '50' }
      ],
      regDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      localReader: {
        root: 'root',
        page: 'page',
        total: 'total',
        records: 'records'
      },
      xMid: 'P00117'
    }
  },
  created () {
  },
  mounted () {
    this.regDate = new Date(this.data.date)
    this.fnSearchList()
  },
  methods: {
    fnSearchList() {
      var searchData = {}

      searchData.currentPage = this.currentPage
      searchData.displayRowCount = this.displayRowCount
      searchData.searchTable = this.selectedValue
      searchData.colDate = moment(this.regDate).format('YYYYMMDD').toString()
      if (this.data.svcCd !== null) {
        searchData.svcCd = this.data.svcCd
      }
      if (this.data.custSeq !== null) {
        searchData.custSeq = this.data.custSeq
      }
      if (this.data.devClsCd !== null) {
        searchData.devClsCd = this.data.devClsCd
      }
      if (this.data.devMdlCd !== null) {
        searchData.devMdlCd = this.data.devMdlCd
      }

      requestApi({
        url: '/online/iotStatOpr/retrieveIotStatOprDetailList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: searchData,
        callback: (res) => {
          this.reportList = res.data.dataList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    excelDownLoad() {
      var searchData = {}

      searchData.currentPage = this.currentPage
      searchData.displayRowCount = this.displayRowCount
      searchData.searchTable = this.selectedValue
      searchData.colDate = moment(this.regDate).format('YYYYMMDD').toString()
      if (this.data.svcCd !== null) {
        searchData.svcCd = this.data.svcCd
      }
      if (this.data.custSeq !== null) {
        searchData.custSeq = this.data.custSeq
      }
      if (this.data.devClsCd !== null) {
        searchData.devClsCd = this.data.devClsCd
      }
      if (this.data.devMdlCd !== null) {
        searchData.devMdlCd = this.data.devMdlCd
      }

      requestDownloadApi({
        url: '/online/iotStatOpr/downloadIotStatOprDetailList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: searchData,
        callback: (res) => {
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
