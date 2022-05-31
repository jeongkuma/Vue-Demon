<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select v-model="svcCd" class="form-control" @change="setSvc($event)">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="item in svcCdList"
              v-bind:Key="item.svcCd"
              :value="item.svcCd"
              >{{ item.svcCdNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('custTypeCdId') }}</span>
          <select v-model="selectedCust" class="form-control">
            <option value="all">{{ $t('all') }}</option>
            <option
              v-for="item in custList"
              v-bind:Key="item.custSeq"
              :value="item.custSeq"
              >{{ item.custNm }}</option
            >
          </select>
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
      <button type="button" class="btn btn-pink" @click="excelDownload()">
        {{ $t('excel-download') }}
      </button>
    </div>

    <div class="grid-container">
      <div class="table-wrap y-scroll auto">
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
                v-bind:key="'colunm' + index"
                scope="col"
                v-bind:rowspan="rowspan(index)"
                v-bind:colspan="colspan(index)"
              >
                {{ column }}
              </th>
            </tr>
            <tr>
              <template v-for="n in searchDateList.length">
                <th scope="col" v-bind:key="'rate' + n" class="bottom">
                  {{ $t('outSvrRtOprtnRate') }}
                </th>
                <th scope="col" v-bind:key="'amount' + n" class="bottom">
                  {{ $t('amount') }}
                </th>
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
                v-bind:key="'bodyrow' + index"
                v-bind:class="rowClass(index)"
              >
                <template v-if="row.gid == 0">
                  <td>{{ row.svcCdNm }}</td>
                  <td>{{ row.custNm }}</td>
                  <td>{{ row.devClsCdNm }}</td>
                  <td>{{ row.devMdlCd }}</td>
                </template>
                <template v-else-if="row.gid == 1">
                  <td>{{ row.svcCdNm }}</td>
                  <td>{{ row.custNm }}</td>
                  <td>{{ row.devClsCdNm }}</td>
                  <td>{{ $t('subtotal') }}</td>
                </template>
                <template v-else-if="row.gid == 3">
                  <td>{{ row.svcCdNm }}</td>
                  <td>{{ row.custNm }}</td>
                  <td>{{ $t('subtotal') }}</td>
                  <td></td>
                </template>
                <template v-else>
                  <td>{{ row.svcCdNm }}</td>
                  <td>{{ $t('subtotal') }}</td>
                  <td></td>
                  <td></td>
                </template>
                <template v-for="n in searchDateList.length">
                  <td v-bind:key="'oprPer' + n">
                    <div
                      style="width:100%; cursor: pointer"
                      @click="openStatReportDetails(n, row)"
                    >
                      {{ row['per' + (n - 1)] | percentFormat }}
                    </div>
                  </td>
                  <td v-bind:key="'tot' + n">{{ row['tot' + (n - 1)] }}</td>
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
import { getSvcList } from '@/api/common/usrSvcDevice'

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
          if (i > 0 && i % 3 === 0) acc.push(',')
          return [...acc, digit]
        }, [])
        .reverse()
        .join('')
    },
    percentFormat(value) {
      if (value === null || typeof value === 'undefined') return ''
      return value + '%'
    }
  },
  data() {
    return {
      mydata: [],
      svcCd: 'all',
      svcCdList: [],
      custNm: '',
      custNmTemp: null,
      selectedCls: 'all',
      devClsList: [],
      devClsCd: null,
      devMdlCd: null,
      devMdlNm: null,
      devMdlList: [],
      startDate: null,
      endDate: null,
      endDateTemp: null,
      startConvertDate: null,
      endConvertDate: null,
      searchDateList: [],
      columns: [
        this.$t('service'),
        this.$t('customer'),
        this.$t('dev-cls'),
        this.$t('dev-mdl')
      ],
      footers: [],
      selectedValue: '',
      selectedCust: 'all',
      excelSelectedCls: null,
      excelCustNm: null,
      excelSvcCd: null,
      excelCustSeq: null,
      excelDevMdlCd: null,
      excelStartDate: null,
      excelEndDate: null,
      custList: [],
      roleCdId: '',
      isAdmin: false,
      isCust: false,
      xMid: 'P00116'
      // isAdmin: true
    }
  },
  watch: {},
  created() {
    this.fnGetSvcCdList()
    this.getCustList()
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
      return index > 3 ? 2 : 1
      //  return index > 4 ? 2 : 1
    },
    rowspan(index) {
      return index > 3 ? 1 : 2
      //  return index > 4 ? 1 : 2
    },
    rowClass(index) {
      return this.mydata[index].gid === 7 ? 'sum' : ''
    },
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          // if (this.svcCdList.length > 0) {
          //   this.svcCd = this.svcCdList[0].svcCd
          // }
        })
        .catch(e => {
          console.error(e)
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
      }
      if (this.endDate !== null && this.startDate !== '') {
        this.endConvertDate =
          this.endDate.getFullYear() +
          ('00' + (this.endDate.getMonth() + 1)).slice(-2) +
          ('00' + this.endDate.getDate()).slice(-2)
        reqData.searchEndDttm = this.endConvertDate
      }

      if (this.svcCd !== 'all') {
        reqData.svcCd = this.svcCd
      }

      if (this.selectedCust !== 'all') {
        reqData.custSeq = this.selectedCust
      }

      this.excelCustSeq = this.selectedCust
      this.excelSvcCd = this.svcCd
      this.excelStartDate = this.startConvertDate
      this.excelEndDate = this.endConvertDate

      requestApi({
        url: '/online/iotStatOpr/retrieveIotStatOprList',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {
          this.mydata = data.data.reportList

          this.searchDateList = data.data.searchDateList
          // 날짜별 데이터 칼럼
          this.columns = this.columns.slice(0, 4)
          for (let i = 0; i < this.searchDateList.length; i++) {
            this.columns[i + 4] = this.searchDateList[i]
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
        },
        method: 'post',
        data: reqData
      })
    },
    rowMerge() {
      $('#statusReportTb').each(function() {
        var table = this
        $.each([1, 2, 3], function(c, v) {
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
      if (
        this.excelSvcCd !== 'all' &&
        this.excelSvcCd !== '' &&
        this.excelSvcCd !== null
      ) {
        reqData.svcCd = this.excelSvcCd
      }
      if (
        this.excelCustSeq !== 'all' &&
        this.excelCustSeq !== '' &&
        this.excelCustSeq !== null
      ) {
        reqData.custSeq = this.excelCustSeq
      }
      reqData.searchStartDttm = this.excelStartDate
      reqData.searchEndDttm = this.excelEndDate

      requestDownloadApi({
        url: '/online/iotStatOpr/downloadIotStatOprList',
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
      beforeWeek.setDate(beforeWeek.getDate() - 7)
      this.startDate = moment(beforeWeek).toDate()
      let afterWeek = new Date()
      afterWeek.setDate(afterWeek.getDate() - 1)
      this.endDate = moment(afterWeek).toDate()
    },
    fnInitializeSeach() {
      this.selectedCust = 'all'
      this.svcCd = 'all'
      this.fnInitDate()
    },
    getCustNm(event) {
      this.custNmTemp = event.target.options[event.target.selectedIndex].label
    },
    // getSvcList() {
    //   requestApi({
    //     url: '/online/iotsvc/retrieveIotSvcNotCls',
    //     method: 'post',
    //     headers: {
    //       'X-MID': this.xMid
    //     },
    //     data: {},
    //     callback: (res) => {
    //       this.svcList = res.data.svcList
    //       this.svcCd = 'all'
    //       this.selectedCust = 'all'
    //     }
    //   })
    // },
    setSvc(event) {
      if (event.target.value === 'all') {
        this.selectedCust = 'all'
      } else {
        var reqData = {}
        reqData.svcCd = event.target.value
      }
    },
    getCustList() {
      let reqData = {}
      requestApi({
        url: '/online/iotcust/retrieveIotCustSelect',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: res => {
          this.custList = res.data
          this.selectedCust = 'all'
        }
      })
    },
    openStatReportDetails(idx, clickData) {
      // let clickDate = this.searchDateList[idx - 1].replaceAll('/', '-')
      let clickDate = this.searchDateList[idx - 1]

      this.popup({
        component: () => import('@/views/report/StatOprDetailPop'),
        title: this.$t('statOprReport'),
        width: '900',
        height: '780',
        data: {
          date: clickDate,
          devClsCd: clickData.devClsCd,
          devMdlCd: clickData.devMdlCd,
          svcCd: clickData.svcCd,
          custSeq: clickData.custSeq
        },
        callback: res => {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
