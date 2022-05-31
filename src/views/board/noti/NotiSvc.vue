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
          <input
            @keyup.enter="fnGetList"
            type="text"
            v-model="inputValue"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{$t('duration-search')}}</span>
          <datetime-picker :isPair="true" :startDate.sync="startDate" :endDate.sync="endDate"></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitialize">{{$t('initializing')}}</button>
        </div>
      </div>
    </div>
    <div class="mb-2 btn-wrap text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">{{ $t('create') }}</button>
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">{{ $t('delete') }}</button>
    </div>
    <jqgrid
      ref="grid"
      name="notice"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="noticeList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'NotiSvc',
  components: { Jqgrid, DatetimePicker },
  data() {
    return {
      xMid: 'P00030',
      searchType: 'all',
      inputValue: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      noticeList: [],
      colNameData: [
        this.$t('title'),
        this.$t('writer'),
        this.$t('regModDttm'),
        this.$t('noti-start-date'),
        this.$t('noti-end-date')
      ],
      colModelData: [
        { name: 'subject', index: 'subject', align: 'left', width: '350' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '80' },
        { name: 'regDttm', index: 'regDttm', align: 'center' },
        { name: 'startDt', index: 'startDt', align: 'center' },
        { name: 'endDt', index: 'endDt', align: 'center' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnInitDate()
    this.fnGetList()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment().subtract(3, 'months').toDate()
      this.endDate = null
    },
    fnGetList() {
      let reqData = {
        isAdmin: 'Admin',
        displayRowCount: this.displayRowCount,
        currentPage: this.currentPage,
        searchStartDttm: this.startDate,
        searchEndDttm: this.endDate
      }

      if (this.inputValue) {
        if (this.searchType === 'all') {
          reqData.allSearch = this.inputValue
        } else if (this.searchType === 'subject') {
          reqData.subject = this.inputValue
        } else if (this.searchType === 'content') {
          reqData.content = this.inputValue
        }
      }

      if (!this.endDate) {
        reqData.searchEndDttm = '99991231'
      }

      requestApi({
        url: '/online/iotnotiboard/retrieveIotNotiBoardList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.noticeList = res.data.boardList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.searchType = 'all'
      this.inputValue = ''
      this.fnInitDate()
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/board/noti/NotiAddSvc'),
        title: this.$t('notice-create'),
        width: '700',
        height: '528',
        data: {},
        callback: data => {
          this.alert(this.$t('success-noti'), 'success')
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      if (selectedIds.length === 0) {
        this.alert(this.$t('board-delete-no-check'), 'warning')
        return
      }

      this.confirm(this.$t('board-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let selectedIds = this.$refs.grid.getSelectionIndexs()
      let notiSeqList = []
      selectedIds.forEach(id => {
        let data = this.noticeList[id]
        notiSeqList.push(data.notiSeq)
      })
      var reqData = {
        notiSeqList: notiSeqList
      }
      requestApi({
        url: '/online/iotnotiboard/deleteIotMultiNotiBoard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data === true) {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          }
        }
      })
    },
    fnShowModifyPopup(id) {
      let notice = this.noticeList[id]
      this.popup({
        component: () => import('@/views/board/noti/NotiModifySvc'),
        title: this.$t('notice-modify'),
        width: '700',
        height: '540',
        data: {
          notice: notice
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style></style>
