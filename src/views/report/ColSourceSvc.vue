<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-control-static">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
          >
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
            >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('dev-cls') }}</span>
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
          <span class="form-control-static">{{ $t('dev-mdl-nm') }}</span>
          <select
            v-model="devMdlCd"
            class="form-control"
            title="장비모델"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList" :key="`devMdlCd-${index}`" :value="devMdl.devMdlCd"
            >{{ devMdl.devMdlNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <select ref="searchType" v-model="searchType" class="form-control mr-1" title="조회 구분" >
            <option v-for="(item , index) in searchTypeList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
          </select>
          <input type="text" v-model="searchKey" class="form-control" placeholder="" title="검색어 입력" @keyup.enter="fnSearchList()">
        </div>
        <div class="form-group">
          <span class="form-control-static">{{ $t('colStateCd') }}</span>
          <select ref="statusSearchType" v-model="statusSearchType" class="form-control" title="수집 상태" >
            <option v-for="(item , index) in colStateCdList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
          </select>
        </div>
        <div class="form-group">
        </div>
        <!-- 기간검색 -->
        <div class="form-group">
          <span class="form-control-static">수집일자</span>
          <datetime-picker
            :isPair="true"
            :hour="false"
            :minute="false"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearchList()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="searchInit()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <jqgrid
      ref="grid"
      name="colSource"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'StatusSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
  created () {
    this.fnGetSvcCdList()
    this.initDate()
    this.fnGetList()
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  props: {
  },
  data () {
    return {
      totPage: null,
      devClsCdNm: '',
      startDate: null,
      endDate: null,
      statusSearchType: 'all',
      searchType: '',
      searchKey: null,
      dataList: [],
      colNameList: [
        this.$t('service-name'),
        this.$t('dev-cls'),
        this.$t('dev-mdl'),
        this.$t('pin') + '(' + this.$t('ctn') + ')',
        this.$t('entityId'),
        this.$t('colDate'),
        this.$t('colSeq'),
        this.$t('logKey'),
        this.$t('regDttm'),
        this.$t('errCode'),
        this.$t('colStateCd'),
        this.$t('colProcDesc')
      ],
      colModelList: [
        { name: 'svcNm', index: 'svcNm', align: 'left', width: 50 },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'left', width: 50 },
        { name: 'devMdlCd', index: 'devMdlCd', align: 'left', width: 50 },
        { name: 'ctn', index: 'ctn', align: 'center', width: 60 },
        { name: 'devUuid', index: 'devUuid', align: 'left', width: 80 },
        { name: 'colDate', index: 'colDate', align: 'center', width: 80 },
        { name: 'colSeq', index: 'colSeq', align: 'left', hidden: true },
        { name: 'logKey', index: 'logKey', align: 'center', hidden: true },
        { name: 'regDttm', index: 'regDttm', align: 'center', hidden: true },
        { name: 'errCode', index: 'errCode', align: 'center', hidden: true },
        { name: 'colStateCd', index: 'colStateCd', align: 'center', width: 30 },
        { name: 'colProcDesc', index: 'colProcDesc', align: 'center' }
      ],
      searchTypeList: [
        { value: '', name: this.$t('search-type') },
        { value: 'colProcDesc', name: this.$t('colProcDesc') },
        { value: 'entityId', name: this.$t('entity-id') },
        { value: 'ctn', name: this.$t('pin') + '(' + this.$t('ctn') + ')' },
        { value: 'usingNo', name: this.$t('using-no') },
        { value: 'devUname', name: this.$t('pin-nm') }
      ],
      colStateCdList: [
        { value: 'all', name: this.$t('all') },
        { value: 'SUC', name: 'SUC' },
        { value: 'ERR', name: 'ERR' },
        { value: 'FAIL', name: 'FAIL' },
        { value: 'PROC', name: 'PROC' }
      ],
      currentPage: 1,
      displayRowCount: 15,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      svcCd: 'all',
      devClsCd: '',
      devMdlCd: ''
    }
  },
  mounted () {
    this.initDate()
    this.fnGetList()
  },
  computed: {},
  methods: {
    initDate() {
      this.startDate = moment().toDate()
      this.endDate = moment().toDate()
    },
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.svcCdList = data
        })
        .catch((e) => {
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
        .then((data) => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            this.devClsCd = this.devClsList[0].devClsCd
            this.fnGetDevMdlList({ devClsCd: this.devClsCd })
          } else {
            this.devMdlCd = ''
            this.devMdlList = []
          }
        })
        .catch((e) => {
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
        callback: (data) => {
          this.devMdlList = data.data
        }
      })
    },
    fnGetList() {
      var searchData = {}
      searchData.currentPage = this.currentPage
      searchData.displayRowCount = this.displayRowCount
      searchData.svcCd = this.svcCd
      searchData.devClsCd = this.devClsCd
      searchData.devMdlCd = this.devMdlCd
      searchData.statusSearchType = this.statusSearchType
      searchData.searchType = this.searchType
      searchData.searchKey = this.searchKey
      searchData.startDate = this.startDate
      searchData.endDate = this.endDate

      if (this.startDate && this.endDate) {
        searchData.startDate = moment(this.startDate).format('YYYYMMDD').toString()
        searchData.endDate = moment(this.endDate).format('YYYYMMDD').toString()
      }

      requestApi({
        url: '/online/iotcolsource/retrieveIotColSourceList',
        headers: {
          'X-MID': 'P00003'
        },
        method: 'post',
        data: searchData,
        callback: (res) => {
          this.dataList = res.data.colSourceList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    modifyPopup: _.throttle(
      function (id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/report/ColSourceDetail'),
          title: this.$t('colsource-detail'),
          width: '900',
          height: '770',
          data: {
            colSeq: object.colSeq
          },
          callback: (res) => {
          }
        })
      },
      1000, { 'trailing': false }
    ),
    fnSearchList() {
      this.currentPage = 1
      this.fnGetList()
    },
    searchInit() {
      this.svcCd = 'all'
      this.devClsCd = ''
      this.devMdlCd = ''
      this.devMdlList = {}
      this.searchType = ''
      this.searchKey = null
      this.statusSearchType = 'all'
      this.currentPage = 1
      this.initDate()
    }
  }

}
</script>

<style lang="less" scoped>
  // 2개 가로스크롤 방지
  // 가로스크롤
  .ui-jqgrid .ui-jqgrid-bdiv{ overflow-x:auto; }
  // 컬럼 한줄 표시(줄바꿈 막음)
  .ui-jqgrid tr.jqgrow td{padding:5px;border-color:#d4dce4;white-space: nowrap;}
</style>
