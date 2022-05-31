<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <!-- 서비스 -->
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
        <!-- 장비유형 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select
            v-model="devClsCd"
            class="form-control"
            @change="fnChangeDevClsCd"
            title="장비유형"
          >
            <option
              v-for="(devCls, index) in devClsList"
              :key="`devCls-${index}`"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <!-- 장비모델 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
          <select
            v-model="devMdlCd"
            class="form-control"
            title="장비모델"
          >
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList" :key="`devMdlCd-${index}`" :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <select
            v-model="searchType"
            class="form-control"
            title="검색 분류"
          >
            <option v-for="(item , index) in searchTypeList" :key="'item' + index" :value="item.value">{{ item.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <input type="text" v-model="searchText" class="form-control" title="검색어" @keyup.enter="search" />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('duration') }}</span>
          <!-- 기간검색 -->
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{ days: 7 }"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('symptom-grade') }}</span>
          <select class="form-control" title="이상등급" v-model="detStatusCd">
            <option value="">전체</option>
            <option v-for="status in detStatusList" :key="status.cdId" :value="status.cdId">{{ status.cdNm }}</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search()">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitializeSeach()">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        @click="excelDownload()"
      >
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="detectionReport"
      :colModels="colModelData"
      :multiselect="false"
      :colNames="colNameList"
      :dataList="detList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import Jqgrid from '@/components/Jqgrid'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId } from '@/api/common/code'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'DetectionReportSvc',
  components: { DatetimePicker, Jqgrid },
  data() {
    return {
      xMid: 'P00009',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      searchType: 'all',
      searchText: '',
      startDate: null,
      endDate: null,
      statusCd: '',
      detStatusCd: '',
      specDv99: false, // 통신이상
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [], // 서비스 옵션
      devClsList: [], // 장비유형 옵션
      devMdlList: [], // 장비모델 옵션
      detStatusList: [], // 장애수준 옵션
      detList: [],
      colNameList: [],
      colModelData: [],
      progId: '',
      tmpCdId: '',
      searchTypeList: [
        { value: 'all', name: this.$t('search-type') },
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
    this.fnGetDetStatusList()
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.search()
  },
  mounted() {
    this.fnInitDates()
  },
  methods: {
    fnInitDates() {
      this.startDate = moment().subtract(6, 'days').toDate()
      this.endDate = moment().toDate()
    },
    // 옵션
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then((data) => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
              resolve()
            }
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
    fnGetDetStatusList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'DS00000001' }).then((data) => {
        this.detStatusList = data
      }).catch((e) => { console.error(e) })
    },
    // --------------------- 리스트 헤더 조회
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/detection/DetectionReportSvc',
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

          // 이상징후 조회
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
        devStatusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId
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

      if (this.startDate && this.startDate !== '') {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDD')
      }

      if (this.endDate && this.endDate !== '') {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDD')
      }

      if (this.detStatusCd !== '') {
        reqData.detStatusCd = this.detStatusCd
      }

      // 화면에서 불필요하여 false로 하드 코딩!
      if (this.specDv99) {
        reqData.commStatusCd = '99'
      }

      requestApi({
        url: '/online/iotedev/retrieveIotEntrDevDetList',
        headers: {
          'X-MID': this.xMid,
          'X-VNAME': 'ONLINE'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data.boardList) {
            res.data.boardList = getDataObjOfList(res.data.boardList, 'colData')
          }
          this.detList = res.data.boardList
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
      this.fnGetDevClsList()
      this.devMdlCd = ''
      this.searchType = 'all' // 선택 조건
      this.searchText = ''
      this.startDate = null
      this.endDate = null
      this.detStatusCd = ''
      this.statusCd = ''
      this.specDv99 = false
      this.fnInitDates()
    },
    // 엑셀
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        devStatusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD')
      }

      if (this.searchType === 'usingNo') {
        reqData.usingNo = this.searchText
      } else if (this.searchType === 'ctn') {
        reqData.ctn = this.searchText
      }

      if (!this.detStatusCd && this.detStatusCd !== '') {
        let detStatus = this.detStatusList.find(c => c.cdId === 'detStatusCd')
        reqData.detStatusCd = detStatus.cdNm
      }

      if (this.specDv99) {
        reqData.commStatusCd = '99'
      }
      requestDownloadApi({
        url: '/online/iotedev/downloadIotEntrDevDetList',
        headers: {
          'X-MID': this.xMid,
          'X-VNAME': 'ONLINE'
        },
        data: reqData,
        callback: data => {}
      })
    }
  }
}
</script>

<style></style>
