<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="selectedValue"
            class="form-control"
            v-model="selectedValue"
            @change="fnSearchValChk()"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >{{item.optName}}</option>
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="retrieveValue"
            @keyup.enter="fnSearchList()"
          >
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >{{$t('search')}}</button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        @click="getModelMapHistExcel() "
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
      >{{$t('excel-download')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="mdlMapHistMgmtSvc"
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
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'MdlMapHistMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameList: [
        this.$t('row-num'),
        this.$t('mdlmMtDevMdlNm'),
        this.$t('mdlMapMtMdl'),
        this.$t('mdlMapMtMdlType'),
        this.$t('modelMapDttm')
      ],
      colModelList: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        {
          name: 'devMdlNm',
          index: 'devMdlNm',
          align: 'left',
          width: '100px'
        },
        { name: 'mdlNm', index: 'mdlNm', align: 'left' },
        { name: 'mdlTypeNm', index: 'mdlTypeNm', align: 'center' },
        { name: 'modelMapDttm', index: 'modelMapDttm', align: 'center' }
      ],
      selectObj: {
        seq: '',
        devMdlSeq: '',
        devMdlNm: '',
        learPreMdlSeq: '',
        learPreMdlNm: '',
        mdlTypeNm: '',
        mdlType: ''
      },
      retrieveValue: '',
      selectedValue: '',
      searchOpt:
        window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtSearchOpt,
      // devOpt: window.smartCodeInfo[Cookies.get('LOCALE')].mdlMapMgmtSearchMdlOpt,
      modifyFlag: false,
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      langSetArr: [],
      langSet: '',
      pageInfo: [],
      xMid: 'P00320'
    }
  },
  created() {
    this.selectedValue = ''
    this.devValue = ''
    this.retrieveValue = ''
    this.langSet = Cookies.get('LOCALE')
    this.fnGetList()
  },
  mounted() {
  },
  computed: {},
  methods: {
    fnInitChkValue() {
      this.selectObj = {
        seq: '',
        devMdlSeq: '',
        devMdlNm: '',
        learPreMdlSeq: '',
        learPreMdlNm: '',
        mdlTypeNm: '',
        mdlType: ''
      }
    },
    fnGetChkValue() {
      var rowid = $('input[name="ch"]:checked').val()
      var dataObj = this.dataList[rowid - 1]

      this.selectObj.seq = dataObj.seq
      this.selectObj.devMdlSeq = dataObj.devMdlSeq
      this.selectObj.devMdlNm = dataObj.devMdlNm
      this.selectObj.learPreMdlSeq = dataObj.learPreMdlSeq
      this.selectObj.learPreMdlNm = dataObj.learPreMdlNm
      this.selectObj.mdlTypeNm = dataObj.mdlTypeNm
      this.selectObj.mdlType = dataObj.mdlType
    },
    fnSearchValChk() {
      if (this.selectedValue === '') {
        this.retrieveValue = ''
      }
    },
    fnInitializeSeach() {
      this.currentPage = 1
      this.usingStatus = ''
      this.selectedValue = ''
      this.retrieveValue = ''
      // this.fnGetList()
    },
    fnSearchList() {
      // 검색시에 현재 페이지 설정
      this.currentPage = 1
      this.fnGetList()
    },
    fnGetList() {
      var reqData = {}

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.langSet = this.langSet

      requestApi({
        url: '/online/bscpmodelmap/getModelMapHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.pageNum = res.data.page.page
          this.totPage = res.data.page.totPage
          this.pageInfo = res.data.page
          this.dataList = res.data.dataList
        }
      })
    },
    modifyPopup: _.throttle(
      function (id, index, contents, event) {
        let object = this.dataList[id]
        if (object.mlTypeCd === 'LRN') {
          this.selectObj.mdlType = 'learn'
        }
        if (object.mlTypeCd === 'PRD') {
          this.selectObj.mdlType = 'pred'
        }
        this.selectObj.mdlTypeNm = object.mdlTypeNm
        this.selectObj.devMdlSeq = object.devMdlSeq
        this.selectObj.devMdlNm = object.devMdlNm
        this.selectObj.learPreMdlSeq = object.mdlSeq
        this.selectObj.learPreMdlNm = object.mdlNm
        this.selectObj.seq = '1' // 등록/수정(''/1) 상태값
        this.selectObj.rawMap = object.rawMap
        this.selectObj.mlApiTableType = object.mlApiTableType
        this.selectObj.mlDelayTypeCd = object.mlDelayTypeCd
        this.selectObj.modelMapSeq = object.modelMapSeq
        this.confirmAddPopup()
      },
      1000,
      { trailing: false }
    ),
    confirmAddPopup() {
      this.popup({
        component: () => import('@/views/smart/MdlMapHistDetailSvc'),
        title: this.$t('modelAttbMapHist'),
        width: '900',
        height: '550',
        data: {
          obj: this.selectObj
        },
        callback: data => {
          if (data !== 'dismiss') {
          }
        }
      })
    },
    getModelMapHistExcel() {
      var reqData = {}
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.langSet = this.langSet
      requestDownloadApi({
        url: '/online/bscpmodelmap/getModelMapHistExcel',
        headers: {
          'X-MID': this.xMid
        },
        callback: res => {},
        data: reqData
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
