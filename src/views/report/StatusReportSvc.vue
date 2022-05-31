<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div v-if="roleCdId != '' && isAdmin" class="form-group">
          <span class="form-label mx-1">{{ $t('customer') }}</span>
          <select v-model="custSeq" class="form-control">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(item, index) in custList"
              :Key="`custSeq-${index}`"
              :value="item.custSeq"
              >{{ item.custNm }}</option
            >
          </select>
        </div>
        <div v-else class="form-group">
          <span class="form-label mx-1">{{ $t('customer') }}</span>
          <input
            type="text"
            disabled
            class="form-control"
            placeholder=""
            title="고객사"
            :value="custNm"
          />
        </div>
        <!-- 서비스 -->
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
            name=""
            class="form-control"
            @change="fnGetDevMdlList"
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
          <select v-model="devMdlCd" name="" class="form-control">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devCls-${index}`"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
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
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnGetList">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSearch"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="excelDownload">
        {{ $t('excel-download') }}
      </button>
    </div>
    <div class="grid-container">
      <div ref="tableWrap" class="table-wrap y-scroll h500">
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
                <th scope="col" v-bind:key="'comm' + n" class="bottom">
                  {{ $t('comm-rate') }}
                </th>
                <th scope="col" v-bind:key="'coll' + n" class="bottom">
                  {{ $t('coll-rate') }}
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in mydata">
              <tr
                v-if="row.gid != 7"
                v-bind:key="'bodyrow' + index"
                v-bind:class="rowClass(index)"
              >
                <template v-if="row.gid == 0">
                  <td>{{ row.custNm }}</td>
                  <td>{{ row.devClsCdNm }}</td>
                  <td>{{ row.devMdlNm }}</td>
                </template>
                <template v-else-if="row.gid == 1">
                  <td>{{ mydata[index - 1].custNm }}</td>
                  <td>{{ mydata[index - 1].devClsCdNm }}</td>
                  <td>소계</td>
                </template>
                <template v-else>
                  <td>{{ mydata[index - 2].custNm }}</td>
                  <td colspan="2">총계</td>
                </template>
                <td>{{ row.devCount }}</td>
                <template v-for="n in searchDateList.length">
                  <td v-bind:key="'bodyCommRate' + n">
                    {{ row['commRate' + (n - 1)] | percentFormat }}
                  </td>
                  <td v-bind:key="'bodyCollRate' + n">
                    {{ row['collRate' + (n - 1)] | percentFormat }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'StatusReportSvc',
  components: { DatetimePicker },
  data() {
    return {
      xMid: 'P00016',
      custNm: '',
      custSeq: '',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      startDate: '',
      endDate: '',
      custList: [],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      searchDateList: [],
      mydata: [],
      columns: [
        this.$t('customer'),
        this.$t('dev-cls'),
        this.$t('dev-mdl-nm'),
        this.$t('dev-cnt')
      ],
      footers: [], // 보여주진 않는듯
      roleCdId: ''
    }
  },
  computed: {
    getCurrentDate() {
      return moment()
    },
    getNextWeekDate() {
      return moment().add('6', 'days')
    },
    getMinDatePlusMonth() {
      return moment()
        .add(-1, 'months')
        .toDate()
    },
    getMinDateMinusMonth() {
      return moment()
        .subtract(-1, 'months')
        .toDate()
    },
    isAdmin() {
      // GN00000038: 공통관리자, GN00000033: 서비스담당자, GN00000034: GN00000034
      return (
        this.roleCdId === 'GN00000038' ||
        this.roleCdId === 'GN00000033' ||
        this.roleCdId === 'GN00000034'
      )
    }
  },
  watch: {
    svcCd() {
      this.fnGetDevClsList()
    }
  },
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
  created() {
    this.fnGetCustList()
    this.fnGetSvcCdList()
  },
  mounted() {
    this.fnInitDate()
    this.fnSetScroll()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(7, 'days')
        .toDate()
      this.endDate = moment()
        .subtract(1, 'days')
        .toDate()
    },
    fnGetCustList() {
      requestApi({
        url: '/online/iotcust/retrieveIotCustSelect',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: res => {
          this.custList = res.data
        }
      })
    },
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      this.devClsCd = ''
      this.devClsList = []
      this.devMdlCd = ''
      this.devMdlList = []
      if (this.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
        .then(data => {
          this.devClsList = data.devClsList
          if (this.devClsList.length > 0) {
            this.fnGetDevMdlList()
          }
        })
        .catch(e => {
          console.error(e)
        })
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
    fnSetScroll() {
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
    // --------------- 목록 조회
    fnGetList() {
      this.footers = []
      let reqData = {
        custSeq: this.custSeq,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchStartDttm: this.startDate
          ? moment(this.startDate).format('YYYYMMDD')
          : '',
        searchEndDttm: this.endDate
          ? moment(this.endDate).format('YYYYMMDD')
          : ''
      }

      requestApi({
        url: '/online/iotstatreport/retrieveIotStatReportList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.mydata = data.data.reportList
          this.roleCdId = data.data.roleCdId
          this.custNm = data.data.custNm

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
        }
      })
    },
    fnInitializeSearch() {
      this.custSeq = ''
      this.svcCd = ''
      this.devClsCd = ''
      this.devMdlCd = ''
      this.devMdlList = []
      this.fnInitDate()
    },
    // --------------- 목록 드로잉
    colspan(index) {
      return index > 3 ? 2 : 1
    },
    rowspan(index) {
      return index > 3 ? 1 : 2
    },
    rowClass(index) {
      return this.mydata[index].gid === 3 ? 'sum' : ''
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
      let reqData = {
        custNm: this.custNm,
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchStartDttm: this.startDate
          ? moment(this.startDate).format('YYYYMMDD')
          : '',
        searchEndDttm: this.endDate
          ? moment(this.endDate).format('YYYYMMDD')
          : ''
      }
      requestDownloadApi({
        url: '/online/iotstatreport/downloadIotStatReportList',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    }
  }
}
</script>

<style></style>
