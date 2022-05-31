<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">서비스</span>
          <select v-model="svcCd" ref="svcCd" class="form-control" title="서비스" @change="fnGetDevClsList">
            <option v-for="(svc, index) in svcCdList" :key="`svcCd-${index}`" :value="svc.svcCd">{{ svc.svcCdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('dev-cls')}}</span>
          <select v-model="devClsCd" class="form-control" title="장비유형" @change="fnChangeDevClsCd">
            <option v-for="(devCls, index) in devClsList" :key="`devCls-${index}`" :value="devCls.devClsCd" @change="fnGetDevMdlList">
              {{devCls.devClsNm}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('dev-mdl-nm')}}</span>
          <select v-model="devMdlCd" class="form-control" title="장비 모델" >
            <option value="">{{$t('all')}}</option>
            <option v-for="(devMdl, index) in devMdlList" :key="`devMdlCd-${index}`" :value="devMdl.devMdlCd">
              {{devMdl.devMdlNm}}
            </option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="searchType" class="form-control" title="검색 분류"><option v-for="(item , index) in searchTypeList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" v-model="searchText" class="form-control" placeholder="" title="검색어 입력" :readonly="searchType === ''" @keyup.enter="search">
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializeSeach" >{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
        <button type="button" class="btn btn-pink" data-toggle="modal" data-target="#modal-write" @click="controlPopup('A')" id="all-reg-btn">{{$t('control')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="statusAcutator"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'StatusActuatorSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00007',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      searchType: '', // 선택 조건
      searchText: '',
      statusCd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [], // 서비스 옵션
      devClsList: [], // 장비유형 옵션
      devMdlList: [], // 장비모델 옵션
      dataList: [], // 제어 목록
      colNameList: [],
      colModelData: [],
      rowNum: 0,
      progId: '',
      tmpCdId: '',
      searchTypeList: [
        { value: '', name: this.$t('search-type') },
        { value: 'entityId', name: this.$t('entity-id') },
        { value: 'ctn', name: this.$t('pin') + '(' + this.$t('ctn') + ')' },
        { value: 'usingNo', name: this.$t('using-no') },
        { value: 'devUname', name: this.$t('pin-nm') }
      ]
    }
  },
  computed: {},
  watch: {
    searchType() {
      if (this.searchType === '') {
        this.searchText = ''
      }
    }
  },
  async created() {
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetIotProg()
  },
  mounted() {},
  methods: {
    // ----------------- 옵션 항목 조회
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then((data) => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
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
            }
            resolve()
          })
          .catch((e) => {
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
        callback: (data) => {
          this.devMdlList = data.data
        }
      })
    },
    // --------------------- 리스트 헤더 조회
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/equipment/StatusActuatorSvc',
        currentPage: 1,
        displayRowCount: 1
      }
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.data.length === 0) {
            this.alert(this.$t('stat-act-prog-null-alert'))
            return
          }

          // 프로그램 ID 셋팅
          this.progId = res.data.dataList[0].progId
          this.fnGetIotTmpId(res.data.dataList[0].progSeq)
        }
      })
    },
    fnGetIotTmpId(progSeq) {
      // 템플릿 아이디 조회
      requestApi({
        url: '/online/com/tmpl/getIotTmplCdId',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { progSeq },
        callback: (res) => {
          // 템플릿ID 셋팅
          this.tmpCdId = res.data.tmplCdId
          this.fnGetTmplHeaderList()
        }
      })
    },
    fnGetTmplHeaderList() {
      let reqData = {
        progId: this.progId,
        tmpCdId: this.tmpCdId,
        devClsCdId: this.devClsCd
      }
      requestApi({
        url: '/online/com/tmpl/retrieveJqData',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.data === undefined) {
            return false
          }
          this.colModelData = []
          this.colNameList = res.data[0].colNameList
          for (let i = 0; i < res.data.length; i++) {
            this.colModelData.push(JSON.parse(res.data[i].colModelData))
          }

          this.$nextTick(() => {
            this.$refs.grid.init()
          })
          // 장비조회
          this.fnGetList()
        }
      })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        statusCd: this.statusCd
      }

      if (this.searchType === 'entityId') {
        reqData.entityId = this.searchText.trim()
      } else if (this.searchType === 'ctn') {
        reqData.ctn = this.searchText.trim()
      } else if (this.searchType === 'usingNo') {
        reqData.usingNo = this.searchText.trim()
      } else if (this.searchType === 'devUname') {
        reqData.devUname = this.searchText.trim()
      }

      requestApi({
        url: '/online/iotctr/retrieveIotCtrlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (data) => {
          this.dataList = data.data.dataList
          this.totPage = data.data.page.totPage
          this.currentPage = data.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetIotProg()
    },
    fnInitializeSeach() {
      this.currentPage = 1
      this.svcCd = this.svcCdList[0].svcCd
      this.devMdlCd = ''
      this.searchType = '' // 선택 조건
      this.searchText = ''
      this.statusCd = ''
      this.fnGetDevClsList()
    },
    // --------------------- 팝업
    controlPopup: _.throttle(
      function() {
        let idArr = this.$refs.grid.getSelectionIndexs()
        if (idArr.length === 0) {
          this.alert(this.$t('stat-act-device-null-alert'))
          return false
        }

        let entrDevList = []
        let devMdlCdList = []
        let entrDevSeqArr = []
        let checkUuid = true
        let checkCtlSvr = true
        let ctlSvrType = ''
        let apiUri = ''

        for (let i = 0; i < idArr.length; i++) {
          let row = this.dataList[idArr[i]]
          entrDevSeqArr.push(row.entrDevSeq)
          entrDevList.push({ 'entrNo': row.entrNo, 'ctn': row.ctn, 'entityId': row.devUuid })
          devMdlCdList.push(row.devMdlCd)
          if (row.devUuid === null || row.devUuid === '') {
            checkUuid = false
          }
          // 제어룰 설정 검사
          if (row.ctlSvrSeq === null || row.ctlSvrSeq === '') {
            checkCtlSvr = false
          }

          // PSM 장비 구분
          ctlSvrType = row.ctlSvrType

          // API URI
          apiUri = row.apiUri
        }

        // 모델코드 중복제거
        devMdlCdList = devMdlCdList.reduce((a, b) => {
          if (a.indexOf(b) < 0) {
            a.push(b)
          }
          return a
        }, [])

        if (devMdlCdList.length >= 2) {
          this.alert(this.$t('stat-act-mdl-same-alert'))
          return false
        }

        // entity Id 확인
        if (!checkUuid) {
          this.alert(this.$t('stat-act-entity-null-alert'))
          return false
        }

        // 제어대상서버 설정 확인
        if (!checkCtlSvr) {
          this.alert(this.$t('stat-act-ctlSvr-null-alert'))
          return false
        }

        this.popup({
          component: () => import('@/views/equipment/StatusActuatorAllCtlSvc'),
          title: this.$t('device-control'),
          width: '700',
          height: '500',
          data: {
            entrDevSeqAr: entrDevSeqArr,
            entrDevList: entrDevList,
            devMdlCd: devMdlCdList[0],
            ctlSvrType: ctlSvrType,
            apiUri: apiUri
          },
          callback: () => {
            this.fnGetList()
            this.$refs.grid.resetSelection()
          },
          dismiss: () => {
            this.$refs.grid.resetSelection()
          }
        })
      },
      1000,
      { 'trailing': false }
    )
  }
}
</script>

<style></style>
