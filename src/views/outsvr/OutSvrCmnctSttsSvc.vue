<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">서비스</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
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
          <span class="form-label mx-1">{{ $t('external-nm') }}</span>
          <select name="" class="form-control" v-model="selectedSvr">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="item in outSvrList"
              :key="item.outSvrSeq"
              :value="item.serverNm"
              >{{ item.serverNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1  ">{{ $t('duration') }}</span>
          <!-- 기간검색 -->
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{ days: 7 }"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button
            class="btn btn-info"
            type="button"
            @click="searchStatusReport()"
          >
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
      (전체/성공/실패)
      <button type="button" class="btn btn-pink" @click="excelDownload()">
        {{ $t('excel-download') }}
      </button>
    </div>

    <div class="grid-container">
      <div class="table-wrap y-scroll h500">
        <table
          id="statusReportTb"
          class="table table-col"
          style="table-layout: auto"
        >
          <caption>
            {{
              $t('comm-rate')
            }}
          </caption>
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="'colunm' + index"
                scope="col"
                :rowspan="rowspan(index)"
                :colspan="colspan(index)"
              >
                {{ column }}
              </th>
            </tr>
            <tr>
              <template v-for="n in searchDateList.length">
                <th scope="col" :key="'sendTot' + n" class="bottom">
                  송신
                </th>
                <th scope="col" :key="'recTot' + n" class="bottom">
                  수신
                </th>
                <th scope="col" :key="'tot' + n" class="bottom">전체</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in mydata">
              <tr
                v-if="
                  row.gid === 0 ||
                    row.gid === 1 ||
                    row.gid === 3 ||
                    row.gid === 7
                "
                :key="'bodyrow' + index"
                :class="rowClass(index)"
              >
                <template v-if="row.gid == 0">
                  <td>{{ row.serverNm }}</td>
                  <td>{{ row.devClsNm }}</td>
                  <td>{{ row.devMdlCd }}</td>
                </template>
                <template v-else-if="row.gid == 1">
                  <td>{{ row.serverNm }}</td>
                  <td>{{ row.devClsNm }}</td>
                  <td>{{ $t('subtotal') }}</td>
                </template>
                <template v-else-if="row.gid == 3">
                  <td>{{ row.serverNm }}</td>
                  <td>{{ $t('subtotal') }}</td>
                  <td></td>
                </template>
                <template v-else>
                  <td>{{ $t('subtotal') }}</td>
                  <td></td>
                  <td></td>
                </template>
                <template v-for="n in searchDateList.length">
                  <td
                    :key="'send' + n"
                    @click="fnCallDtlPop(row, 'S', n)"
                  >
                    {{
                      row['sendTot' + (n - 1)] +
                        '/' +
                        row['sendSuc' + (n - 1)] +
                        '/' +
                        row['sendFail' + (n - 1)]
                    }}
                  </td>
                  <td :key="'rec' + n" @click="fnCallDtlPop(row, 'R', n)">
                    {{
                      row['recTot' + (n - 1)] +
                        '/' +
                        row['recSuc' + (n - 1)] +
                        '/' +
                        row['recFail' + (n - 1)]
                    }}
                  </td>
                  <td :key="'tot' + n" @click="fnCallDtlPop(row, 'T', n)">
                    {{
                      row['tot' + (n - 1)] +
                        '/' +
                        row['totSuc' + (n - 1)] +
                        '/' +
                        row['totFail' + (n - 1)]
                    }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- contentsWrap : E -->
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import { getDevClsCdListBySvcCd, getSvcList } from '@/api/common/usrSvcDevice'

export default {
  name: 'StatusReportSvc',
  components: {
    DatetimePicker
  },
  props: {},
  filters: {
    numberFormat(value) {
      return value
        .split('')
        .reverse()
        .reduce((acc, digit, i) => {
          if (i > 0 && i % 2 === 0) acc.push(',')
          return [...acc, digit]
        }, [])
        .reverse()
        .join('')
    }
  },
  data() {
    return {
      mydata: [],
      selectedSvc: 'all',
      svcList: [],
      custNm: '',
      custNmTemp: null,
      selectedCls: 'all',
      devClsList: [],
      devClsCd: '',
      devMdlCd: '',
      devMdlNm: null,
      devMdlList: [],
      startDate: null,
      endDate: null,
      endDateTemp: null,
      startConvertDate: null,
      endConvertDate: null,
      initStartDate: null,
      initEndDttm: null,
      searchDateList: [],
      columns: [this.$t('external-nm'), this.$t('dev-cls'), this.$t('dev-mdl')],
      footers: [],
      selectedValue: '',
      selectedCust: 'all',
      excelSelectedCls: null,
      excelCustNm: null,
      excelSvcCd: null,
      excelCustSeq: null,
      excelDevMdlCd: null,
      excelStartDttm: null,
      excelEndDttm: null,
      custList: [],
      roleCdId: '',
      isAdmin: false,
      isCust: false,
      outSvrList: [],
      selectedSvr: 'all',
      excelServerNm: '',
      svcCdList: [],
      svcCd: '',
      xMid: 'P20045'
      // isAdmin: true
    }
  },
  created() {
    this.fnGetSvcCdList()
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
      this.getOutSvrNmList()
    }
  },
  mounted() {
    this.fnInitDate()
    this.searchStatusReport()

    $('.y-scroll').mCustomScrollbar({
      axis: 'yx',
      theme: '3d',
      scrollbarPosition: 'outside',
      autoHideScrollbar: true,
      advenced: { autoExpandHorizontalScroll: true },
      callbacks: {
        whileScrolling: function() {
          var fixedHeader = $(this).find('.fixed-header')
          if (fixedHeader.length) {
            fixedHeader.css({
              transform: 'translate(' + this.mcs.left + 'px, 0)'
            })
          }

          var fixedFooter = $(this).find('.fixed-footer')
          if (fixedFooter.length) {
            fixedFooter.css({
              transform: 'translate(' + this.mcs.left + 'px, 0)'
            })
          }
        },
        onUpdate: function() {
          $(this).TableFixedHeader('resizing')
          $(this).TableFixedFooter('resizing2')
        }
      }
    })
  },
  computed: {
    getCurrentDate() {
      return moment(moment().format('YYYY-MM-DD'))
    },
    getNextWeekDate() {
      return moment(moment().format('YYYY-MM-DD')).add('6', 'days')
    },
    getMinDatePlusMonth() {
      return moment(moment().format('YYYY-MM-DD'))
        .add(-1, 'months')
        .toDate()
    },
    getMinDateMinusMonth() {
      return moment(moment().format('YYYY-MM-DD'))
        .subtract(-1, 'months')
        .toDate()
    }
  },
  methods: {
    colspan(index) {
      return index > 2 ? 3 : 1
      //  return index > 4 ? 2 : 1
    },
    colspan1(index) {
      return index > 2 ? 3 : 1
      //  return index > 4 ? 2 : 1
    },
    rowspan(index) {
      return index > 2 ? 1 : 3
      //  return index > 4 ? 1 : 2
    },
    rowClass(index) {
      return this.mydata[index].gid === 3 ? 'sum' : ''
    },
    fnGetSvcCdList() {
      getSvcList({ xMid: 'P00003' })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            this.svcCd = this.svcCdList[0].svcCd
          }
        })
        .catch(e => {
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
        .then(data => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            // this.devClsCd = this.devClsList[0].devClsCd
            this.fnGetDevMdlList({ devClsCd: this.devClsCd })
          }
        })
        .catch(e => {
          console.error(e)
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
          // this.searchStatusReport()
        }
      })
    },
    getOutSvrNmList() {
      const paramObj = {}

      paramObj.svcCd = this.svcCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsOutSvrList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          // console.log(res)
          if (res.result.status === '200' || res.result.status === '204') {
            this.outSvrList = res.data.cmnctSttsOutSvrList
          }
        }
      })
    },
    searchStatusReport() {
      this.footers = []
      let reqData = {}
      if (this.startDate !== null && this.startDate !== '') {
        this.startConvertDate =
          this.startDate.getFullYear() +
          ('00' + (this.startDate.getMonth() + 1)).slice(-2) +
          ('00' + this.startDate.getDate()).slice(-2)
        reqData.searchStartDttm = this.startConvertDate
        this.excelStartDttm = this.startConvertDate
      }
      if (this.endDate !== null && this.endDate !== '') {
        this.endConvertDate =
          this.endDate.getFullYear() +
          ('00' + (this.endDate.getMonth() + 1)).slice(-2) +
          ('00' + this.endDate.getDate()).slice(-2)
        reqData.searchEndDttm = this.endConvertDate
        this.excelEndDttm = this.endConvertDate
      }

      reqData.serverNm = this.selectedSvr
      this.excelServerNm = this.selectedSvr

      this.initStartDate = this.startDate
      this.initEndDate = this.endDate

      reqData.svcCd = this.svcCd
      reqData.devClsCd = this.devClsCd
      reqData.devMdlCd = this.devMdlCd

      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsReportList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.mydata = data.data.reportList

          this.searchDateList = data.data.searchDateList
          // 날짜별 데이터 칼럼
          this.columns = this.columns.slice(0, 3)
          for (let i = 0; i < this.searchDateList.length; i++) {
            this.columns[i + 3] = this.searchDateList[i]
          }
          // tfoot 칼럼
          for (let i = 0; i < this.mydata.length; i++) {
            if (this.mydata[i].gid === 7) {
              this.footers = this.mydata[i]
            }
          }
          this.$nextTick(function() {
            if (this.mydata.length > 0) this.rowMerge()
            $('.y-scroll').TableFixedHeader('distory')
            $('.y-scroll').TableFixedHeader('enable')
            $('.y-scroll').TableFixedFooter('distory2')
            $('.y-scroll').TableFixedFooter('enable2')
          })
        }
      })
    },
    rowMerge() {
      $('#statusReportTb').each(function() {
        var table = this
        $.each([1, 2], function(c, v) {
          let tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray()
          let i = 0
          let j = 0
          for (j = 1; j < tds.length; j++) {
            if (tds[i].innerHTML !== tds[j].innerHTML) {
              $(tds[i]).attr('rowspan', j - i)
              $(tds[i]).show()
              i = j
              continue
            }
            $(tds[j]).hide()
          }
          j--
          if (tds[i].innerHTML === tds[j].innerHTML) {
            $(tds[i]).attr('rowspan', j - i + 1)
            $(tds[i]).show()
          }
        })
      })
    },
    excelDownload() {
      let reqData = {}
      reqData.searchStartDttm = this.excelStartDttm
      reqData.searchEndDttm = this.excelEndDttm
      reqData.serverNm = this.excelServerNm

      requestDownloadApi({
        url: '/online/iotoutsvrreport/excelDownloadReport',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    },
    fnInitDate() {
      // 초기 날짜 설정
      let beforeWeek = new Date()
      beforeWeek.setDate(beforeWeek.getDate() - 5)
      this.startDate = moment(beforeWeek).toDate()
      let afterWeek = new Date()
      afterWeek.setDate(afterWeek.getDate() - 1)
      this.endDate = moment(afterWeek).toDate()
    },
    fnInitializeSeach() {
      this.selectedSvr = 'all'
      this.svcCd = this.svcCdList[0].svcCd
      this.devClsCd = ''
      this.devMdlCd = ''
      this.devMdlList = []
      this.fnInitDate()
    },
    fnCallDtlPop: _.throttle(
      function(Object, gubun, idx) {
        if (gubun === 'S') {
          gubun = 'GN00000236'
        } else if (gubun === 'R') {
          gubun = 'GN00000237'
        } else {
          gubun = 'all'
        }
        let clickDate = this.searchDateList[idx - 1]
        let dtlDate = new Date(clickDate)
        dtlDate.setDate(dtlDate.getDate())
        dtlDate = moment(dtlDate).toDate()

        this.popup({
          component: () => import('@/views/outsvr/OutSvrCmnctSttsPopSvc'),
          title: this.$t('out-svr-cmnctstts-dtl'),
          width: '900',
          height: '800',
          data: {
            idx: Object,
            clickDttm: dtlDate,
            clickGubun: gubun
          },
          callback: data => {
            // 데이터 재조회
            if (data !== 'dismiss') {
              // this.fnSearchList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style lang="less" scoped>
</style>
