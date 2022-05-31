<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
            >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select
            v-model="devClsCd"
            class="form-control"
            title=""
            @change="fnChangeDevClsCd()"
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
          <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
          <select v-model="devMdlCd" class="form-control" title="">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devMdlCd-${index}`"
              :value="devMdl.devMdlCd"
            >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <!-- 고객사명 -->
        <div class="form-group">
          <span class="form-label mx-1">{{$t('cust-nm')}}</span>
          <select class="form-control" v-model="selectedCst" >
            <option value=-1>{{$t('all')}}</option>
            <option v-for="item in customerList" v-bind:key="item.custSeq" :value="item.custSeq">{{ item.custNm }}</option>
          </select>
        </div>
        <div class="form-group" v-show="isAdmin">
          <select class="form-control" v-model="selectedCst" v-show="isAdmin" >
            <!-- XXXXXXXXX 고객사 콤보박스 변경시 발생하는 이벤트 제거 -->
            <option value="">{{$t('all')}}</option>
            <option v-for="item in customerList" v-bind:Key="item.custSeq" :value="item.custSeq">{{ item.custNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializeSeach()" >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="fnAddPopup()">{{$t('create')}}</button>
      <button type="button" class="btn btn-gray " @click="fnDelete()">{{$t('delete')}}</button>
      <button type="button" class="btn btn-gray " @click="memoryPopup('rules',$t('ruleInit'))">{{$t('ruleInit')}}</button>
      <button type="button" class="btn btn-gray " @click="memoryPopup('settings',$t('svrInit'))">{{$t('svrInit')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="statusEquip"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import moment from 'moment'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'IntrnSvrCnctnSvc',
  components: {
    Jqgrid
  },
  props: {
  },
  data () {
    return {
      progId: null,
      tmpCdId: null,
      dataList: [],
      colNameList: [this.$t('service'), this.$t('dev-cls'), this.$t('dev-mdl'), this.$t('cust-nm'), this.$t('col-passing-yn'), this.$t('col-data-save-yn'), this.$t('col-symp-yn'), this.$t('col-accu-yn'), this.$t('col-out-yn'), this.$t('col-diag-yn'), 'colSvrSeq'],
      colModelList: [
        { 'name': 'svcNm', 'index': 'svcNm', 'align': 'center' },
        // { 'name': 'svcNm', 'index': 'svcNm', 'align': 'center' },   - XXXXXXXXX 그리드에서 서비스명 제거
        { 'name': 'devClsNm', 'index': 'devClsNm', 'align': 'center' },
        { 'name': 'devMdlNm', 'index': 'devMdlNm', 'align': 'center' },
        { 'name': 'custNm', 'index': 'custNm', 'align': 'center' },
        { 'name': 'colPassingYn', 'index': 'colPassingYn', 'align': 'center' },
        { 'name': 'colDataSaveYn', 'index': 'colDataSaveYn', 'align': 'center' },
        { 'name': 'colSympYn', 'index': 'colSympYn', 'align': 'center' },
        { 'name': 'colAccuYn', 'index': 'colAccuYn', 'align': 'center' },
        { 'name': 'colOutYn', 'index': 'colOutYn', 'align': 'center' },
        { 'name': 'colDiagYn', 'index': 'colDiagYn', 'align': 'center' },
        { 'name': 'colSvrSeq', 'index': 'colSvrSeq', 'hidden': true }
      ],
      selectedSvc: 'all',
      selectedCst: -1,
      startDate: null,
      endDate: null,
      startConvertDate: null,
      endConvertDate: null,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      svcNmList: [],
      outSvrList: [],
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
      devClsCd: null,
      devMdlCd: null,
      devMdlNm: null,
      // svcNm: null,     - XXXXXXXXX 조회 조건에서 서비스명 제거
      customerList: [],
      getCustList: [],
      dataObj: { custSeq: '' },
      serverNm: null,
      syncYn: false,
      delSuccess: 0,
      svcCd: '',
      totPage: null,
      xMid: 'P20030'
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
  created () {},
  async mounted () {
    this.fnInitDate()
    this.getCustNmList()
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetList()
  },
  computed: {
  },
  methods: {
    fnInitDate() {
      // 초기 날짜 설정
      let beforeWeek = new Date()
      beforeWeek.setDate(beforeWeek.getDate() - 6)
      this.startDate = moment(beforeWeek).toDate()
      this.endDate = moment(new Date()).toDate() // new Date()와 같음
    },
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        if (this.svcCd === '') {
          this.devClsCd = ''
          this.devClsList = []
          return false
        }
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            if (this.devClsList.length > 0) {
              this.devClsCd = this.devClsList[0].devClsCd
              this.fnGetDevMdlList({ devClsCd: this.devClsCd })
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnChangeDevClsCd() {
      this.fnGetDevMdlList()
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
        callback: data => {
          this.devMdlList = data.data
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList(true)
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let data = this.dataList[id]
        this.popup({
          component: () => import('@/views/intrnsrv/IntrnSvrCnctnModPopSvc'),
          title: this.$t('intrnSvrCnctn-modify'),
          width: '450',
          height: '520',
          data: {
            idx: data
          },
          callback: (data) => {
            this.fnGetList()
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnAddPopup() {
      this.popup({
        component: () => import('@/views/intrnsrv/IntrnSvrCnctnAddPopSvc'),
        title: this.$t('intrnSvrCnctn-create'),
        width: '450',
        height: '520',
        data: {},
        callback: (data) => {
          this.search()
        }
      })
    },
    fnDelete() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      if (typeof selectedIds !== 'undefined' && selectedIds.length > 0) {
        this.confirm(this.$t('selected-delete'), this.deleteIotIntrnSvrCnctn)
      } else {
        this.alert(this.$t('unselected-delete'), 'warning')
      }
    },
    deleteIotIntrnSvrCnctn() {
      let idArry = this.$refs.grid.getSelectionIndexs()
      const rowNum = this.$refs.grid.getGridReccount()
      // const last = this.$refs.grid.getLastPage()
      const last = this.totPage
      this.delSuccess = 0
      for (var idx in idArry) {
        let paramsObj = {}
        var rowdata = this.$refs.grid.getRowData(idArry[idx])
        paramsObj.colSvrSeq = rowdata.colSvrSeq

        requestApi({
          url: '/online/iotoutsvrreport/deleteIotIntrnSvrCnctn',
          method: 'post',
          headers: {
            'X-MID': this.xMid
          },
          data: paramsObj,
          callback: (res) => {
            if (res.result.status === '200' || res.result.status === '204') {
              this.delSuccess++
            }
            this.delProcess(this.delSuccess, idArry.length, rowNum, last, idArry)
          }
        })
      }
    },
    delProcess (delSuccessCnt, selectedRowCnt, rowNum, last, idArry) {
      if (delSuccessCnt === 0) {
        // return
      } else if (delSuccessCnt === selectedRowCnt) {
        // 재전송 성공/실패 메시지 팝업 처리 해야됨
        this.search()
        this.alert(this.$t('del-success'), 'success')
        // 삭제시 마지막 페이지 계산
        // 삭제했을 경우 마지막 페이지 이면서 행의 수가 없으면 마지막페이지가 아닌 바로 전 페이지로 이동
        if (this.currentPage === last) {
          if (parseInt(rowNum) === parseInt(idArry.length)) {
            if (this.currentPage !== 1) {
              this.currentPage = this.currentPage - 1
            }
          }
        }
      }
    },
    fnInitializeSeach() {
      this.fnInitDate()
      this.selectedCst = -1
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = this.devClsList[0].devClsCd
      this.devMdlCd = ''
      this.devMdlList = []
    },
    // 내부서버연동설정 조회
    fnGetList() {
      var reqData = {}
      // 조회시에
      if (this.startDate !== null) {
        this.startConvertDate = this.startDate.getFullYear() + ('00' + (this.startDate.getMonth() + 1)).slice(-2) + ('00' + this.startDate.getDate()).slice(-2)
      } if (this.endDate !== null) {
        this.endConvertDate = this.endDate.getFullYear() + ('00' + (this.endDate.getMonth() + 1)).slice(-2) + ('00' + this.endDate.getDate()).slice(-2)
      }

      reqData.custSeq = this.custSeq
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchStartDttm = this.startConvertDate
      reqData.searchEndDttm = this.endConvertDate
      let context = this
      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.devClsCd
      reqData.devMdlCd = this.devMdlCd
      reqData.custSeq = this.selectedCst
      // reqData.svcCd = this.selectedSvc  - XXXXXXXXX 서비스명은 유저정보에서 받아와야 함

      requestApi({
        url: '/online/iotoutsvrreport/intrnSvrCnctnList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (data) => {
          // 조회할 데이터 없을시
          var dataleng = data.data.intrnSvrCnctnList.length
          // $('#nodata').remove()
          if (dataleng === 0) {
            this.syncYn = false
            // $('#outSvrRtReportTb.ui-jqgrid-btable').after("<p id='nodata' style='margin-top: 10px; margin-bottom: 10px; text-align: center; font-weight: bold;'>검색된 자료가 없습니다</p>")
          } else {
            this.syncYn = true
          }

          context.dataList = data.data.intrnSvrCnctnList
          context.totPage = data.data.page.totPage
          context.currentPage = data.data.page.page
        }
      })
    },
    getCustNmList() {
      const paramObj = {}
      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.customerList = res.data.cmnctSttsCustNmList
            this.dataObj.custSeq = res.data.cmnctSttsCustNmList[0].custSeq
          }
        }
      })
    },
    fnSyncIntrnSvr() {
      let paramsObj = {}

      requestApi({
        url: '/online/iotoutsvrreport/syncIntrnSvrCnctn',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: paramsObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.search()
            this.alert(this.$t('sync-success'), 'success')
          } else {
            this.alert(this.$t('sync-fail'), 'warning')
          }
        }
      })

      this.fnGetList()
    },
    memoryPopup(actionDiv, title) {
      this.popup({
        component: () => import('@/views/intrnsrv/InitalServerIpSelectPopup'),
        title: title,
        width: '300',
        height: '210',
        data: {
          actionDiv: actionDiv
        },
        callback: (res) => {
          if (res !== 'dismiss') {
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
