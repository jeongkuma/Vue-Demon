<template>
  <div class="modal-body">
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-control-static">{{ $t('collPeriod') }}</span>
            <datetime-picker
              :isPair="true"
              :startDate.sync="startDate"
              :endDate.sync="endDate"
              :duration="{days:7}"
              ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">{{$t('search')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="excelDownload" >{{$t('excel-download')}}</button>
    </div>
    <jqgrid
      ref="grid"
      name="collectorRealReportHist"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'CollectorReportHistPopSvc',
  components: { Jqgrid, DatetimePicker },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P00014',
      svcCd: '',
      devClsCd: '',
      ctn: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      colNameList: [],
      colModelData: [],
      dataList: [],
      progId: '',
      tmpCdId: '',
      entrDevSeq: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.svcCd = this.data.svcCd
    this.devClsCd = this.data.devClsCd
    this.ctn = this.data.ctn
    this.entrDevSeq = this.data.entrDevSeq
  },
  mounted() {
    this.fnInitDate()
    this.fnGetIotProg()
  },
  methods: {
    // ------------------ 옵션
    fnInitDate() {
      this.startDate = moment().subtract(1, 'days').toDate()
      this.endDate = moment().toDate()
    },
    // --------------------- 리스트 헤더 조회
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/report/CollectorRealReportSvc',
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
          if (!res.data || res.data.length === 0) {
            this.alert('프로그램 ID가 존재하지 않습니다.', 'warning')
            return
          }

          this.progId = res.data.dataList[0].progId
          this.fnGetIotTmpId(res.data.dataList[0].progSeq)
        }
      })
    },
    fnGetIotTmpId(progSeq) {
      let reqData = {
        progSeq: progSeq
      }
      requestApi({
        url: '/online/com/tmpl/getIotTmplCdId',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          this.tmpCdId = res.data.tmplCdId
          this.fnGetTmplHeaderList()
        }
      })
    },
    fnGetTmplHeaderList() {
      let reqData = {
        custSeq: '',
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
          if (!res.data) {
            console.error('헤더 정보가 없습니다.')
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

          // 수집 이력 조회
          this.fnGetList()
        }
      })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCdId: this.devClsCdId,
        ctn: this.ctn,
        entrDevSeq: this.entrDevSeq,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD'),
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotentrdevhist/retrieveEntrDevHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          // 리스트 내 dataObj json 파싱하여 목록으로 세팅
          if (res.data.entrDevHistList) {
            res.data.entrDevHistList = getDataObjOfList(res.data.entrDevHistList, 'colData')
          }

          this.dataList = res.data.entrDevHistList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page

          if (res.data.entrDevHistList.length === 0) {
            this.alert(this.$t('no-return'), 'warning')
          }
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCdId: this.devClsCdId,
        ctn: this.ctn,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD'),
        progId: this.progId,
        tmpCdId: this.tmpCdId
      }
      requestDownloadApi({
        url: '/online/iotentrdevhist/downloadEntrDevHistList',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: (data) => {}
      })
    }
  }
}
</script>

<style></style>
