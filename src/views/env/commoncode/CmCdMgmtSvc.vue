<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select
            class="form-control mr-1"
            v-model="searchCon"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >{{item.otpName}}</option>
          </select>
          <input
            type="text"
            class="form-control"
            v-model="searchVal"
            @keyup.enter="fnSearch"
            :readonly="searchCon === 'all'"
          >
        </div>
        <div class="form-group">
           <span class="form-control-static">{{$t('useYn')}}</span>
           <select name class="form-control" v-model="useYn">
            <option
              v-for="item in usingOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >{{item.otpName}}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-control-static">{{$t('langSet')}}</span>
          <select class="form-control" v-model="langSet">
            <option
              v-for="item in langSetArr"
              v-bind:key="item.cdId"
              :value="item.cdId"
            >{{item.cdNm}}</option>
          </select>
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearch"
          >{{$t('search')}}</button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitialize"
          >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button
          type="button"
          class="btn btn-pink"
          @click="fnShowAddPopup"
        >{{$t('registration')}}</button>
        <button
          type="button"
          class="btn btn-pink"
          @click="fnExceldownload"
        >{{$t('excel-download')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="cmcdMgmt"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'

export default {
  name: 'CmCdMgmtSvc',
  components: { Jqgrid },
  data() {
    return {
      searchCon: 'all',
      searchVal: '',
      useYn: 'all',
      langSet: 'all',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameData: [
        this.$t('code'),
        this.$t('cdNm'),
        this.$t('parentCdNm'),
        this.$t('parentCdId'),
        this.$t('level-1'),
        this.$t('level-2'),
        this.$t('level-3'),
        this.$t('useYn'),
        this.$t('description'),
        this.$t('regUsrId'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'cdId', index: 'cdId', align: 'center', width: '100px' },
        { name: 'cdNm', index: 'cdNm', align: 'left' },
        { name: 'parentCdNm', index: 'parentCdNm', align: 'left' },
        {
          name: 'parentCdId',
          index: 'parentCdId',
          align: 'center',
          width: '100px'
        },
        { name: 'level1', index: 'level1', align: 'left' },
        { name: 'level2', index: 'level2', align: 'left' },
        { name: 'level3', index: 'level3', align: 'left' },
        { name: 'useYnVal', index: 'useYnVal', align: 'center', width: '80px' },
        { name: 'cdDesc', index: 'cdDesc', align: 'center' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '80px' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      searchOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('parentCdNm'), optVal: 'parentCdNm' },
        { otpName: this.$t('parentCdId'), optVal: 'parentCdId' },
        { otpName: this.$t('cdNm'), optVal: 'cdNm' },
        { otpName: this.$t('code'), optVal: 'code' }
      ],
      usingOpt: [
        { otpName: this.$t('all'), optVal: 'all' },
        { otpName: this.$t('use'), optVal: 'Y' },
        { otpName: this.$t('use-no'), optVal: 'N' }
      ],
      langSetArr: []
    }
  },
  computed: {},
  watch: {
    searchCon() {
      if (this.searchCon === 'all') {
        this.searchVal = ''
      }
    }
  },
  created() {
    this.fnGetlangSetList()
  },
  mounted() {
    this.langSet = Cookies.get('LOCALE')
    this.fnGetList()
  },
  methods: {
    fnGetlangSetList() {
      var paramObj = {}
      paramObj.parentCdId = 'GN00000021'
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCd',
        headers: {
          'X-MID': 'P00075'
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.langSetArr = res.data
        }
      })
    },
    fnGetList() {
      let reqData = {
        searchCon: this.searchCon,
        useYn: this.useYn,
        langSet: this.langSet,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      if (this.searchVal) {
        reqData.searchVal = this.searchVal
      }
      requestApi({
        url: '/online/iotcmcd/retrieveIotCmCd',
        headers: {
          'X-MID': 'P00075'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.currentPage = res.data.page.page
            this.totPage = res.data.page.totPage
            res.data.dataList.forEach(row => {
              row.useYnVal = row.useYn === 'Y' ? this.$t('use') : this.$t('use-no')
            })
            this.dataList = res.data.dataList
          }
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchCon = 'all'
      this.searchVal = ''
      this.useYn = 'all'
      this.langSet = 'ko'
    },
    fnExceldownload() {
      let reqData = {
        searchCon: this.searchCon,
        useYn: this.useYn,
        langSet: this.langSet,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      if (this.searchVal) {
        reqData.searchVal = this.searchVal
      }
      requestDownloadApi({
        url: '/online/iotcmcd/excelDown',
        headers: {
          'X-MID': 'P00075'
        },
        method: 'post',
        data: reqData,
        callback: res => {}
      })
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/env/commoncode/CmCdMgmtAddSvc'),
        title: this.$t('cmCdAddSrv'),
        width: '500',
        height: '700',
        data: {},
        callback: data => {
          this.fnInitialize()
          this.fnGetList()
        }
      })
    },
    fnShowModifyPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/env/commoncode/CmCdMgmtModifySvc'),
        title: this.$t('cmCdModifySrv'),
        width: '500',
        height: '617',
        data: {
          idx: data.cdSeq
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style></style>
