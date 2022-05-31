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
            @change="fnGetDevClsList"
          >
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
            title
            @change="fnChangeDevClsCd()"
          >
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
          <select v-model="devMdlCd" class="form-control" title>
            <option value>{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devMdlCd-${index}`"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <select
            v-model="searchType"
            class="form-control mr-1"
            title="검색 분류"
          >
            <option
              v-for="(item, index) in searchTypeList"
              :key="'item' + index"
              :value="item.value"
              >{{ item.name }}</option
            >
          </select>
          <input
            type="text"
            v-model="searchText"
            class="form-control"
            placeholder
            title
            :readonly="searchType === ''"
            @keyup.enter="search()"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button
        type="button"
        id="downList"
        class="btn btn-pink"
        @click="excelDownload"
      >
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="collectorReport"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="collList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="fnDetailPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'CollectorReportSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P00013',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      searchType: '',
      searchText: '',
      statusCd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [], // 서비스 옵션
      devClsList: [], // 장비유형 옵션
      devMdlList: [], // 장비모델 옵션
      statusList: [], // 장비상태 옵션
      colNameList: [],
      colModelData: [],
      collList: [],
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
  watch: {},
  async created() {
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetIotProg()
  },
  mounted() {},
  methods: {
    // ------------------ 옵션
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
      // this.fnGetTmplHeaderList()
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
    // --------------------- 리스트 헤더 조회
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/report/CollectorReportSvc',
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
        callback: res => {
          if (res.data.length === 0) {
            this.alert('프로그램 ID가 존재하지 않습니다.', 'warning')
            return false
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
        callback: res => {
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
        callback: res => {
          if (res.data === undefined) {
            return
          }
          this.colModelData = []
          this.colNameList = res.data[0].colNameList
          for (let i = 0; i < res.data.length; i++) {
            this.colModelData.push(JSON.parse(res.data[i].colModelData))
          }
          // 그리드 초기화
          this.$nextTick(() => {
            this.$refs.grid.init()
          })

          // 수집 현황 조회
          this.fnGetList()
        }
      })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchText,
        statusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      requestApi({
        url: '/online/iotentrdevcol/retrieveEntrDevColList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status !== '200') {
            return false
          }

          // 리스트 내 dataObj json 파싱하여 목록으로 세팅
          if (res.data.entrDevColValList) {
            res.data.entrDevColValList = getDataObjOfList(
              res.data.entrDevColValList,
              'dataObj'
            )
          }

          this.collList = res.data.entrDevColValList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetIotProg()
    },
    fnInitializeSeach() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devMdlCd = ''
      this.searchType = '' // 선택 조건
      this.searchText = ''
      this.statusCd = ''
      this.fnGetDevClsList()
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchText,
        statusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId,
        tmplCdId: this.tmpCdId
      }
      requestDownloadApi({
        url: '/online/iotentrdevcol/downloadEntrDevColList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {}
      })
    },
    fnDetailPopup: _.throttle(
      function(id, index, contents, event) {
        let data = this.collList[id]
        if (!data.ctn || data.ctn === '') {
          this.alert(this.$t('no-ctn-chk-msg'), 'warning')
          return
        }
        this.popup({
          component: () => import('@/views/report/CollectorReportHistPopSvc'),
          title: this.$t('collReportHist'),
          width: 'wide',
          height: '840',
          data: {
            ctn: data.ctn,
            svcCd: this.svcCd,
            devClsCd: this.devClsCd,
            entrDevSeq: data.entrDevSeq
          },
          callback: data => {}
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style></style>
