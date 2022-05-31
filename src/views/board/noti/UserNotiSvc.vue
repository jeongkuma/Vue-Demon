<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <select v-model="searchType" class="form-control mr-1">
            <option value="all">{{$t('all')}}</option>
            <option value="subject">{{$t('title')}}</option>
            <option value="content">{{$t('content')}}</option>
          </select>
          <input v-model="inputValue" type="text" class="form-control" @keyup.enter="fnGetList">
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('duration-search')}}</span>
          <datetime-picker :isPair="true" :startDate.sync="startDate" :endDate.sync="endDate"></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch()">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize()">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>

    <jqgrid
      ref="grid"
      name="userNotice"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="notiList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowDetailPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import requestApi from '@/api/ccp/requestApi'
export default {
  name: 'UserNotiSvc',
  components: {
    Jqgrid,
    DatetimePicker
  },
  props: {},
  data() {
    return {
      notiList: [],
      colNameData: [this.$t('title'), this.$t('writer'), this.$t('regDttm')],
      colModelData: [
        { name: 'subject', index: 'subject', align: 'left', width: '250' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '80' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      searchType: 'all',
      inputValue: null,
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      notiSeq: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment()
        .subtract(3, 'months')
        .toDate()
    },
    fnGetList() {
      let reqData = {
        isAdmin: 'user',
        displayRowCount: this.displayRowCount,
        currentPage: this.currentPage,
        searchStartDttm: moment(this.startDate).format('YYYYMMDD'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD')
      }
      if (this.searchType === 'all') {
        reqData.allSearch = this.inputValue
      }
      if (this.searchType === 'subject') {
        reqData.subject = this.inputValue
      }
      if (this.searchType === 'content') {
        reqData.content = this.inputValue
      }

      if (!this.endDate) {
        reqData.searchEndDttm = '99991231'
      }

      requestApi({
        url: '/online/iotnotiboard/retrieveIotNotiBoardList',
        headers: {
          'X-MID': 'P00020'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.notiList = res.data.boardList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      if (
        this.startDate &&
        this.endDate &&
        moment(this.endDate, 'YYYY-MM').diff(this.startDate, 'month') > 2
      ) {
        this.alert(this.$t('lead-noti-search-arr'), 'warning')
        return
      }
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchType = 'all'
      this.inputValue = null
      this.fnInitDate()
      this.endDate = null
    },
    fnShowDetailPopup(id) {
      let userNotice = this.notiList[id]
      this.popup({
        component: () => import('@/views/board/noti/NotiDetailSvc'),
        title: this.$t('notice'),
        width: '700',
        height: '370',
        data: {
          userNotice: userNotice
        },
        callback: data => {}
      })
    }
  }
}
</script>

<style lang="less">
</style>
