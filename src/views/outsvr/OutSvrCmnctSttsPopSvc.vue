<template>
  <div>
    <div class="modal-body">
      <div class="search-box">
        <div class="left form-inline">
          <div>
            <datetime-picker
              :isPair="false"
              id="startDate"
              v-model="startDate"
              :date.sync="startDate">
            </datetime-picker>
            <div class="form-group">
              <select class="form-control" v-model="selectedScsYn">
                <option value="all">{{ $t('status') }}</option>
                <option value="Y">{{ $t('success') }}</option>
                <option value="N">{{ $t('fail') }}</option>
              </select>
            </div>
            <div class="form-group">
              <select ref="searchType" v-model="searchType" class="form-control" title="검색 분류" >
                <option value="all">{{ $t('search-type') }}</option>
                <option value="ctn">{{ $t('pin')}}</option>
                <option value="entityId">{{ $t('entityId') }}</option>
              </select>
            </div>
            <div class="form-group">
              <input type="text" v-model="searchKey" class="form-control" placeholder="" title="검색어 입력">
            </div>
            <div class="form-group">
              <button class="btn btn-info" type="button" @click="searchDev(true)">{{$t('search')}}</button>
            </div>
          </div>
        </div>
      </div>
      <jqgrid
        ref="grid"
        name="solSvrSvcList"
        :colModels="colModelData"
        :colNames="colNameData"
        :dataList="dataList"
        :totalPage.sync="totPage"
        :currentPage.sync="currentPage"
        :rowNum.sync="displayRowCount"
        :multiselect="false"
        @getDataList="fnSearchGridData"
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
import { requestApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'OutSvrCmnctSttsPopSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
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
  data () {
    return {
      dataList: [],
      colNameData: ['고객사', '장비유형', '장비모델', '상태', '식별번호<br>(MAC ADDR)', 'Entity ID', '통신일시'],
      colModelData: [
        { 'name': 'custNm', 'index': 'custNm', 'align': 'center', 'width': '120' },
        { 'name': 'devClsNm', 'index': 'devClsNm', 'align': 'center', 'width': '120' },
        { 'name': 'devMdlNm', 'index': 'devMdlNm', 'align': 'center', 'width': '120' },
        { 'name': 'successYn', 'index': 'successYn', 'align': 'center', 'width': '60' },
        { 'name': 'ctn', 'index': 'ctn', 'align': 'center', 'width': '150' },
        { 'name': 'devUuid', 'index': 'devUuid', 'align': 'center', 'width': '130' },
        { 'name': 'firstDttm', 'index': 'firstDttm', 'align': 'center', 'width': '120' }
      ],
      selectedCls: 'all',
      selectedDev: 'all',
      selectedSvr: 'all',
      selectedSvc: 'all',
      selectedCst: -1,
      selectedScsYn: 'all',
      startDate: null,
      endDate: null,
      startConvertDate: null,
      endConvertDate: null,
      inputCtn: null,
      devClsList: [],
      devMdlList: [],
      svcNmList: [],
      outSvrList: [],
      customerList: [],
      getCustList: [],
      cmnctSttsPopList: [],
      currentPage: 1,
      displayRowCount: 15,
      custSeq: null,
      rowNum: 15,
      selectedCust: '',
      custList: [],
      isAdmin: false,
      isCust: false,
      custNm: '',
      custNmTemp: null,
      svcNm: null,
      serverNm: null,
      devClsCd: null,
      devMdlCd: null,
      devMdlNm: null,
      dataObj: {},
      searchKey: '',
      searchType: 'all',
      totPage: 1
    }
  },
  created () {
    this.dataObj = this.data.idx
  },
  mounted () {
    this.fnInitDate()
    this.fnSearchList()
  },
  computed: {
  },
  beforeDestroy () {
  },
  methods: {
    fnSearchList() {
      this.currentPage = 1
      this.callServerAPI(true)
    },
    fnInitDate() {
      // 초기 날짜 설정
      this.startDate = this.data.clickDttm
      this.endDate = this.data.clickDttm
    },
    callServerAPI (isSearch) {
      var reqData = {}
      // 조회시에
      if (isSearch) {
        if (this.startDate !== null) {
          this.startConvertDate = this.startDate.getFullYear() + ('00' + (this.startDate.getMonth() + 1)).slice(-2) + ('00' + this.startDate.getDate()).slice(-2)
        }

        reqData.currentPage = this.currentPage
        reqData.displayRowCount = this.displayRowCount
        reqData.searchStartDttm = this.startConvertDate
        reqData.searchEndDttm = this.startConvertDate
      } else {
        // 최초 진입시에
        if (this.startDate !== null) {
          this.startConvertDate = this.startDate.getFullYear() + ('00' + (this.startDate.getMonth() + 1)).slice(-2) + ('00' + this.startDate.getDate()).slice(-2)
        }
        // if (this.endDate !== null) {
        //   this.endConvertDate = this.endDate.getFullYear() + ('00' + (this.endDate.getMonth() + 1)).slice(-2) + ('00' + this.endDate.getDate()).slice(-2)
        // }
        reqData.currentPage = 1
        reqData.displayRowCount = 15
        reqData.searchStartDttm = this.startConvertDate
        reqData.searchEndDttm = this.startConvertDate
      }
      this.fnSearchGridData(reqData)
    },
    // 통신 현황 상세 조회
    fnSearchGridData(reqData) {
      let context = this

      // reqData.entrDevSeq = this.dataObj.entrDevSeq
      reqData.outSvrSeq = this.dataObj.outSvrSeq
      reqData.devClsCd = this.dataObj.devClsCd
      reqData.devMdlCd = this.dataObj.devMdlCd
      reqData.successYn = this.selectedScsYn
      reqData.searchType = this.searchType
      reqData.searchKey = this.searchKey

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsPopList',
        headers: {
          'X-MID': 'P20046'
        },
        callback: (data) => {
          context.dataList = data.data.cmnctSttsPopList
          context.totPage = data.data.page.totPage
          context.currentPage = data.data.page.page
        },
        method: 'post',
        data: reqData
      })
    },
    // 검색
    searchDev(isSearch) {
      let reqData = {}

      if (isSearch) this.currentPage = 1

      if (this.searchText !== '') {
        // 사용번호 검색하면
        if (this.selectedSearchType === 'usingNo') {
          reqData.usingNo = this.searchText
        // 식별번호 검색하면
        } else if (this.selectedSearchType === 'ctn') {
          reqData.ctn = this.searchText
        // 식별명 검색하면
        } else {
          reqData.devUname = this.searchText
        }
      }

      if (this.startDate !== null && this.startDate !== '') {
        this.startConvertDate = this.startDate.getFullYear() + ('00' + (this.startDate.getMonth() + 1)).slice(-2) + ('00' + this.startDate.getDate()).slice(-2)
        reqData.searchStartDttm = this.startConvertDate
        reqData.searchEndDttm = this.startConvertDate
      }
      // if (this.endDate !== null && this.startDate !== '') {
      //   this.endConvertDate = this.endDate.getFullYear() + ('00' + (this.endDate.getMonth() + 1)).slice(-2) + ('00' + this.endDate.getDate()).slice(-2)
      //   reqData.searchEndDttm = this.endConvertDate
      // }

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount

      if (this.selectedCls === 'all') {
        reqData.devClsCd = null
      } else {
        reqData.devClsCd = this.selectedCls
      }
      if (this.selectedDev === 'all') {
        reqData.devMdlCd = null
      } else {
        reqData.devMdlCd = this.selectedDev
      }
      if (this.statusCd === '') {
        reqData.detStatusCd = null
      } else {
        reqData.detStatusCd = this.statusNm
      }

      reqData.searchStartDttm = this.startConvertDate
      reqData.searchEndDttm = this.startConvertDate

      this.fnSearchGridData(reqData)
    }
  }
}
</script>

<style lang="less">
</style>
