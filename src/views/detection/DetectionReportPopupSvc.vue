<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <!-- 장비유형 -->
        <div class="form-group">
          <span class="form-control-static">{{$t('device-type')}}</span>
        </div>
        <div class="form-group">
          <select v-model="selectedCls" name="" class="form-control" title="검색 분류" disabled>
            <!-- <option value="all">{{$t('all')}}</option> -->
            <option v-for="devCls in devClsList" :key="'devCls'+devCls.devClsCd" :value="devCls.devClsCd">{{ devCls.devClsCdNm }}</option>
          </select>
        </div>
        <!-- 장비모델 -->
        <!-- <div class="form-group">
          <select v-model="selectedDev" name="" class="form-control" title="검색 분류">
            <option value="all">{{$t('dev-mdl')}}</option>
            <option v-for="devMdl in devMdlList" :key="'devMdl'+devMdl.devMdlCd" :value="devMdl.devMdlCd">{{ devMdl.devMdlNm }}</option>
          </select>
        </div> -->
        <div class="form-group">
          <span class="form-control-static">{{$t('symptom-grade')}}</span>
        </div>
        <div class="form-group">
          <select class="form-control" title="" v-model="statusCd">
            <option v-for="status in detStatusList" v-bind:key="status.cdId" :value="status.detStatusCd">{{ status.detStatusNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="searchDev(true)">{{$t('search')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click.prevent="excelDownload()" data-toggle="modal" data-target="#modal-write">{{$t('excel-download')}}</button>
    </div>
    <div class="grid-container grid-scroll">
      <table id="detectionReportTb"><tr><td /></tr></table>
      <div id="detectionReportTbFooter" class="grid-paging"></div>
    </div>
 </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'

export default {
  name: 'DetectionReportPopupSvc',
  components: {},
  created () {
    this.selectedCls = this.data.devClsCd

    this.getIotProg()
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
      progId: null,
      tmplCdId: null,
      // 선택된 장비 유형값
      selectedCls: 'all',
      // 선택된 장비 모델값
      selectedDev: 'all',
      // 선택된 장애 수준값
      selectedDetStatus: 'all',
      // 선택된 검색 타입 : 사용번호, 식별번호, 식별이름
      selectedSearchType: 'all',
      // 검색어
      searchText: '',
      // 장비 유형 리스트
      devClsList: [],
      // 장비 모델 리스트
      devMdlList: [],
      // 장애 수준 리스트
      detStatusList: [],
      startDate: null,
      endDate: null,
      startConvertDate: null,
      endConvertDate: null,
      excelSelectedCls: null,
      excelSelectedDev: null,
      excelSelectedDetStatus: null,
      excelSearchType: null,
      excelSearchText: null,
      excelStartDate: null,
      excelEndDate: null,
      mydata: [],
      colNameData: [],
      colModelData: [],
      localReader: {
        root: 'root',
        page: 'page',
        total: 'total',
        records: 'records'
      },
      currentPage: 1,
      displayRowCount: 15,
      rowNum: 15,
      statusList: {},
      statusCd: '',
      statusNm: '',
      excelStatusCd: '',
      excelorgSeq: ''
    }
  },
  mounted () {
  },
  methods: {
    setGrid() {
      var context = this
      $('#detectionReportTb').jqGrid('GridUnload')
      $('#detectionReportTb').jqGrid({
        datatype: 'local',
        data: this.mydata,
        colNames: this.colNameData,
        colModel: this.colModelData,
        rowNum: this.rowNum,
        rowList: [15, 30, 45, 100],
        // multiselect: true,
        // multiselectWidth: 20,
        // multiboxonly: true,
        pager: '#detectionReportTbFooter',
        sortorder: 'desc',
        sortable: true,
        height: '100%',
        autowidth: true,
        // localReader: this.localReader,
        width: this.getGridWidth(),
        beforeSelectRow: function (rowid, e) {
          var $myGrid = $(this)
          var i = $.jgrid.getCellIndex($(e.target).closest('td')[0])
          var cm = $myGrid.jqGrid('getGridParam', 'colModel')
          return (cm[i].name === 'cb')
        },
        loadComplete: function (data) {
          let grid = $('#detectionReportTb')
          grid.jqGrid('setGridParam', {
            page: context.totPage ? context.currentPage : 0,
            lastpage: context.totPage
          })
          $('#detectionReportTb')[0].updatepager()
        },
        onCellSelect: (id, index, contents, event) => {
        },
        ondblClickRow: (rowid, status, e) => {
          let rowData = $('#detectionReportTb').jqGrid('getRowData', rowid)
          if (rowData.ctn === null || rowData.ctn === undefined || rowData.ctn === '') {
            this.alert(this.$t('no-ctn-chk-msg'))
            return
          }

          context.reportHistPop(rowData.ctn)
        },
        onPaging: (pgButton) => { // records
          var prePage = context.currentPage
          context.currentPage =
            pgButton === 'next_detectionReportTbFooter' ? parseInt(context.currentPage) + 1
              : pgButton === 'prev_detectionReportTbFooter' ? parseInt(context.currentPage) - 1
                : pgButton === 'first_detectionReportTbFooter' ? 1
                  : pgButton === 'last_detectionReportTbFooter' ? $('#detectionReportTb').getGridParam('lastpage')
                    : pgButton === 'user' ? $('.ui-pg-input').val() : 1

          context.displayRowCount = $('.ui-pg-selbox option:selected').val()
          this.rowNum = context.displayRowCount
          if (context.currentPage > context.totPage) {
            this.alert(this.$t('notExitPage'))
            context.currentPage = prePage
            $('#detectionReportTb')
              .jqGrid('setGridParam', {
                page: context.currentPage
              })
            $('#detectionReportTb')[0].updatepager()
            return 'stop'
          } else {
            context.searchDev(false)
          }
        }
      })
      $('.ui-pg-selbox option[value=' + context.displayRowCount + ']').attr('selected', 'selected')
      $(function() {
        $('#detectionReportTb').setGridWidth(context.getGridWidth(), true)
      })
      $(window).resize(function() {
        $('#detectionReportTb').setGridWidth(context.getGridWidth(), true)
      })
    },
    getGrid() {
      return $('#detectionReportTb')
    },
    getGridWidth() {
      var w = $(window).outerWidth() - 40
      if ($('body').outerWidth() > 1281) {
        $('.ui-jqgrid .ui-jqgrid-hdiv,.ui-jqgrid .ui-jqgrid-bdiv,.ui-jqgrid .ui-jqgrid-htable,.ui-jqgrid .ui-jqgrid-btable').css('min-width', w)
      } else {
        $('.ui-jqgrid .ui-jqgrid-hdiv,.ui-jqgrid .ui-jqgrid-bdiv,.ui-jqgrid .ui-jqgrid-htable,.ui-jqgrid .ui-jqgrid-btable').css('min-width', '1280px')
      }
    },
    fnDetStatus() {
      // 장애 수준 리스트 조회
      requestApi({
        url: '/online/iotedev/retrieveIotDetStatus',
        headers: {
          'X-MID': 'P00109',
          'X-VNAME': 'ONLINE'
        },
        callback: (data) => {
          for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].detStatusCd !== 'DS00000007') {
              this.detStatusList.push(data.data[i])
            }
          }
        },
        method: 'post',
        data: {}
      })
    },
    fnDevClsList() {
      var reqData = {}
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevClsList',
        headers: {
          'X-MID': 'P00109'
        },
        callback: (data) => {
          this.devClsList = data.data
          if (data.data) {
            this.selectedCls = this.data.devClsCd
            this.statusCd = this.data.symptomGrade
            this.fnDetStatus()
            this.searchDev(true)
          }
        },
        method: 'post',
        data: reqData
      })
    },
    // 검색
    searchDev(isSearch) {
      let reqData = {}

      if (isSearch) this.currentPage = 1

      reqData.progId = this.progId
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount

      if (this.selectedCls === 'all') {
        reqData.devClsCd = null
      } else {
        reqData.devClsCd = this.selectedCls
      }

      reqData.searchOrg = this.data.searchOrg

      if (this.statusCd === '') {
        reqData.detStatusCd = null
      } else {
        reqData.detStatusCd = this.statusCd
      }

      this.excelSelectedCls = this.selectedCls
      this.excelStatusCd = this.statusCd
      this.excelorgSeq = this.data.searchOrg
      this.fnTmplHeaderList(reqData)
    },
    // 장애이력 데이터 조회
    fnSearchGridData(reqData) {
      requestApi({
        url: '/online/iotedev/retrieveIotEntrDevCurDetList',
        headers: {
          'X-MID': 'P00109',
          'X-VNAME': 'ONLINE'
        },
        callback: (data) => {
          this.mydata = data.data.boradList
          this.setGrid()
          this.totPage = data.data.page.totPage
          this.currentPage = data.data.page.page

          $('#detectionReportTb')
            .jqGrid('clearGridData')
            .jqGrid('setGridParam', {
              page: data.data.page.page, // 현재 페이지
              lastpage: data.data.page.totPage, // 전체 페이지
              currentPage: data.data.page.page // 전체 페이지
            })
          var grid = $('#detectionReportTb')
          var dataIndex = 1
          data.data.boardList.forEach(rowData => {
            grid.addRowData(dataIndex++, rowData)
          })
          if (!this.totPage) {
            grid.trigger('reloadGrid')
          }
        },
        method: 'post',
        data: reqData
      })
    },
    excelDownload() {
      let reqData = {}
      if (this.excelSearchText !== '') {
        if (this.excelSearchType === 'usingNo') {
          reqData.usingNo = this.excelSearchText
        } else if (this.excelSearchType === 'ctn') {
          reqData.ctn = this.excelSearchText
        } else {
          reqData.devUname = this.excelSearchText
        }
      }
      reqData.progId = this.progId
      reqData.devClsCd = this.excelSelectedCls
      reqData.devMdlCd = this.excelSelectedDev
      if (this.excelSelectedCls === 'all') {
        reqData.devClsCd = null
      } else {
        reqData.devClsCd = this.excelSelectedCls
      }
      if (this.excelSelectedDev === 'all') {
        reqData.devMdlCd = null
      } else {
        reqData.devMdlCd = this.excelSelectedDev
      }
      if (this.excelStatusCd === '') {
        reqData.detStatusCd = null
      } else {
        reqData.detStatusCd = this.excelStatusCd
      }
      // reqData.detStatusCd = this.excelSelectedDetStatus
      reqData.searchStartDttm = this.excelStartDate
      reqData.searchEndDttm = this.excelEndDate
      reqData.searchOrg = this.excelorgSeq
      requestDownloadApi({
        url: '/online/iotedev/downloadIotEntrDevCurDetList',
        headers: {
          'X-MID': 'P00109',
          'X-VNAME': 'ONLINE'
        },
        callback: (data) => {},
        data: reqData
      })
    },
    toObject(str) {
      var obj = {}
      var contents = str.replace('{', '').replace('}', '').replace(/"/gi, '').split(',')
      for (let i = 0; i < contents.length; i++) {
        var keyvalue = contents[i].split(':')
        obj[keyvalue[0].trim()] = keyvalue[1].trim()
      }

      return obj
    },
    getIotProg() {
      var reqData = {}
      reqData.progNm = ''
      reqData.uiPath = '/views/detection/DetectionReportPopupSvc'
      reqData.currentPage = 1
      reqData.displayRowCount = 1
      var context = this
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': 'P00109'
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.data.length === 0) {
            this.alert('프로그램 ID가 존재하지 않습니다.', 'warning')
            return
          }

          // 프로그램 ID 셋팅
          context.progId = res.data.dataList[0].progId
          context.getIotTmpId(res.data.dataList[0].progSeq)
        }
      })
    },
    getIotTmpId(progSeq) {
      var reqData = {}
      reqData.progSeq = progSeq
      var context = this
      requestApi({
        url: '/online/com/tmpl/getIotTmplCdId',
        headers: {
          'X-MID': 'P00109'
        },
        callback: (res) => {
          // 템플릿ID 셋팅
          context.tmpCdId = res.data.tmplCdId
          context.fnDevClsList()
        },
        method: 'post',
        data: reqData
      })
    },
    fnTmplHeaderList(parReqData) {
      var reqData = {}

      reqData.progId = this.progId
      reqData.tmpCdId = this.tmpCdId
      reqData.devClsCdId = this.selectedCls
      var context = this
      requestApi({
        url: '/online/com/tmpl/retrieveJqData',
        headers: {
          'X-MID': 'P00109'
        },
        callback: (res) => {
          if (res.data === undefined) {
            return
          }

          var length = context.colModelData.length
          for (let i = 0; i < length; i++) {
            context.colModelData.pop()
          }
          context.colNameData = res.data[0].colNameList
          for (let i = 0; i < res.data.length; i++) {
            context.colModelData.push(JSON.parse(res.data[i].colModelData))
          }
          context.fnSearchGridData(parReqData)
        },
        method: 'post',
        data: reqData
      })
    },
    reportHistPop: _.throttle(
      function (ctn) {
        this.popup({
          component: () => import('@/views/report/CollectorReportHistPopSvc'),
          title: this.$t('collReportHist'),
          width: 'wide',
          data: {
            ctn: ctn,
            devClsCd: this.selectedCls
          },
          callback: (data) => {
            if (data !== 'dismiss') {
              for (var i = 0; i < data.length; i++) {
                this.userInfo.push(data[i])
              }
            }
          }
        })
      },
      1000, { 'trailing': false }
    )
  }
}
</script>

<style lang="less" scoped>
</style>
